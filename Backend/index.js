const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const courseRouter = require("./routes/courses")
const reviewRouter = require("./routes/review")
const progressRouter = require("./routes/progress")
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



connectDB()
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/courses" , courseRouter);
app.use("/review", reviewRouter);
app.use("/progress", progressRouter);

const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
