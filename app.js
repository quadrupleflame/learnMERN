const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./config/keys').mongoURI;
const users = require('./routes/api/users');
const tweets = require('./routes/api/tweets');
const User = require('./models/User');
const passport = require('passport');


const app = express();

mongoose
    .connect(db, {useNewUrlParser: true})
    .then(()=> console.log("db connected"))
    .catch(err => console.log("err in connection to db"));

const port = process.env.PORT || 5000;

app.use(passport.initialize());
require('./config/passport')(passport);
app.get("/", (req, res) => {
    
    res.send("Hell world");
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/api/users", users);
app.use("/api/tweets", tweets);


app.listen(port, () => console.log(`Server is running on port ${port}`));
