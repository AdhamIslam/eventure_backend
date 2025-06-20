require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");
const supabase = require("./supabaseClient");
const upload = multer(); // use memory storage
const router = express.Router();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ✅ Trust Proxy (for Railway)
app.set("trust proxy", 1);
//app.options("*", cors()); // handles preflight



app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,                // ✅ Railway requires this
      sameSite: "none",            // ✅ Required for cross-site cookies
    },
  })
);


// ✅ HTTPS redirect for production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ PostgreSQL setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));




app.get("/", (req, res) => {
  res.send("🚀 API is live!");
});

app.get("/clients",(req,res)=>{
    const sql = `SELECT * FROM client`;
    pool.query(sql,(err,result) => {
        if (err) return res.json(err);
        return res.status(200).json(result.rows); 
    });
});
// Endpoint for forgot password
app.post("/forgotPassword", async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required." });
  }

  const table = role === "planner" ? "event_planner" : "client";
  const idCol = role === "planner" ? "planner_id" : "client_id";

  try {
    const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "If the email is registered, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await pool.query(
      `UPDATE ${table} SET reset_token = $1, reset_token_expiry = NOW() + interval '1 hour' WHERE email = $2`,
      [token, email]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/resetPassword?token=${token}&role=${role}`;

    const mailOptions = {
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/reset-password", async (req, res) => {
  const { token, password, role } = req.body;

  if (!token || !password || !role) {
    return res.status(400).json({ error: "Token, password, and role are required" });
  }

  const table = role === "planner" ? "event_planner" : "client";
  const idField = role === "planner" ? "planner_id" : "client_id";

  try {
    const userQuery = `SELECT * FROM ${table} WHERE reset_token = $1 AND reset_token_expiry > NOW()`;
    const result = await pool.query(userQuery, [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery = `
      UPDATE ${table}
      SET pass = $1, reset_token = NULL, reset_token_expiry = NULL
      WHERE ${idField} = $2
    `;

    await pool.query(updateQuery, [hashedPassword, result.rows[0][idField]]);
    res.status(200).json({ message: "Password has been reset" });

  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/loginValidate", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM client WHERE email = $1 OR username = $1",
      [emailOrUsername]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const role = "user";
    const passwordMatch = await bcrypt.compare(password, user.pass);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Handle Unverified Email
    if (!user.is_verified) {
      const verificationCode = user.verify_code;

      if (!verificationCode) {
        return res.status(400).json({
          error: "Missing verification code. Please contact support.",
        });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Eventure" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Verify your Email",
        html: `<p>Your verification code is: <b>${verificationCode}</b></p>`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(403).json({
        error: "Unverified",
        email: user.email,
        isPlanner: false,
      });
    }

    // ✅ Set session after email is verified
    req.session.user = {
      id: user.client_id,
      role: "user",
      email: user.email
    };

    req.session.save((err) => {

      if (err) {

        console.error("Session save error (user):", err);

        return res.status(500).json({ error: "Login failed (session)" });

      }

      // clean sensitive info
      
     
      delete user.verify_code;
      delete user.pass;

      res.status(200).json({ message: "Login success", user });
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/updateUser/:id",(req,res)=>{
const userId=req.params.id;
const{firstName, lastName, email, dob,phoneNumber}=req.body;
const sql = `
    UPDATE client
    SET first_name = $1,
        last_name = $2,
        email = $3,
        dob = $4,
        phone = $5,
    WHERE client_id = $6
    RETURNING *;
  `;
  const values = [firstName, lastName, email, dob, phoneNumber,client_id];
  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Database update failed" });
    }
    return res.status(200).json(result.rows[0]);
  });
});


app.post("/signUp", async (req, res) => {
  const { firstName, lastName, username, email, phoneNumber, dob, password } = req.body;

  try {
    const checkSql = `SELECT * FROM client WHERE email = $1 OR username = $2 OR phone_number = $3`;
    const checkResult = await pool.query(checkSql, [email, username, phoneNumber]);

    if (checkResult.rows.length > 0) {
      const existing = checkResult.rows[0];
      let duplicateField = '';
      if (existing.email === email) duplicateField = 'Email';
      else if (existing.username === username) duplicateField = 'Username';
      else if (existing.phone_number === phoneNumber) duplicateField = 'Phone number';

      return res.status(400).json({ error: `${duplicateField} already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const insertSql = `
      INSERT INTO client (first_name, last_name, username, email, phone_number, dob, pass, verify_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    await pool.query(insertSql, [firstName, lastName, username, email, phoneNumber, dob, hashedPassword, verificationCode]);

    // Send email with verification code
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       // e.g. your@gmail.com
        pass: process.env.EMAIL_PASS,       // app password or real password
      },
    });

    const mailOptions = {
      from: `"Eventure" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<p>Your verification code is: <b>${verificationCode}</b></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User registered. Verification code sent to email." });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/verify-email", async (req, res) => {
  const { email, code, isPlanner } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  const table = isPlanner ? "event_planner" : "client";

  try {
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE email = $1 AND verify_code = $2`,
      [email, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    await pool.query(
      `UPDATE ${table} SET is_verified = true, verify_code = NULL WHERE email = $1`,
      [email]
    );

    res.status(200).json({ message: "Email verified successfully" });

  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/getClientProfileById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM client WHERE client_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
//**************************************************************************planner****************************************************************** */

app.post("/plannerLoginValidate",async(req,res)=>{
  const { emailOrUsername, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM event_planner WHERE email = $1 OR username = $1",
      [emailOrUsername]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const role = "planner";
    const passwordMatch = await bcrypt.compare(password, user.pass);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Handle Unverified Email
    if (!user.is_verified) {
      const verificationCode = user.verify_code;

      if (!verificationCode) {
        return res.status(400).json({
          error: "Missing verification code. Please contact support.",
        });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Eventure" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Verify your Email",
        html: `<p>Your verification code is: <b>${verificationCode}</b></p>`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(403).json({
        error: "Unverified",
        email: user.email,
        isPlanner: true,
      });
    }

    // ✅ Set session after email is verified
    req.session.user = {
      id: user.planner_id,
      role: "planner",
      email: user.email
    };

    req.session.save((err) => {

      if (err) {

        console.error("Session save error (user):", err);

        return res.status(500).json({ error: "Login failed (session)" });

      }

      // clean sensitive info
      
     
      delete user.verify_code;
      delete user.pass;

      res.status(200).json({ message: "Login success", user });
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/plannerSignUp", async (req, res) => {
  const { username, email, docs, password } = req.body;

  try {
    const checkSql = `SELECT * FROM event_planner WHERE email = $1 OR username = $2`;
    const checkResult = await pool.query(checkSql, [email, username]);

    if (checkResult.rows.length > 0) {
      const existing = checkResult.rows[0];
      let duplicateField = existing.email === email ? 'Email' : 'Username';
      return res.status(400).json({ error: `${duplicateField} already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const insertSql = `
      INSERT INTO event_planner (username, pass, docs, email, verify_code)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    await pool.query(insertSql, [username, hashedPassword, docs, email, verificationCode]);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Eventure" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Planner Account",
      html: `<p>Your verification code is: <b>${verificationCode}</b></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Planner registered. Verification code sent." });

  } catch (err) {
    console.error("Planner signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/createEvent", async (req, res) => {
  const {
    eventName,
    date,
    time,
    minAge,
    maxAge,
    category,
    description,
    address1,
    address2,
    city,
    state,
    zipCode,
    country,
    full_address,
    latitude,
    longitude,
    imageUrl
  } = req.body;
  const user = req.session.user
  const plannerId = user.id;

  if (!plannerId) {
    return res.status(401).json({ error: "Unauthorized: no planner session" });
  }

  try {
    const query = `
      INSERT INTO events (
        planner_id, event_name, event_date, event_time, 
         min_age,max_age, category, event_description,
        address_line_1, address_line_2, city, state, zip_code,
        country, full_address, latitude, longitude,event_image_url
      )
      VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16 , $17,$18
      )
      RETURNING event_id
    `;

    const values = [
      plannerId,
      eventName,
      date,
      time,
      minAge || null,
      maxAge || null,
      category,
      description,
      address1,
      address2,
      city,
      state,
      zipCode,
      country,
      full_address,
      latitude || null,
      longitude || null,
      imageUrl || null
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({ message: "Event created", eventId: result.rows[0].event_id });
  } catch (err) {
  console.error("❌ Database error:", err);  // This line is critical to show the root cause
  return res.status(500).json({ error: "Database insert error" });
  }

});

app.post("/uploadEventImage", upload.single("image"), async (req, res) =>  {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `event_${Date.now()}.${fileExt}`;

    // Upload to the root of "events-images"
    const { error: uploadError } = await supabase.storage
      .from("events-images")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return res.status(500).json({ error: "Failed to upload image" });
    }

    const { data: publicUrlData } = supabase.storage
      .from("events-images")
      .getPublicUrl(fileName);

    return res.status(200).json({ url: publicUrlData.publicUrl });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return res.status(500).json({ error: "Server error while uploading image" });
  }
});



app.post("/saveTickets", async (req, res) => {
  const { eventId, tickets } = req.body;

  if (!eventId || !Array.isArray(tickets)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const ticket of tickets) {
      const { name, price, totalTickets } = ticket;

      await client.query(
        `INSERT INTO ticket_categories (event_id, category, price, total_tickets,remaining_tickets)
         VALUES ($1, $2, $3, $4,$4)`,
        [eventId, name, price, totalTickets === "Unlimited" ? null : totalTickets]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Tickets saved successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Ticket insert error:", err);
    res.status(500).json({ error: "Database insert error" });
  } finally {
    client.release();
  }
});
//**************************************************************************Session Req****************************************************************** */
app.get("/checkSession", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });
  const { id, role } = req.session.user;
  const table = role === "planner" ? "event_planner" : "client";
  const col = role === "planner" ? "planner_id" : "client_id";
  const result = await pool.query(`SELECT * FROM ${table} WHERE ${col} = $1`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
  const userData = result.rows[0];
  delete userData.pass;
  userData.role = role;  // ✅ Inject the session role into the response
  res.status(200).json(userData);
});

// ✅ Logout
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("sessionId");
    res.status(200).json({ message: "Logged out" });
  });
});

//**************************************************************************Events****************************************************************** */
app.get("/getAllEvents", async (req, res) => {
  try {
    const result = await pool.query("SELECT event_id AS id, event_name AS title FROM events"); // adjust table/column names
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/detailedEvents", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.event_id,
        e.event_name,
        e.event_date,
        e.event_time,
        e.category,
        e.event_image_url,
        MIN(tc.price) AS min_price,
        MAX(tc.price) AS max_price,
        SUM(tc.remaining_tickets) AS total_remaining
      FROM events e
      LEFT JOIN ticket_categories tc ON e.event_id = tc.event_id
      GROUP BY e.event_id
      ORDER BY e.event_date ASC
    `);

    const events = result.rows.map(row => {
      const min = row.min_price || 0;
      const max = row.max_price || 0;
      const priceDisplay = min === max
        ? (min === 0 ? "Free" : `${min} L.E`)
        : `${min} L.E → ${max} L.E`;

      const formattedDate = new Date(row.event_date).toISOString().split("T")[0];

      return {
        id: row.event_id,
        title: row.event_name,
        date: formattedDate,
        time: row.event_time,
        category: row.category,
        image: row.event_image_url || "/utils/Event.png",
        price: priceDisplay,
        remaining: row.total_remaining ?? null,
      };
    });

    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/plannerEvents", async (req, res) => {
  const user = req.session.user;
  const plannerId = user.id;

  if (!plannerId) {
    return res.status(400).json({ error: "Missing plannerId" });
  }

  try {
    // Fetch all events created by this planner
    const eventsResult = await pool.query(
      `SELECT e.event_id, e.event_name, e.event_date, e.event_time,e.category, e.event_description, e.full_address, e.event_image_url
       FROM events e
       WHERE e.planner_id = $1
       ORDER BY e.event_date ASC`,
       [plannerId]
    );

    const events = await Promise.all(
      eventsResult.rows.map(async (event) => {
        // Fetch ticket categories for each event
        const ticketResult = await pool.query(
          `SELECT category_id, category, price, total_tickets, remaining_tickets
           FROM ticket_categories
           WHERE event_id =  $1`,
          [event.event_id]
        );
         const formattedDate = new Date(event.event_date).toISOString().split("T")[0];
    const formattedTime = event.event_time
      ? new Date(`1970-01-01T${event.event_time}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : null;

    const totalRemainingTickets = ticketResult.rows.reduce(
      (sum, t) => sum + (t.remaining_tickets || 0),
      0
    );
        return {
          ...event,
          event_date: formattedDate,
          event_time: formattedTime,
          tickets: ticketResult.rows,
          total_remaining: totalRemainingTickets,
          
        };
      })
    );

    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching planner events:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/ayneela",(req,res)=>{
  const user = req.session.user;
  res.status(200).json({ plannerId:user.id });
});


app.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
      headers: {
        "User-Agent": "eventure-app/1.0 (youremail@example.com)"
      },
    });

    if (!response.ok) {
      throw new Error("Nominatim API failed");
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Reverse geocoding error:", err);
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

// DELETE /deleteEvent/:eventId
app.delete("/deleteEvent/:eventId", async (req, res) => {
  const eventId = req.params.eventId;

  try {
    // First delete related ticket categories (if foreign key ON DELETE CASCADE is not set)
    //await pool.query("DELETE FROM ticket_categories WHERE event_id = $1", [eventId]);

    // Then delete the event itself
    await pool.query("DELETE FROM events WHERE event_id = $1", [eventId]);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

app.get("/event/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM events WHERE event_id = $1", [eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/getPlannerName/:plannerId", async (req, res) => {
  const { plannerId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM event_planner WHERE planner_id = $1", [plannerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Database error" });
  }
});

