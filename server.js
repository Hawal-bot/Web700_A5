/**********************************************************************************
WEB700 – Assignment 04
I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part of this assignment has been copied manually or electronically from any other source 
(including 3rd party web sites) or distributed to other students.
Name: HAWAL ALADE Student ID: 131191223 Date: 07/25/2024
*********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var exphbs = require("express-handlebars");
var collegeData = require("./modules/collegeData.js");


// Set up handlebars with helpers
const handlebars = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options) {
            return '<li' + ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
});

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.set('views', './views');


// Middleware to set active route
app.use((req, res, next) => { 
    let route = req.path.substring(1); 
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, "")); 
    next(); 
});

// Serving static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Setting up the routes
app.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});

app.get("/about", (req, res) => {
    res.render("about", { title: "About" });
});

app.get('/students/add', (req, res) => {
    res.render("addStudent", { title: "Add Student" });
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo", { title: "HTML Demo" });
});


app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then(data => {
                res.render("students", { students: data });
            })
            .catch(err => {
                res.render("students", { message: "no results" });
            });
    } else {
        collegeData.getAllStudents()
            .then(data => {
                res.render("students", { students: data });
            })
            .catch(err => {
                res.render("students", { message: "no results" });
            });
    }
});


app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
      .then(() => {
        res.redirect('/students');
      })
      .catch(err => {
        res.status(500).send("Unable to add student");
      });
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch(err => {
            res.status(500).send("Error updating student data");
        });
});



app.get('/courses', (req, res) => {
    collegeData.getCourses().then((data) => {
        res.render('courses', { courses: data });
    }).catch((err) => {
        res.render('courses', { message: "no results" });
    });
});



app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(data => res.render("student", { student: data }))
        .catch(err => res.render("student", { message: "Student not found" }));
});



// Initializing and starting the server
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("server is listening on port: " + HTTP_PORT);
        });
    })
    .catch(err => {
    console.log("Failed to start server: " + err);
});

// Handling 404 errors
app.use((req, res) => {
    res.status(404).send("Page Not THERE, Are you sure of the path?");
});
