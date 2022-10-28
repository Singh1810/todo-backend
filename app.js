const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const authRoute = require('./routes/auth-route');
app.use('/auth', authRoute);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/muskanJS', (err) => {
    if(err){
        console.log("Database is not connected !");
    } else {
        console.log(" DB is connected...!");
    }
});

const port = process.env.port || 8080
app.listen(port, ()=>{
    console.log("Server is connected:", port);
});

app.get('/', (req, res) => {
    res.send("Welcome to the App")
})