const Review = require("../models/review.model")

const getCourseReview = async (req, res) => {
  const courseId = req.params.courseId; 
  if (!courseId) {
    return res.status(400).json({
      message: "Course Id not Provided!!"
    });
  }

  try {
    const reviews = await Review.find({ courseId }); 
    if (!reviews) {
      return res.status(500).json({ message: "Internal Server Error while Fetching Reviews!!" });
    }
    return res.status(200).json({
      message: "Reviews Successfully fetched!!!", 
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

module.exports = {  getCourseReview, addReview }