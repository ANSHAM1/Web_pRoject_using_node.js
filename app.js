const express = require("express");
const pug = require("pug");
const path = require("path");
const body = require("body-parser");
var mongoose = require("mongoose");
const app = express();
const port = 80;
// -------------------------serving-files-----------------------------------
app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.status(200).render('index.pug');
})

app.get('/signup.pug', (req, res) => {
    res.render(path.join(__dirname, '/views/signup.pug'));
});

// ----------------------------database---------------------------------------
mongoose.connect('mongodb://localhost/tempdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.on('open', function () {
    console.log("we are connected");
});

// --------------------------getting-data---------------------------------------    
var n_schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    }
});

var n_model = mongoose.model('n_model', n_schema);

app.post("/data", async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send('Email and password are required');
    }
    const SaveUser = new n_model(req.body);
    try {
        await SaveUser.save();
        console.log("Data saved successfully");
        res.render(path.join(__dirname, '/views/index.pug'));
    } catch (err) {
        console.error(err);
    }
});
// --------------------------lestening to server-------------------------------

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});






