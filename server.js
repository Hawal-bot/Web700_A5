/**********************************************************************************
WEB700 – Assignment 04
I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
No part of this assignment has been copied manually or electronically from any other source 
(including 3rd party web sites) or distributed to other students.
Name: HAWAL ALADE       Student ID: 131191223       Date: 08/01/2024
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
    collegeData.getCourses()
    .then((data) => {
        res.render("addStudent", { courses: data });
    })
    .catch(() => {
        res.render("addStudent", { courses: [] });
    });
    
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo", { title: "HTML Demo" });
});


// Updating the /students route
app.get("/students", (req, res) => {
    collegeData.getAllStudents()
        .then((data) => {
            if (data.length > 0) {
                res.render("students", { students: data });
            } else {
                res.render("students", { message: "no results" });
            }
        })
        .catch((err) => {
            res.render("students", { message: "no results" });
        });
});


// Updating the /courses route
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((data) => {
            if (data.length > 0) {
                res.render("courses", { courses: data });
            } else {
                res.render("courses", { message: "no results" });
            }
        })
        .catch((err) => {
            res.render("courses", { message: "no results" });
        });
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


app.get("/student/:studentNum", (req, res) => {
    let viewData = {};
    collegeData.getStudentByNum(req.params.studentNum)
        .then((data) => {
            if (data) {
                viewData.student = data;
            } else {
                viewData.student = null;
            }
        })
        .catch(() => {
            viewData.student = null;
        })
        .then(collegeData.getCourses)
        .then((data) => {
            viewData.courses = data;
            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }
        })
        .catch(() => {
            viewData.courses = [];
        })
        .then(() => {
            if (viewData.student == null) {
                res.status(404).send("Student Not Found");
            } else {
                res.render("student", { viewData: viewData });
            }
        });
});



// Route to display the add course form
app.get('/courses/add', (req, res) => {
    res.render('addCourse');
});



// Route to handle the addition of a new course
app.post('/courses/add', (req, res) => {
    collegeData.addCourse(req.body)
        .then(() => {
            res.redirect('/courses');
        })
        .catch((err) => {
            res.status(500).send("Unable to add course");
        });
});



// Route to handle updating an existing course
app.post('/course/update', (req, res) => {
    collegeData.updateCourse(req.body)
        .then(() => {
            res.redirect('/courses');
        })
        .catch((err) => {
            res.status(500).send("Unable to update course");
        });
});



// Route to display a specific course
app.get('/course/:id', (req, res) => {
    collegeData.getCourseById(req.params.id)
        .then((data) => {
            if (data) {
                res.render('course', { course: data });
            } else {
                res.status(404).send("Course Not Found");
            }
        })
        .catch(() => {
            res.status(404).send("Course Not Found");
        });
});



// Route to handle deleting a course
app.get('/course/delete/:id', (req, res) => {
    collegeData.deleteCourseById(req.params.id)
        .then(() => {
            res.redirect('/courses');
        })
        .catch(() => {
            res.status(500).send("Unable to Remove Course / Course not found");
        });
});


// Route to handle deleting a student
app.get('/student/delete/:studentNum', (req, res) => {
    data.deleteStudentByNum(req.params.studentNum)
        .then(() => {
            res.redirect('/students');
        })
        .catch((err) => {
            res.status(500).send("Unable to Remove Student / Student not found");
        });
});



// Handling 404 errors
app.use((req, res) => {
    res.status(404).send("Page Not THERE, Are you sure of the path?");
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