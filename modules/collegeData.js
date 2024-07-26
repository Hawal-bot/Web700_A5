const fs = require('fs');
const path = require('path');

const studentsFilePath = path.join(__dirname, 'data', 'students.json');
const coursesFilePath = path.join(__dirname, 'data', 'students.json');


class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); 
                return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); 
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

module.exports.getAllStudents = function() {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(dataCollection.students);
    });
};

module.exports.getCourses = function() {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(dataCollection.courses);
    });
};

module.exports.getCourseById = function(id) {
    return new Promise((resolve, reject) => {
        let foundCourse = dataCollection.courses.find(course => course.courseId == id);
        if (foundCourse) {
            resolve(foundCourse);
        } else {
            reject("query returned 0 results");
        }
    });
};

module.exports.getStudentByNum = function(num) {
  return new Promise((resolve, reject) => {
      console.log(`Searching for student with studentNum: ${num}`);
      let student = dataCollection.students.find(s => s.studentNum == num);
      if (student) {
          console.log("Student found:", student);
          resolve(student);
      } else {
          console.log("Student not found");
          reject("Student not found");
      }
  });
};


module.exports.updateStudent = function(updatedStudent) {
    return new Promise((resolve, reject) => {
        let index = dataCollection.students.findIndex(s => s.studentNum == updatedStudent.studentNum);
        if (index !== -1) {
            dataCollection.students[index] = updatedStudent;
            fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 2), 'utf8', (err) => {
                if (err) {
                    reject("Unable to write to students.json");
                } else {
                    resolve();
                }
            });
        } else {
            reject("Student not found");
        }
    });
};

module.exports.getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {
        const filteredStudents = dataCollection.students.filter(student => student.course === course);

        if (filteredStudents.length === 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = studentData.TA !== undefined;

        studentData.studentNum = dataCollection.students.length + 1;

        dataCollection.students.push(studentData);

        fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 2), 'utf8', (err) => {
            if (err) {
                reject("Unable to write to students.json");
                return;
            }
            resolve();
        });
    });
};


module.exports.updateStudent = function(updatedStudent) {
    return new Promise((resolve, reject) => {
        let index = dataCollection.students.findIndex(s => s.studentNum == updatedStudent.studentNum);
        if (index !== -1) {
            updatedStudent.TA = updatedStudent.TA !== undefined; // Handle TA checkbox
            dataCollection.students[index] = updatedStudent;

            // Save the updated students array to the file
            fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 2), 'utf8', (err) => {
                if (err) {
                    reject("Unable to write to students.json");
                } else {
                    resolve();
                }
            });
        } else {
            reject("Student not found");
        }
    });
};
