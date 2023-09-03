const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const studentSchema=  new Schema({
    studentName: {type: String, required: true},
    studentEmail: {type: String, required: true},
    studentContact:{type: Number, required: true},
    studentAddress:{type: String, required: true},
    studentId: {type: Number, required: true, unique: true},
    studentDOB : {type: Date, required: true},
    studentClass: {type: String, required: true}
})

studentSchema.plugin(uniqueValidator);

const Student = mongoose.model("Student", studentSchema)
module.exports = Student;