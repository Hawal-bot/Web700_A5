/**********************************************************************************
WEB700 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part of this assignment has been copied manually or electronically from any other source 
(including 3rd party web sites) or distributed to other students.
Name: HAWAL ALADE Student ID: 131191223 Date: 06/14/2024
*********************************************************************************/

var HTTP_PORT = process.env.PORT||8080;
const { Console } = require("console");
var express = require("express");
var app = express();
var path = require("path");
var collegeData = require("./modules/collegeData.js");
const exp = require("constants");

app.use(express.static("public"));

// setting upp the routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "./views/about.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "./views/htmlDemo.html"));
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then(data => res.json(data))
            .catch(err => res.json({ message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then(data => res.json(data))
            .catch(err => res.json({ message: err }));
    }
});

app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then(data => res.json(data))
        .catch(err => res.json({ message: err }))
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(data => res.json(data))
        .catch(err => res.json({ message: "no results" }))
});

app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(data => res.json(data))
        .catch(err => res.json({ message: err }))
});


app.use((req, res) => {
    res.status(404).send("Page Not THERE, Are you sure of the path?");
});

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("server is listening on port: " + HTTP_PORT);
        });
    })
    .catch(err => {
    console.log("Failed to start server: " + err);
});