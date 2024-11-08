import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleUpload = async () => {
    console.log("hi")
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }

    // Prepare the FormData for Cloudinary upload
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('upload_preset', 'courseApp');  // Set your Cloudinary upload preset
    formData.append('cloud_name', 'dxpg55uck');  // Set your Cloudinary cloud name

    try {
      // Upload the video to Cloudinary using Axios
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dxpg55uck/video/upload', 
        formData, 
        { 
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.url) {
        setVideoUrl(response.data.url); // Get the Cloudinary URL for the uploaded video
        console.log(response.data)
        alert('Video uploaded successfully!');
      } else {
        alert('Failed to upload video');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video');
    }
  };

  return (
    <div>
      <h1>Upload a Video</h1>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload Video</button>

      {videoUrl && (
        <div>
          <h3>Video Preview:</h3>
          <video width="320" height="240" controls>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
