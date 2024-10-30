const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const courseRouter = require("./routes/courses")
const Course = require("./models/course.model");
const connectDB = require("./db/index")
const app = express();


app.use(
  cors({
    origin: "http://localhost:5173", 
  })
);

app.use(bodyParser.json());





connectDB()
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/courses" , courseRouter);

const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
