import express from 'express';
import Class from '../models/classModel.js';
import User from '../models/userModel.js';
import Assignment from '../models/assignmentModel.js';
import mongodb from 'mongodb';
import mongoose from 'mongoose';
const ObjectId = mongodb.ObjectID;
const router = express.Router();
router.route('/').get((req, res) => {
  Class.find()
    .then(classes => res.json(classes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const courseCode = req.body.courseCode;
  const name = req.body.name;
  const semester = req.body.semester;
  const instructorsEmailid =req.body.instructorsEmailid;
  const studentsEmailid = req.body.studentsEmailid;
  const assignments = [];
 
  console.log(instructorsEmailid);
  console.log(studentsEmailid);

  //const instructors =[];
  const students =[];
  let instructors=[]
  instructors=[{
    "$ref" : "users",
    "$id" : mongoose.Schema.Types.ObjectId("60b49627558c5556e85ca1c0")
      
  }];
  User.find()
   .then(users=>users.forEach((user)=>{
     if(instructorsEmailid.includes(user.emailid)){
     
      
     }
     
     if(studentsEmailid.includes(user.emailid)){
      // students.push({
      //   "$ref" : "users",
      //   "$id" : ObjectId("60b4960b558c5556e85ca1bf"),
      //   "$db" : "gradEd"
      // })
      res.json("students: ", user.emailid);
     }
   })).then(()=>{
    const newClass = new Class({courseCode, name , semester ,instructors, students,assignments});

    newClass.save()
      .then(() => res.json('Class added!'))
      .catch(err => res.status(400).json('Error: ' + err));
   });

});


router.route('/:id/addAssignment').post((req, res) => {
  const assignmentCode = req.body.assignmentCode;
  const courseCode = req.params.id;
  const description = req.body.description;
  const title = req.body.title;
  const dueDate = new Date(req.body.dueDate);
  const penality = req.body.penality;
  const lateDueDate = new Date(req.body.lateDueDate);
  const allowLate = req.body.allowLate;
  let users = [];
  const attachments = [];
  Class.findById(req.params.id).then(async (assignmentClass)=>{
      await assignmentClass.students.forEach((assignmentClassStudent)=>{
            users = [...users, assignmentClassStudent]
      });
  }).then(()=>{
  const newAssignment = new Assignment({
    users,
    assignmentCode,
    courseCode,
    description,
    title,
    dueDate,
    lateDueDate,
    penality,
    allowLate,
    attachments
  });
  console.log("NA",newAssignment);
  newAssignment.save()
      .then(() => {
        Class.findById(req.params.id).then((assignmentclass)=> {
        
              assignmentclass.assignments.push(newAssignment);
              assignmentclass.save().then(()=>
              res.json("Assignment saved")
              ).catch((err)=>console.log(err))

        }).catch((err)=>console.log(err))
      }).catch((err)=>console.log(err))
    })
    });
     
    
  router.route('/:id/addStudent').post((req, res) => {
        const studentEmailId = req.body.studentEmailId;
        
        User.find()
   .then(users=>users.forEach((user)=>{
         if(user.emailId===studentEmailId){
                  Class.findById(req.params.id).then((userClass)=>{
                        userClass.students.push(user);
                        userClass.save()
                  .then(() => res.json('Student added!'))
                  .catch(err => res.status(400).json('Error: ' + err));
                  });
                  
         }
      }
   ))

  });


  router.route('/:id/addInstructor').post((req, res) => {
    const instructorEmailId = req.body.instructorEmailId;
    
    User.find().then(users=>users.forEach((user)=>{
     if(user.emailId===instructorEmailId){
              Class.findById(req.params.id).then((userClass)=>{
                    userClass.instructors.push(user);
                    userClass.save()
              .then(() => res.json('Instructor added!'))
              .catch(err => res.status(400).json('Error: ' + err));
              });
              
            }
        }
      ))

   });

router.route('/:id').delete((req, res) => {
  Class.findByIdAndDelete(req.params.id)
    .then(() => res.json('Class deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Class.findById(req.params.id)
    .then(selectedClass => res.json(selectedClass))
    .catch(err => res.status(400).json('Error: ' + err));
});


export default router;