const express =require("express");
const cors = require ("cors");
require("dotenv").config();
console.log("🔎 HELLO =", process.env.HELLO);
console.log("🔗 DATABASE_URL =", process.env.DATABASE_URL);

const app = express();
const bodyParser =require("body-parser");
const { Connection } = require("pg");
const PORT = process.env.PORT || 4000;
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");



const { appendFileSync } = require("fs");




app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend.vercel.app"], // add Vercel domain later too
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

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
  const { email } = req.body;

  // 1. Check if user exists
  const sql = `SELECT * FROM client WHERE email = $1`;
  pool.query(sql, [email], async (err, result) => {
    if (err || result.rows.length === 0) {
      return res.status(200).json({ message: "If the email is registered, a reset link has been sent." });
    }

    const user = result.rows[0];

    // 2. Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // 3. Save token with expiration (in memory or DB; better to use DB)
    const updateSql = `UPDATE client SET reset_token = $1, reset_token_expiry = NOW() + interval '1 hour' WHERE email = $2`;
    await pool.query(updateSql, [token, email]);

    // 4. Send email (simplified example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173//resetPassword?token=${token}`; // Frontend reset route
    const mailOptions = {
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Reset link sent" });
  });
});

app.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;
  
    try {
      const userQuery = `SELECT * FROM client WHERE reset_token = $1 AND reset_token_expiry > NOW()`;
      const result = await pool.query(userQuery, [token]);
  
      if (result.rows.length === 0) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const updateQuery = `UPDATE client
        SET pass = $1, reset_token = NULL, reset_token_expiry = NULL
        WHERE client_id = $2
      `;
  
      await pool.query(updateQuery, [hashedPassword, result.rows[0].client_id]);
      res.status(200).json({ message: "Password has been reset" });
    } catch (err) {
      console.error("Reset error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

app.post("/loginValidate",async(req,res)=>{
    const {emailOrUsername,password}=req.body;
    try{
      const result=await pool.query("SELECT * FROM client WHERE email = $1 OR username = $1",[emailOrUsername]);
      if(result.rows.length===0){
        return res.status(401).json({error:"Invalid credentials"});
      }
     
      const user=result.rows[0];
      const matching=await bcrypt.compare(password,user.pass);
      if(!matching){
        return res.status(401).json({error:"Invalid credentials"});
      }
      if (!user.is_verified) {
        const verificationCode = user.verify_code;

        // If verify_code is missing (shouldn't happen), return error
        if (!verificationCode) {
          return res.status(400).json({ error: "Missing verification code. Please contact support." });
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
          html: `<p>Your existing verification code is: <b>${verificationCode}</b></p>`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(403).json({
          error: "Unverified",
          email: user.email,
          isPlanner: false,
        });
      }


      delete user.pass; // to remove pass from user when sending it to front-end (security)
      res.status(200).json(user);
    }catch(err){
      console.error("Login error",err);
      res.status(500).json({error:"Internal server error"});
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



//**************************************************************************planner****************************************************************** */

app.post("/plannerLoginValidate",async(req,res)=>{
  const {emailOrUsername,password}=req.body;
  try{
    const result=await pool.query("SELECT * FROM event_planner WHERE email = $1 OR username = $1",[emailOrUsername]);
    if(result.rows.length===0){
      return res.status(401).json({error:"Invalid Email or Username"});
    }
    const user=result.rows[0];
    const matching=await bcrypt.compare(password,user.pass);
    if(!matching){
      return res.status(401).json({error:"Invalid credentials"});
    }
    if (!user.is_verified) {
      const verificationCode = user.verify_code;

      // If verify_code is missing (shouldn't happen), return error
      if (!verificationCode) {
        return res.status(400).json({ error: "Missing verification code. Please contact support." });
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
        html: `<p>Your existing verification code is: <b>${verificationCode}</b></p>`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(403).json({
        error: "Unverified",
        email: user.email,
        isPlanner: false,
      });
    }

    if(!user.enabled){
      return res.status(400).json({ error: "Your account is pending please chaeck later!" });
    }

    delete user.pass; // to remove pass from user when sending it to front-end (security)
    res.status(200).json(user);
  }catch(err){
    console.error("Login error",err);
    res.status(500).json({error:"Internal server error"});
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



app.post("/createEvent",(req,res)=>{
  const {plannerId, eventName, date, time, location, minAge, category, description} = req.body;

  const sqlQuery = `INSERT INTO events (planner_id,event_name,event_date,event_address,min_age,category,event_time,event_description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`

  pool.query(sqlQuery, [plannerId, eventName, date, location, minAge, category, time,description], (checkErr, checkResult)=>{
      if (checkErr) return res.status(500).json({ error: "Database error during check" });
      return res.sendStatus(201);});

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
        `INSERT INTO ticket_categories (event_id, category, price, total_tickets)
         VALUES ($1, $2, $3, $4)`,
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

