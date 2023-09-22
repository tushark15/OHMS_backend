const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const staffClassSchema = new Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const staffSchema = new Schema({
  staffName: { type: String, required: true },
  staffEmail: { type: String, required: true, unique: true },
  staffPassword: { type: String, required: true },
  schoolId: { type: Number, required: true },
  school: { type: Schema.Types.ObjectId, ref: 'School' },
  staffClasses: [staffClassSchema],
  staffSubjects: {
    type: Map,
    of: [
      {
        value: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
      },
    ],
  },
  isAdmin: { type: Boolean, required: true },
});

staffSchema.plugin(uniqueValidator);

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
