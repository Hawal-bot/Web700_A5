const Sequelize = require('sequelize');

var sequelize = new Sequelize('dkak9jdusi4j4', 'u2f1e3r7h7gljh', 'p8af0df3d04cddefeb9a935c9badc67b10c0bb817768c5696c750a4e9e58de7cd', {
    host: 'c1i13pt05ja4ag.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Defining the data models for students and courses
const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

// Defining the relationship
Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Unable to sync the database: " + err);
            });
    });
};

// Get All Students
module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// Get students by course
module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { course: course }
        })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// Get Students By Student Number
module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { studentNum: num }
        })
            .then((data) => {
                if (data.length > 0) {
                    resolve(data[0]);
                } else {
                    reject("no results returned");
                }
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// Get all courses
module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        Course.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// Get Course by ID
module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: { courseId: id }
        })
            .then((data) => {
                if (data.length > 0) {
                    resolve(data[0]);
                } else {
                    reject("no results returned");
                }
            })
            .catch(() => {
                reject("no results returned");
            });
    });
};

// Add a new Student
module.exports.addStudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    for (let prop in studentData) {
        if (studentData[prop] === "") studentData[prop] = null;
    }
    return new Promise((resolve, reject) => {
        Student.create(studentData)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Unable to create student: " + err);
            });
    });
};

// Update an Existing Student
module.exports.updateStudent = function (updatedStudent) {
    updatedStudent.TA = (updatedStudent.TA) ? true : false;
    for (let prop in updatedStudent) {
        if (updatedStudent[prop] === "") updatedStudent[prop] = null;
    }
    return new Promise((resolve, reject) => {
        Student.update(updatedStudent, {
            where: { studentNum: updatedStudent.studentNum }
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Unable to update student: " + err);
            });
    });
};

// Add a new course
module.exports.addCourse = function (courseData) {
    for (let prop in courseData) {
        if (courseData[prop] === "") courseData[prop] = null;
    }
    return new Promise((resolve, reject) => {
        Course.create(courseData)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Unable to create course: " + err);
            });
    });
};

// Update an Existing Course
module.exports.updateCourse = function (courseData) {
    for (let prop in courseData) {
        if (courseData[prop] === "") courseData[prop] = null;
    }
    return new Promise((resolve, reject) => {
        Course.update(courseData, {
            where: { courseId: courseData.courseId }
        })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject("Unable to update course: " + err);
            });
    });
};

// Delete a Course By ID
module.exports.deleteCourseById = function (id) {
    return new Promise((resolve, reject) => {
        Course.destroy({
            where: { courseId: id }
        })
            .then((rowsDeleted) => {
                if (rowsDeleted > 0) {
                    resolve();
                } else {
                    reject("Unable to delete course");
                }
            })
            .catch((err) => {
                reject("Unable to delete course: " + err);
            });
    });
};

// Delete a Student By Student Number
module.exports.deleteStudentByNum = function (studentNum) {
    return new Promise((resolve, reject) => {
        Student.destroy({
            where: { studentNum: studentNum }
        })
            .then((rowsDeleted) => {
                if (rowsDeleted > 0) {
                    resolve();
                } else {
                    reject("Unable to remove student / student not found");
                }
            })
            .catch((err) => {
                reject("Unable to remove student / student not found: " + err);
            });
    });
};