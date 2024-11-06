import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import ConfirmationDialog from "../../components/ConfirmationDialog"
import Loading from '../../components/Loading';

function AddVideo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [message, setMessage] = useState('');
  const [open,setOpen] = useState(false)
  const navigate = useNavigate()
  const { changeNotificationData } = useContext(Context);
  const [loading,setLoading] = useState(false)
  const { courseId } = useParams();

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'videoFile') {
      setVideoFile(files[0]);
    } else if (name === 'thumbnailFile') {
      setThumbnailFile(files[0]);
    }
  };

  const clear = () => {
    setTitle("")
    setDescription("")
    setVideoFile(null)
    setThumbnailFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !videoFile || !thumbnailFile) {
      setMessage('All fields are required');
      return;
    }
    setLoading(true)
    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnailFile);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await axios.post(`http://localhost:3000/admin/uploadVideo/${courseId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        console.log('Video uploaded successfully:', response.data);
        changeNotificationData('Video Uploaded Successfully!!!');
        setOpen(true)
        clear()
      } else {
        console.error('Unexpected response status:', response.status);
        changeNotificationData('Error Occurred!!!');
      }
    } catch (error) {
      console.log('Error uploading video:', error);
      setMessage('Error uploading video. Please try again.');
      changeNotificationData('Error Occurred!!!');
    } finally {
      setLoading(false)
    }
  };

  const onClose = () => {
    navigate("/adminName")
    setOpen(false)
  }

  const onConfirm = () => {
    clear()
    setOpen(false)
  }

  return (
    <div className='bg-green-50 w-2/3 m-auto rounded-md shadow-lg p-10'>
      {loading?
      (
        <Loading title='Uploading...'/>
      ):
      (
        <>
          <div className="mb-8 flex items-center gap-8">
            <Link to="/adminName" className="bg-gray-800 text-white py-2 px-4 text-xl rounded-md transition-transform transform hover:bg-gray-700 hover:scale-105">
              &larr; Back
            </Link>
            <h2 className='text-2xl font-bold text-center'>Upload Video</h2>
          </div>
          <form className='flex flex-col space-y-6' onSubmit={handleSubmit}>
            <div className='flex flex-col bg-gray-50 p-6 rounded-md shadow-md gap-y-5'>
              <label className='font-semibold'>Title</label>
              <input
                type='text'
                placeholder='Enter Video Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <label className='font-semibold'>Description</label>
              <textarea
                placeholder='Enter Video Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='border border-gray-300 rounded p-2 mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <div className='flex justify-between mb-4'>
                <div className='flex flex-col w-1/2 pr-2'>
                  <label className='font-semibold'>Video</label>
                  <input
                    type='file'
                    name='videoFile'
                    onChange={handleFileChange}
                    className='border border-gray-300 rounded p-2'
                  />
                </div>
                <div className='flex flex-col w-1/2 pl-2'>
                  <label className='font-semibold'>Thumbnail</label>
                  <input
                    type='file'
                    name='thumbnailFile'
                    onChange={handleFileChange}
                    className='border border-gray-300 rounded p-2'
                  />
                </div>
              </div>
              <button 
                type='submit' 
                className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'
              >
                Upload
              </button>
            </div>
            {message && <div className='text-center text-blue-500'>{message}</div>}
          </form>
          <ConfirmationDialog
            isOpen={open} 
            onClose={onClose}
            onConfirm={onConfirm}
            title="Upload more Videos"
            message=""
            />
        </>
      )
      }
    </div>
  );
}

export default AddVideo;
