const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const schoolClassSchema = new Schema({
    value: {type: String, required: true},
    label: {type: String, required: true}
})


const schoolSchema = new Schema({
    schoolName: { type: String, required: true },
    schoolEmail: { type: String, required: true, unique: true },
    schoolAddress: { type: String, required: true},
    schoolEmailSuffix: { type: String, required: true, unique: true },
    schoolClasses: [schoolClassSchema],
    classSubjects:  {
        type: Map,
        of: [
            {
                value: {
                    type: String,
                    required: true
                },
                label: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    schoolId: { type: Number, required: true, unique: true },
  });
  schoolSchema.plugin(uniqueValidator);

  const School = mongoose.model("School", schoolSchema);

  module.exports = School;
