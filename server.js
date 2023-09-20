require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const schoolRoutes = require("./routes/school-routes")
const staffRoutes = require("./routes/staff-routes")
const studentRoutes = require("./routes/student-routes")
const homeworkRoutes = require("./routes/homework-routes")

const app = express();
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster.ix4viru.mongodb.net/`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Connected to MongoDB"));

app.use(cors())
app.use(express.json());


app.use("/api/school", schoolRoutes)
app.use("/api/staff", staffRoutes)
app.use("/api/student", studentRoutes)
app.use("/api/homework", homeworkRoutes)


app.use((error, req, res, next) => {
  // if response has been sent
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error has occured" });
});


app.listen(process.env.API_PORT, () => {
  console.log(`Example app listening on port ${process.env.API_PORT}!`);
});
