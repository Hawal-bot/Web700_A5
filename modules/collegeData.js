const fs = require("fs");
const path = require('path');
const studentsFilePath = path.join(__dirname, 'data', 'students.json');
const coursesFilePath = path.join(__dirname, 'data', 'students.json');

class Data{
    constructor(students, courses){
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

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length === 0) {
            reject("query returned 0 results"); 
            return;
        }

        resolve(dataCollection.students);
    });
};

module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
      const filteredStudents = dataCollection.students.filter(student => student.TA === true);
  
      if (filteredStudents.length === 0) {
        reject("query returned 0 results");
        return;
      }
  
      resolve(filteredStudents);
    });
  };

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length === 0) {
        reject("query returned 0 results"); 
        return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
      const foundStudent = dataCollection.students.find(student => student.studentNum === num);
  
      if (!foundStudent) {
        reject("query returned 0 results");
        return;
      }
  
      resolve(foundStudent);
    });
  };


module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    const filteredStudents = dataCollection.students.filter(student => student.course === course);

    if (filteredStudents.length === 0) {
      reject("query returned 0 results");
      return;
    }

    resolve(filteredStudents);
  });
};



module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/students.json', 'utf8', (err, data) => {
        if (err) {
          reject("Unable to read file");
          return;
        }
  
        let students = JSON.parse(data);
  
        // Handling the TA checkbox: if it's undefined, set it to false
        studentData.TA = studentData.TA !== undefined;
  
        // Setting the student number to be the length of the students array plus one
        studentData.studentNum = students.length + 1;
  
        // Adding the new student data to the array
        students.push(studentData);
  
        // Writing the updated students array back to the file
        fs.writeFile('./data/students.json', JSON.stringify(students, null, 2), 'utf8', (err) => {
          if (err) {
            reject("Unable to write file");
            return;
          }
          resolve();
        });
      });
    });
};
