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

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/review/${course_id}`);
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
        setReviews((prev) => [ ...prev, response.data.review]); // Add the new review to the list
        setComment(""); 
        setStars(1); 
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleLoadMore = () => {
    setTotalReviewsDisplayed((prev) => prev + 5); // Increase the count of displayed reviews
  };

  return (
    <div className='mt-6 bg-gray-50 p-5 rounded-lg w-full'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>Reviews</h2>
      <form onSubmit={handleSubmit} className='bg-blue-50 p-4 rounded-md mb-5'>
        <h1 className='mb-2 text-1xl font-serif font-semibold'>Add Review</h1>
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
        {message && <div className='text-center text-red-500'>{message}</div>}
      </form>
      <div>
        {reviews.length > 0 ? (
          [...reviews].reverse() // Reverse the reviews array
            .slice(0, Math.min(totalReviewsDisplayed, reviews.length))
            .map((review, index) => (
              <div key={index} className='border border-gray-200 rounded-lg p-4 mb-4 flex items-start'>
                <img
                  src={review.avatar} // Ensure this field exists
                  alt={review.user}
                  className='w-10 h-10 rounded-full mr-4'
                />
                <div className='flex-1'>
                  <div className='font-semibold text-gray-800'>{review.user}</div>
                  <div className='text-gray-600'>{review.comment}</div>
                  <div className='text-yellow-500'>{'★'.repeat(review.stars)}</div> {/* Display star rating */}
                </div>
              </div>
            ))
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
