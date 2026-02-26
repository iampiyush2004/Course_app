import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Context/Context';

function TeacherReviews({ adminId }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(1); 
  const [message, setMessage] = useState("");
  const [totalReviewsDisplayed, setTotalReviewsDisplayed] = useState(5);
  const { isStudentLoggedIn, changeNotificationData } = useContext(Context);
  const [studentReview, setStudentReview] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/review/admin/${adminId}`);
        if (response.status === 200) {
          setReviews(response.data.reviews); 
        }
      } catch (error) {
        console.error("Error fetching admin reviews:", error);
      }
    };

    if (adminId) {
      fetchReviews();
    }
  }, [adminId]);

  useEffect(() => {
    const getStudentReview = async () => {
      if (!isStudentLoggedIn) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/review/admin/student/${adminId}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          setStudentReview(response.data.review);
          const localData = localStorage.getItem("user");
          setStudentData(JSON.parse(localData));
        } else if (response.status === 204) {
          setStudentReview(false);
        }
      } catch (error) {
        console.error("Error fetching student admin review:", error);
      } 
    };
    getStudentReview();
  }, [isStudentLoggedIn, adminId]);

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
      const url = edit 
        ? `${import.meta.env.VITE_BACKEND_URI}/review/admin/edit/${adminId}`
        : `${import.meta.env.VITE_BACKEND_URI}/review/admin/${adminId}`;
      
      const method = edit ? 'put' : 'post';
      
      const response = await axios({
        method,
        url,
        data: { comment, stars },
        withCredentials: true
      });

      if (response.status === 200) {
        changeNotificationData(edit ? "Review Updated Successfully!!!" : "Review Posted Successfully!!!");
        if (edit) {
          setStudentReview({ ...studentReview, comment, stars });
          setEdit(false);
        } else {
          setReviews((prev) => [...prev, response.data.review]);
          setStudentReview(response.data.review);
        }
        setComment("");
        setStars(1);
      }
    } catch (error) {
      console.error("Error submitting admin review:", error);
    }
  };

  const handleEdit = () => {
    setEdit(true);
    setComment(studentReview.comment);
    setStars(studentReview.stars);
    setStudentReview(false);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/review/admin/student/${adminId}`, {
        withCredentials: true
      });
      if (response.status === 200) {
        setStudentReview(false);
        setComment("");
        setStars(1);
        setEdit(false);
        changeNotificationData("Review Deleted Successfully!!!");
        // Refresh full review list to remove deleted one
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/review/admin/${adminId}`);
        if(res.status === 200) setReviews(res.data.reviews);
      }
    } catch (error) {
      console.error("Error deleting admin review:", error);
    }
  };

  const handleLoadMore = () => {
    setTotalReviewsDisplayed((prev) => prev + 5);
  };

  return (
    <div className='mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mx-10'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2'>
        Teacher Reviews
        <span className='text-lg font-normal text-gray-400'>({reviews.length})</span>
      </h2>

      {(!studentReview || edit) && (
        <form onSubmit={handleSubmit} className='bg-green-50/50 p-6 rounded-2xl mb-10 border border-green-100'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>{edit ? "Edit Your Feedback" : "Rate Your Teacher"}</h3>
          <textarea
            value={comment}
            onChange={(e) => {
                setComment(e.target.value);
                setMessage("");
            }}
            placeholder="How was your experience with this instructor?"
            className="border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-green-400 p-4 rounded-xl w-full min-h-[120px] transition-all"
          />
          <div className="flex items-center gap-4 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  onClick={() => handleStarClick(rating)}
                  className={`cursor-pointer text-3xl transition-colors ${rating <= stars ? "text-yellow-400" : "text-gray-200"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="flex-1"></div>
            {edit && (
                <button 
                  type="button" 
                  onClick={() => {
                      setEdit(false);
                      setStudentReview(studentReview); // Restore view
                      // We need to fetch again or just set it back
                      const localData = localStorage.getItem("user");
                      setStudentData(JSON.parse(localData));
                  }} 
                  className="text-gray-500 font-semibold px-4"
                >
                  Cancel
                </button>
            )}
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-xl transition-all shadow-lg shadow-green-200">
              {edit ? "Update Feedback" : "Post Review"}
            </button>
          </div>
          {message && <div className='mt-2 text-red-500 font-medium'>{message}</div>}
        </form>
      )}

      {studentReview && !edit && (
        <div className='bg-green-50 p-6 rounded-2xl mb-10 border border-green-100 relative'>
          <div className='absolute top-6 right-6 flex gap-2'>
            <button onClick={handleEdit} className='text-green-600 hover:text-green-700 font-semibold text-sm'>Edit</button>
            <button onClick={handleDelete} className='text-red-500 hover:text-red-600 font-semibold text-sm'>Delete</button>
          </div>
          <h4 className='text-lg font-bold text-gray-800 mb-4'>Your Review</h4>
          <div className='flex gap-4'>
            <img src={studentData?.avatar} className='w-12 h-12 rounded-full object-cover shadow-sm' alt="You" />
            <div>
              <div className='font-bold text-gray-900'>{studentData?.name}</div>
              <div className='text-yellow-400 text-lg mb-2'>
                {'★'.repeat(studentReview.stars)}{'☆'.repeat(5 - studentReview.stars)}
              </div>
              <p className='text-gray-600 italic'>"{studentReview.comment}"</p>
            </div>
          </div>
        </div>
      )}

      <div className='space-y-6'>
        {reviews.length > 0 ? (
          [...reviews]
            .reverse()
            .slice(0, totalReviewsDisplayed)
            .map((review) => {
              if (studentData?._id === review.userId?._id && studentReview) return null;
              return (
                <div key={review._id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-xl">
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={review.userId?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=U"} 
                      alt={review.userId?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-bold text-gray-800">{review.userId?.name}</div>
                      <div className="text-yellow-400 text-sm">
                        {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed pl-14">"{review.comment}"</p>
                </div>
              );
            })
        ) : (
          <div className='text-center py-10'>
            <p className='text-gray-400 text-lg'>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {reviews.length > totalReviewsDisplayed && (
        <div className='mt-8 text-center'>
            <button onClick={handleLoadMore} className='text-green-600 font-bold hover:underline'>
              Load More Reviews
            </button>
        </div>
      )}
    </div>
  );
}

export default TeacherReviews;
