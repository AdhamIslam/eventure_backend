const express =require("express");
const cors = require ("cors");
require("dotenv").config();
console.log("🔎 HELLO =", process.env.HELLO);
console.log("🔗 DATABASE_URL =", process.env.DATABASE_URL);

const app = express();
const bodyParser =require("body-parser");
const { Connection } = require("pg");
const port = 3005;
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const { appendFileSync } = require("fs");


app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.listen(port,(err)=>{
    if (err) throw err;
    console.log(err);
    console.log("🔗 Connecting to DB with:", process.env.DATABASE_URL);
    console.log("Server running");
});

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
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
        user: "",
        pass: "",
      },
    });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`; // Frontend reset route
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
    const {email,password}=req.body;
    try{
      const result=await pool.query("SELECT * FROM client WHERE email = $1",[email]);
      if(result.rows.length===0){
        return res.status(401).json({error:"Invalid credentials"});
      }
      const user=result.rows[0];
      const matching=await bcrypt.compare(password,user.pass);
      if(!matching){
        return res.status(401).json({error:"Invalid credentials"});
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
app.post("/signUp",(req,res)=>{
    const { firstName, lastName, username, email, phoneNumber, dob, password } = req.body;

    const checkSql = `SELECT * FROM client WHERE email = $1 OR username = $2 OR phone_number = $3`;
    pool.query(checkSql, [email, username, phoneNumber], async(checkErr, checkResult) => {
        if (checkErr){
          console.error("DB check error:", checkErr);
          return res.status(500).json({ error: "Database error during check" });
        } 

        if (checkResult.rows.length > 0) {
            // Determine what field is duplicated
            const existing = checkResult.rows[0];
            let duplicateField = '';
            if (existing.email === email) duplicateField = 'Email';
            else if (existing.username === username) duplicateField = 'Username';
            else if (existing.phone === phoneNumber) duplicateField = 'Phone number';

            return res.status(400).json({ error: `${duplicateField} already exists.` });
        }

        // No duplicates, proceed to insert
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertSql = `INSERT INTO client (first_name, last_name, username, email, phone_number, dob, pass) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
        pool.query(insertSql, [firstName, lastName, username, email, phoneNumber, dob, hashedPassword], (err, result) => {
            if (err){
              console.error("DB check error:", checkErr);
              return res.status(500).json({ error: "Error inserting user" });
            } 
            return res.status(201).json(result.rows[0]);
        });
    });
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
    delete user.pass; // to remove pass from user when sending it to front-end (security)
    res.status(200).json(user);
  }catch(err){
    console.error("Login error",err);
    res.status(500).json({error:"Internal server error"});
  }
});


app.post("/plannerSignUp",(req,res)=>{
  const {  username, email, docs, password } = req.body;

  const checkSql = `SELECT * FROM event_planner WHERE email = $1 OR username = $2`;
  pool.query(checkSql, [email, username], async(checkErr, checkResult) => {
      if (checkErr) return res.status(500).json({ error: "Database error during check" });

      if (checkResult.rows.length > 0) {
          // Determine what field is duplicated
          const existing = checkResult.rows[0];
          let duplicateField = '';
          if (existing.email === email) duplicateField = 'Email';
          else if (existing.username === username) duplicateField = 'Username';
          
          return res.status(400).json({ error: `${duplicateField} already exists.` });
      }

      // No duplicates, proceed to insert
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertSql = `INSERT INTO event_planner (username,pass,docs,email) VALUES ($1,$2,$3,$4) RETURNING *`;
      pool.query(insertSql, [ username, hashedPassword, docs, email], (err, result) => {
          if (err) return res.status(500).json({ error: "Error inserting planner" });
          return res.status(201).json(result.rows[0]);
      });
  });
});


app.post("/createEvent",(req,res)=>{
  const {plannerId, eventName, date, time, location, minAge, category, description} = req.body;

  const sqlQuery = `INSERT INTO events (planner_id,event_name,event_date,event_address,min_age,category,event_time,event_description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`

  pool.query(sqlQuery, [plannerId, eventName, date, location, minAge, category, time,description], (checkErr, checkResult)=>{
      if (checkErr) return res.status(500).json({ error: "Database error during check" });
      return res.sendStatus(201);});

});
