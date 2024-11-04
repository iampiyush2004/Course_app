const Review = require("../models/review.model")
const Course = require("../models/course.model")
const User = require("../models/user.model")

const getCourseReview = async (req, res) => {
  const courseId = req.params.courseId; 
  if (!courseId) {
    return res.status(400).json({
      message: "Course Id not Provided!!"
    });
  }

  try {
    const reviews = await Review.find({ courseId }).populate("userId", "name avatar"); 
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this course." });
    }
    return res.status(200).json({
      message: "Reviews fetched successfully!!!", 
      reviews 
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error while Fetching Reviews!!", error });
  }
};



const addReview = async (req,res) => {
  const userId = req.user
  if(!userId) {
    return res.status(401).json({message:"Unauthorized Access!!!"})
  }  
  const courseId = req.params.courseId
  if(!courseId) {
    return res.status(400).json({message:"Course Id not provided!!!"}) 
  }
  try {
    const {comment,stars} = req.body;
    if(!comment || !stars) {
      return res.status(400).json({message:"Comment and Stars data Required!!"})
    }

    const review = await Review.create({
      comment,
      stars,
      courseId,
      userId
    })
    if (!review) {
      return res.status(500).json({
        message: "Internal Server while creating Review!!!"
      });
    }
    await Course.updateOne(
      { _id: courseId },
      { 
        $inc: { 
          totalReviews: 1,         
          totalStars: stars    
        }
      }
    );
    

    const responseReview = review.toObject({ versionKey: false });
    delete responseReview.userId; 
    delete responseReview.courseId; 

    return res.status(200).json({
      message:"Review Crated SuccessFully!!!",
      review
    })
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error!!!"})
  }
}

const editReview = async (req,res) => {
  const userId = req.user
  if(!userId) {
    return res.status(401).json({message:"Unauthorized Access!!!"})
  }  
  const courseId = req.params.courseId
  if(!courseId) {
    return res.status(400).json({message:"Course Id not provided!!!"}) 
  }
  try {
    const {comment,stars} = req.body;
    if(!comment || !stars) {
      return res.status(400).json({message:"Comment and Stars data Required!!"})
    }

    const review = await Review.findOne({courseId,userId})
    review.comment = comment
    review.stars = stars
    await review.save() 

    const responseReview = review.toObject({ versionKey: false });
    delete responseReview.userId; 
    delete responseReview.courseId; 

    return res.status(200).json({
      message:"Review Updated SuccessFully!!!",
      review
    })
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error!!!"})
  }
}

const getCoureStudentReview = async (req,res) => {
  const userId = req.user
  if(!userId) {
    return res.status(401).json({message:"Unauthorized Access!!!"})
  }  
  const courseId = req.params.courseId
  if(!courseId) {
    return res.status(400).json({message:"Course Id not provided!!!"}) 
  }
  try {
    const review = await Review.findOne({
      courseId,
      userId
    })
    if (!review) {
      // Return 404 if no review is found
      return res.status(204).json({
        message: "Review not found!!!",
      });
    }
    return res.status(200).json({
      message:"Review fetched SuccessFully!!!",
      review
    })
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error!!!"})
  }
}


module.exports = {  getCourseReview, addReview, getCoureStudentReview, editReview }