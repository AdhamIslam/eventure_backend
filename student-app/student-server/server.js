const express =require("express");
const cors = require ("cors");
const postgresPool = require("pg").Pool;
const app = express();
const bodyParser =require("body-parser");
const { Connection } = require("pg");
const port = 3005;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.listen(port,(err)=>{
    if (err) throw err;
    console.log(err);
    console.log("Server running");
});

const pool =new postgresPool({
    user:"odoo",
    password:"odoo",
    database:"eventure",
    host:"localhost",
    port:5432,
    max:10
});

pool.connect((err,Connection)=>{
    if (err) throw err;
    console.log(err);
    console.log("db connected successfully")
});

app.get("/clients",(req,res)=>{
    const sql = `SELECT * FROM client`;
    pool.query(sql,(err,result) => {
        if (err) return res.json(err);
        return res.status(200).json(result.rows); 
    });
});

app.get("/loginValidate/:email",(req,res)=>{
    const email = req.params.email;
    const sql = `SELECT * FROM client WHERE email = $1`;
    pool.query(sql,[email],(err,result) => {
        if (err) return res.json(err);
        return res.status(200).json(result.rows[0]); 
    });
});

app.post("/students",(req,res)=>{
    const {name,major,email} = req.body;
    const sql = `INSERT INTO student (name,major,email) VALUES ($1,$2,$3) RETURNING *`;
    pool.query(sql,[name,major,email],(err,result) => {
        if (err) return res.json(err);
        return res.status(201).json(result.rows[0]); 
    });
});

app.patch("/students/:student_id",(req,res)=>{
    const student_id = Number(req.params.student_id);
    const {name,major,email} = req.body;
    const sql = `UPDATE student SET name=$1 , major = $2 , email=$3 WHERE student_id = $4`;
    pool.query(sql,[name,major,email,student_id],(err,result) => {
        if (err) return res.json(err);
        return res.status(200).send("Student is updated"); 
    });
});

app.delete("/students/:student_id",(req,res)=>{
    const student_id = Number(req.params.student_id);
    const sql = `DELETE FROM student WHERE student_id=$1`;
    pool.query(sql,[student_id],(err,result) => {
        if (err) return res.json(err);
        return res.status(200).send("Student is deleted"); 
    });
});