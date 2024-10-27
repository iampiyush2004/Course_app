const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const {Course} = require('./db');
const app = express();


app.use(
  cors({
    origin: "http://localhost:5173", 
  })
);

app.use(bodyParser.json());

//for fetching all courses
app.get("/allCourses", async (req, res) => {
 
  console.log(Course)
  const response = await Course.find({})
        res.json({courses : response})

});




app.use("/admin", adminRouter);
app.use("/user", userRouter);

const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
