const express = require("express");
const mongoose = require('mongoose');

const app = express();
const db = require('./config/keys').mongoURI;

mongoose
    .connect(db, {useNewUrlParser: true})
    .then(()=> console.log("db connected"))
    .catch(err => console.log("err in connection to db"));
    
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hell world"));

app.listen(port, () => console.log(`Server is running on port ${port}`));
