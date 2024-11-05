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
    const reviews = await Review.find({ courseId }).populate("userId","name avatar"); 
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

const editReview = async (req, res) => {
  const userId = req.user;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized Access!!!" });
  }

  const courseId = req.params.courseId;
  if (!courseId) {
    return res.status(400).json({ message: "Course Id not provided!!!" });
  }

  try {
    const { comment, stars } = req.body;

    if (!comment || !stars) {
      return res.status(400).json({ message: "Comment and Stars data Required!!" });
    }

    const review = await Review.findOne({ courseId, userId });

    if (!review) {
      return res.status(404).json({ message: "Review not found for this user on the given course!!!" });
    }

    const starsDifference = stars - review.stars;

    await Course.updateOne(
      { _id: courseId },
      { $inc: { totalStars : starsDifference } }
    );

    await Review.updateOne(
      { courseId, userId },
      { $set: { comment: comment, stars: stars } } 
    );

    const responseReview = {
      comment,
      stars
    };

    return res.status(200).json({
      message: "Review Updated Successfully!!!",
      review: responseReview
    });

  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: "Internal Server Error!!!" });
  }
};

const deleteReview = async (req, res) => {
  const userId = req.user;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized Access!!!" });
  }

  const courseId = req.params.courseId;
  if (!courseId) {
    return res.status(400).json({ message: "Course Id not provided!!!" });
  }

  try {
    const review = await Review.findOne({ courseId, userId });

    if (!review) {
      return res.status(404).json({ message: "Review not found for this user on the given course!!!" });
    }

    const stars = review.stars;

    await Course.updateOne(
      { _id: courseId },
      { 
        $inc: { 
          totalStars: -stars,  
          totalReviews: -1     
        }
      }
    );

    await Review.deleteOne({ courseId, userId });

    return res.status(200).json({
      message: "Review Deleted Successfully!!!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!!!" });
  }
};

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

const getStudentReview = async (req, res) => {
  const userId = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const reviews = await Review.find({ userId }).populate("courseId", "title");

    if (!reviews) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching reviews", error: error.message });
  }
};



module.exports = {  getCourseReview, addReview, getCoureStudentReview, editReview, deleteReview, getStudentReview }