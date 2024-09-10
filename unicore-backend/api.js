const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(cors());
app.use(express.json());

const today = new Date();
const month = today.getMonth()+1;
const year = today.getFullYear();
const date = today.getDate();
const currentDate = year + "/" + month + "/" + date;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "unicoredb"
})

//login
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM tbuseraccounts WHERE `user_idnum` = ?  AND `user_password` = ?";
    db.query(sql, [req.body.user_idnum,req.body.user_password], (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        else return res.json(result);
    })
})

//get user type
app.get('/users/user_type', (req, res) => {
    const user_idnum = req.params.id
    const sql = "SELECT user_type FROM tbuseraccounts WHERE `user_idnum` = ?";
    db.query(sql, user_idnum, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
    });
})

//listen
app.listen(8081, () => {
    console.log("Listening");
})