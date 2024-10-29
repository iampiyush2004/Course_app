const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const Course = require("./models/course.model");
const connectDB = require("./db/index")
const app = express();
const cookieParser = require('cookie-parser');

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true 
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

// userRouter.//for fetching all courses
app.get("/allCourses", async (req, res) => {
 
  // console.log(Course)
  const response = await Course.find({})
  res.json({courses : response})

});



connectDB()
app.use("/admin", adminRouter);
app.use("/user", userRouter);

const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
