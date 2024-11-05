import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../Context/Context';

function Reviews({ course_id }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(1); 
  const [message, setMessage] = useState("");
  const [totalReviewsDisplayed, setTotalReviewsDisplayed] = useState(5);
  const { isStudentLoggedIn, changeNotificationData } = useContext(Context);
  const [studentReview,setStudentReview] = useState(false)
  const [studentData,setStudentData] = useState(null)
  const [edit,setEdit] = useState(false)

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/review/course/${course_id}`);
        if (response.status === 200) {
          setReviews(response.data.reviews); 
        } else {
          console.log("Error occurred in fetching reviews");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (course_id) {
      fetchReview();
    }
  }, [course_id]);

  const handleStarClick = (rating) => {
    setStars(rating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(edit) {
      handleEditSubmit()
      return
    }
    if (!isStudentLoggedIn) {
      changeNotificationData("Student Login Required!!!");
      return;
    }
    if (!comment) {
      setMessage("Comment Required!!!");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3000/review/${course_id}`, {
        comment,
        stars
      }, {
        withCredentials: true
      });
      if (response.status === 200) {
        changeNotificationData("Comment Posted Successfully!!!");
        setReviews((prev) => [ ...prev, response.data.review]); 
        setStudentReview(response.data.review)
        setComment(""); 
        setEdit(false)
        setStars(1); 
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleLoadMore = () => {
    setTotalReviewsDisplayed((prev) => prev + 5); // Increase the count of displayed reviews
  };

  useEffect(()=>{
    const getUserReview = async() => {
      if(!isStudentLoggedIn) return
      try {
        const response = await axios.get(`http://localhost:3000/review/student/${course_id}`,{
          withCredentials:true
        }) 
        if(response.status===200){
          setStudentReview(response.data.review)
          const localData = localStorage.getItem("user")
          setStudentData(JSON.parse(localData))
        }
        else if(response.status===204){
          setStudentReview(false)
        }
        else console.log("Error in student review!!")
      } catch (error) {
        console.error(error)
      } 
    }
    getUserReview()
  },[isStudentLoggedIn])

  const handleEdit = () => {
    setEdit(true)
    setComment(studentReview.comment)
    setStars(studentReview.stars)
    setStudentReview(false)
  }

  const handleEditSubmit = async() => {
    try {
      const response = await axios.put(`http://localhost:3000/review/edit/${course_id}`,{comment,stars},{
        withCredentials:true
      })
      if(response.status===200){
        setEdit(false)
        setStudentReview({comment,stars})
        changeNotificationData("Comment Updated SuccessFully!!!")
      }
      else console.log("error occurred")
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async() => {
    try {
      const response = await axios.delete(`http://localhost:3000/review/student/${course_id}`,{
        withCredentials:true
      })
      if(response.status===200){
        setStudentReview(false)
        setComment("")
        setStars(1)
        changeNotificationData("Review Deleted Successfully!!!")
      } else console.log("Error Occurred in Deleting Review")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='mt-6 bg-gray-50 p-5 rounded-lg w-full'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>Reviews</h2>
      {!studentReview  && <form onSubmit={handleSubmit} className='bg-blue-50 p-4 rounded-md mb-5'>
        <h1 className='mb-2 text-1xl font-serif font-semibold'>{edit?"Edit Review":"Add Review"}</h1>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          className="border p-2 rounded w-full min-h-20"
        />
        <div className="flex mb-3">
          {[1, 2, 3, 4, 5].map((rating) => (
            <span
              key={rating}
              onClick={() => handleStarClick(rating)}
              className={`cursor-pointer text-${rating <= stars ? "yellow-500" : "gray-300"} text-2xl`}
            >
              ★
            </span>
          ))}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Review
        </button>
        {edit && <button onClick={()=>handleDelete()} className="bg-red-500 text-white p-2 rounded ml-4">
          Delete Review
        </button>}
        {message && <div className='text-center text-red-500'>{message}</div>}
      </form>}
      {
        studentReview && 
        <div className='bg-gray-100 p-3 rounded-md mb-3 flex flex-col gap-y-4'>
          <h1 className='text-xl'>Your Review</h1>
          <div className='border border-gray-200 rounded-lg p-4 flex items-start flex-col gap-y-5'>
            <div className='flex gap-x-2 items-center'>
              <img
                src={studentData?.avatar} 
                alt={"hi"}
                className='w-10 h-10 rounded-full mr-4'
              />
              <div className='flex flex-col items-center'>
                <div>{studentData?.name}</div>
              </div>
            </div>
            <div className='flex-1'> 
              <div className='font-semibold text-gray-800'>{studentReview?.user}</div>
              <div className='text-gray-600'>{studentReview?.comment}</div>
              <div className='text-yellow-500'>
                {'★'.repeat(studentReview?.stars)}
                {'☆'.repeat(5 - studentReview?.stars)}
              </div> 
            </div>
          </div>
          <div className='flex'>
            <button className='bg-blue-400 px-4 py-2 rounded-md text-white' onClick={() => handleEdit()}>
              Edit
            </button>
          </div>
        </div>
      }
      {/* Review Section */}
      <div>
          {reviews.length > 0 ? (
            [...reviews]
              .reverse() 
              .slice(0, Math.min(totalReviewsDisplayed, reviews.length))
              .map((review) => {
                if (studentData?._id === review.userId?._id) {
                  return null; 
                }

                return (
                  <div key={review._id} className="border border-gray-200 rounded-lg p-4 mb-4 flex flex-col">
                    <div className="flex items-center mb-2">
                      <img
                        src={review.userId?.avatar} 
                        alt={review.userId?.name || "User Avatar"}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className="font-semibold text-gray-800">{review.userId?.name}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-600 my-1">{review.comment}</div>
                      <div className="text-yellow-500">
                        {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)} 
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
          <div className='text-gray-600 text-xl text-center'>Be the first one to leave a review.</div>
        )}
      </div>

      {reviews.length > totalReviewsDisplayed && (
        <button 
          onClick={handleLoadMore} 
          className='mt-4 bg-blue-500 text-white p-2 rounded'
        >
          Load More Reviews
        </button>
      )}
    </div>
  );
}

export default Reviews;
