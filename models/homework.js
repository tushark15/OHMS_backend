const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const homeworkSchema = new Schema({
  schoolClass: { type: String, required: true },
  classSubject: { type: String, required: true},
  uploadDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  homework: { type: Schema.Types.Mixed, required: true},
  note: { type: String},
  schoolId: { type: Number, required: true },
  school: { type: Schema.Types.ObjectId, ref: "School", required: true },
});

homeworkSchema.plugin(uniqueValidator);

const Homework = mongoose.model("Homework", homeworkSchema);
module.exports = Homework;
