import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Context } from '../../Context/Context';
function AddVideo() {
  const [message,setMessage] = useState("")
  const [videoInputs, setVideoInputs] = useState([{ title: '', description: '', videoFile: null, thumbnailFile: null }]);
  const {changeLoaderData, changeNotificationData} = useContext(Context)
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newInputs = [...videoInputs];
    newInputs[index][name] = value;
    setVideoInputs(newInputs);
  };

  const handleFileChange = (index, event) => {
    const { name, files } = event.target;
    const newInputs = [...videoInputs];
    newInputs[index][name] = files[0];
    setVideoInputs(newInputs);
  };

  const { courseId } = useParams();

  const addNewInput = () => {
    setVideoInputs([...videoInputs, { title: '', description: '', videoFile: null, thumbnailFile: null }]);
  };

  const handleSubmit = async(input) => {
    console.log(input)
    if(input.title.trim()===""||input.description.trim()===""||!input.videoFile||!input.thumbnailFile) {
      setMessage("All Field Are Required")
      return
    }
    const formData = new FormData();
    formData.append('videoFile', input.videoFile); // Assuming videoFile is the file object
    formData.append('thumbnail', input.thumbnailFile); 
    formData.append('title', input.title);
    formData.append('description', input.description);
    // formData.append('duration', duration); 
    try {
      const response = await axios.post(`http://localhost:3000/admin/uploadVideo/${courseId}`,formData,{
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      })
      if(response.status === 200){
        console.log('Video uploaded successfully:', response.data);
        changeNotificationData("Video Uploaded Successfully!!!")
      } 
      else {
        console.error('Unexpected response status:', response.status);
        changeNotificationData("Error Occurred!!!"); 
      }
    } catch (error) {
      console.log('Error uploading video:', error);
      setMessage("Error uploading video. Please try again.");
      changeNotificationData("catch Error Occurred!!!");
    }
  };

  return (
    <div className='bg-white w-2/3 m-auto min-h-[80vh] rounded-md shadow-lg p-6'>
      <h1 className='text-2xl font-bold text-center mb-6'>Upload Video</h1>
      <form className='flex flex-col space-y-6'>
        {videoInputs.map((input, index) => (
          <div key={index} className='flex flex-col bg-gray-100 p-6 rounded-md shadow-md'>
            <label className='font-semibold'>Title</label>
            <input
              type='text'
              name='title'
              placeholder='Enter Video Title'
              value={input.title}
              onChange={(e) => handleInputChange(index, e)}
              className='border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <label className='font-semibold'>Description</label>
            <textarea
              name='description'
              placeholder='Enter Video Description'
              value={input.description}
              onChange={(e) => handleInputChange(index, e)}
              className='border border-gray-300 rounded p-2 mb-4 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <div className='flex justify-between mb-4'>
              <div className='flex flex-col w-1/2 pr-2'>
                <label className='font-semibold'>Video</label>
                <input
                  type='file'
                  name='videoFile'
                  onChange={(e) => handleFileChange(index, e)}
                  className='border border-gray-300 rounded p-2'
                />
              </div>
              <div className='flex flex-col w-1/2 pl-2'>
                <label className='font-semibold'>Thumbnail</label>
                <input
                  type='file'
                  name='thumbnailFile'
                  onChange={(e) => handleFileChange(index, e)}
                  className='border border-gray-300 rounded p-2'
                />
              </div>
            </div>
            <button 
              type='button' 
              onClick={()=>handleSubmit(input)} 
              className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'
            >
              Upload 
            </button>

          </div>
        ))}
        <div className='flex justify-center gap-4'>
          <button 
            type='button' 
            onClick={addNewInput} 
            className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-1/3'
          >
            ➕ Add More
          </button>
          <button 
            type='button' 
            onClick={handleSubmit} 
            className='bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-1/3'
          >
            No More Changes 
          </button>
        </div>
        {message?<div className='text-center text-blue-500'>{message}</div>:""}
      </form>
    </div>
  );
}

export default AddVideo;
