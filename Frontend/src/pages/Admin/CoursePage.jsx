// import React, { useEffect, useState } from 'react';
// import ReactPlayer from 'react-player';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const CoursePage = () => {
//     const { courseId } = useParams(); // Get courseId from the URL
//     const [videos, setVideos] = useState([]);
//     const [selectedVideo, setSelectedVideo] = useState('');
//     const [playbackRate, setPlaybackRate] = useState(1);
//     const [quality, setQuality] = useState('720p');

//     // Fetch videos from the API
//     const fetchVideos = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3000/courses/${courseId}/videos`);
//             console.log('API Response:', response.data); // Log the response data
//             setVideos(response.data);
//             // Set the first video as the selected one
//             if (response.data.length > 0) {
//                 setSelectedVideo(response.data[0].videoFile); // Use videoFile from the response
//             }
//         } catch (error) {
//             console.error('Error fetching videos:', error);
//         }
//     };

//     useEffect(() => {
//         fetchVideos();
//     }, [courseId]);

//     const qualityOptions = {
//         '360p': 'http://example.com/video-360p.mp4',
//         '480p': 'http://example.com/video-480p.mp4',
//         '720p': 'http://example.com/video-720p.mp4',
//         '1080p': 'http://example.com/video-1080p.mp4',
//     };

//     const handleQualityChange = (e) => {
//         setQuality(e.target.value);
//     };

//     return (
//         <div className="flex flex-col lg:flex-row bg-green-50 p-4">
//             <div className="lg:w-3/5 mb-4 lg:mb-0">
//                 {/* Aspect ratio wrapper */}
//                 <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
//                     <ReactPlayer
//                         url={selectedVideo || qualityOptions[quality]}
//                         className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
//                         controls
//                         playbackRate={playbackRate}
//                         width="100%"
//                         height="100%"
//                     />
//                 </div>
//                 <div className="mt-4 flex space-x-4">
//                     <label className="flex items-center">
//                         Playback Speed:
//                         <select
//                             value={playbackRate}
//                             onChange={(e) => setPlaybackRate(Number(e.target.value))}
//                             className="ml-2 border border-gray-300 rounded-md"
//                         >
//                             <option value={0.5}>0.5x</option>
//                             <option value={1}>1x</option>
//                             <option value={1.5}>1.5x</option>
//                             <option value={2}>2x</option>
//                         </select>
//                     </label>
//                     <label className="flex items-center">
//                         Quality:
//                         <select
//                             value={quality}
//                             onChange={handleQualityChange}
//                             className="ml-2 border border-gray-300 rounded-md"
//                         >
//                             {Object.keys(qualityOptions).map((key) => (
//                                 <option key={key} value={key}>
//                                     {key}
//                                 </option>
//                             ))}
//                         </select>
//                     </label>
//                 </div>
//             </div>
//             <div className="lg:w-2/5 overflow-y-auto h-96 bg-gray-100 rounded-lg shadow-lg p-4">
//                 <h2 className="text-lg font-bold mb-2">Videos</h2>
//                 <ul className="space-y-2">
//                     {videos.map((video) => (
//                         <li
//                             key={video._id}
//                             className="cursor-pointer p-2 hover:bg-gray-200 rounded border border-gray-300 shadow-sm"
//                             onClick={() => setSelectedVideo(video.videoFile)}
//                         >
//                             <div className="flex items-center">
//                                 <img src={video.thumbnail} alt={video.title} className="w-16 h-16 rounded-md mr-2" />
//                                 <div>
//                                     <span className="font-semibold">{video.title}</span>
//                                     <div className="text-xs text-gray-500">{video.createdBy?.name}</div> {/* Display teacher's name */}
//                                 </div>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default CoursePage;
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CoursePage = () => {
    const { courseId } = useParams(); // Get courseId from the URL
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('720p');
    const [currentVideoTitle, setCurrentVideoTitle] = useState('');
    const [currentVideoAdmin, setCurrentVideoAdmin] = useState({});

    // Fetch videos from the API
    const fetchVideos = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/courses/${courseId}/videos`);
            console.log('API Response:', response.data); // Log the response data
            setVideos(response.data);
            // Set the first video as the selected one
            if (response.data.length > 0) {
                setSelectedVideo(response.data[0].videoFile); // Use videoFile from the response
                setCurrentVideoTitle(response.data[0].title);
                setCurrentVideoAdmin(response.data[0].createdBy); // Set admin for the first video
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [courseId]);

    const qualityOptions = {
        '360p': 'http://example.com/video-360p.mp4',
        '480p': 'http://example.com/video-480p.mp4',
        '720p': 'http://example.com/video-720p.mp4',
        '1080p': 'http://example.com/video-1080p.mp4',
    };

    const handleQualityChange = (e) => {
        setQuality(e.target.value);
    };

    const handleVideoSelect = (video) => {
        setSelectedVideo(video.videoFile);
        setCurrentVideoTitle(video.title);
        setCurrentVideoAdmin(video.createdBy); // Set admin for the selected video
    };

    return (
        <div className="flex flex-col lg:flex-row bg-green-50 p-4">
            <div className="lg:w-3/5 mb-4 lg:mb-0">
                {/* Aspect ratio wrapper */}
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                    <ReactPlayer
                        url={selectedVideo || qualityOptions[quality]}
                        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                        controls
                        playbackRate={playbackRate}
                        width="100%"
                        height="100%"
                    />
                </div>
                <div className="mt-4 flex space-x-4">
                    <label className="flex items-center">
                        Playback Speed:
                        <select
                            value={playbackRate}
                            onChange={(e) => setPlaybackRate(Number(e.target.value))}
                            className="ml-2 border border-gray-300 rounded-md"
                        >
                            <option value={0.5}>0.5x</option>
                            <option value={1}>1x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2x</option>
                        </select>
                    </label>
                    <label className="flex items-center">
                        Quality:
                        <select
                            value={quality}
                            onChange={handleQualityChange}
                            className="ml-2 border border-gray-300 rounded-md"
                        >
                            {Object.keys(qualityOptions).map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                {/* Current Video Title and Admin Avatar */}
                <div className="flex items-center mt-4">
                    <img 
                        src={currentVideoAdmin.avatar} 
                        alt={currentVideoAdmin.name} 
                        className="w-8 h-8 rounded-full mr-2" 
                    />
                    <span className="font-bold">{currentVideoTitle}</span>
                </div>
            </div>
            <div className="lg:w-2/5 overflow-y-auto h-96 bg-gray-100 rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-bold mb-2">Videos</h2>
                <ul className="space-y-2">
                    {videos.map((video) => (
                        <li
                            key={video._id}
                            className="cursor-pointer p-2 hover:bg-gray-200 rounded border border-gray-300 shadow-sm"
                            onClick={() => handleVideoSelect(video)}
                        >
                            <div className="flex items-center">
                                <img src={video.thumbnail} alt={video.title} className="w-16 h-16 rounded-md mr-2" />
                                <div>
                                    <span className="font-semibold">{video.title}</span>
                                    <div className="text-xs text-gray-500">{video.createdBy?.name}</div> {/* Display teacher's name */}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CoursePage;
