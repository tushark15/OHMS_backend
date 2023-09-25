const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  schoolClass: { type: String, required: true },
  classSubject: { type: String, required: true },
  uploadDate: { type: Date, required: true },
  studentId: { type: Number, required: true },
  submission: { type: Schema.Types.Mixed, required: true },
  note: { type: String },
  schoolId: { type: Number, required: true },
  homework: { type: Schema.Types.ObjectId, ref: "Homework", required: true },
  school: { type: Schema.Types.ObjectId, ref: "School", required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
});

submissionSchema.plugin(uniqueValidator);

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
