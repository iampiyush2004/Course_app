import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Loading from "../../components/Loading"

const CoursePage = () => {
    const { courseId } = useParams(); // Get courseId from the URL
    const [teacherInfo,setTeacherInfo] = useState(null)
    const [allData,setAllData] = useState(null)
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('720p');
    const [currentVideoTitle, setCurrentVideoTitle] = useState('');
    const [currentVideoAdmin, setCurrentVideoAdmin] = useState({});
    const [selected,setSelected] = useState(null)
    const [currentVideo,setCurrentVideo] = useState(null)
    const [loading,setLoading] = useState(true)
    // Fetch videos from the API
    const fetchVideos = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:3000/courses/videos/${courseId}`);
            console.log('API Response:', response.data); // Log the response data
            setVideos(response.data.videos);
            setTeacherInfo(response.data.teacher)
            setAllData(response.data)
            if (response.data.videos.length > 0) {
                setSelectedVideo(response.data.videos[0].videoFile); // Use videoFile from the response
                setCurrentVideoTitle(response.data.videos[0].title);
                setCurrentVideoAdmin(response.data.videos[0].createdBy); // Set admin for the first video
                setCurrentVideo(response.data.videos[0])
                setSelected(0)
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally{
            setLoading(false)
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

    const handleVideoSelect = (video,index) => {
        setSelectedVideo(video.videoFile);
        setCurrentVideoTitle(video.title);
        setCurrentVideoAdmin(video.createdBy); // Set admin for the selected video
        setSelected(index)
        setCurrentVideo(video)
    };

    return (
        <div>
            {
                loading?(
                    <Loading/>
                ):(
                    <div className="flex flex-col lg:flex-row p-4 lg:space-x-10">
                        {/* left Part */}
                        <div className="lg:w-[58%] mb-4 lg:mb-0 lg:ml-[6%] bg-green-50 rounded-md">
                            {/* Video player */}
                            <div className="relative w-full rounded-md overflow-hidden" style={{ paddingTop: '56.25%' }}> {/* Added rounded-md and overflow-hidden */}
                                <ReactPlayer
                                    url={selectedVideo || qualityOptions[quality]}
                                    className="absolute top-0 left-0 w-full h-full bg-black"
                                    controls
                                    width="100%"
                                    height="100%"
                                />
                            </div>

                            {/* Title */}
                            <div className='p-4 flex flex-col gap-y-3'>
                                <div className='text-2xl font-bold mb-2'>{currentVideo?.title}</div>
                                <Link to={`/teacher/${teacherInfo?._id}`} className="flex items-center mb-2"> {/* Flex layout for image and name */}
                                    <img 
                                        src={teacherInfo?.avatar} 
                                        alt={teacherInfo?.username} 
                                        className="w-10 h-10 rounded-full mr-3 border border-gray-300" /> 
                                    <div className='flex flex-col'>
                                        <div className='text-lg font-semibold'>{teacherInfo?.name}</div>
                                        <div className='text-sm text-gray-500'>@{teacherInfo?.username}</div>
                                    </div>
                                </Link>
                                <div className='bg-green-100 p-2 rounded-md'>
                                    <div className='text-gray-700 mb-4'>{currentVideo?.description}</div>
                                </div>
                                
                            </div>

                        </div>


                        {/* right part */}
                        <div className="w-[30vw] rounded-lg shadow-2xl h-[70vh] bg-green-50 p-6 border border-gray-200">
                            <div className='ml-3 mb-2'>
                                <h2 className="text-2xl font-bold text-gray-800">{allData?.title}</h2>
                                <div className='flex items-center gap-x-4'>
                                    <h3>Playlist</h3>
                                    <div>|</div>
                                    <div> {selected+1}/{videos.length}</div>
                                </div>
                            </div>
                            <ul className="space-y-4 overflow-y-auto h-[calc(70vh-6rem)] overflow-x-hidden p-2"> {/* Added padding to the list */}
                                {videos.map((video,index) => (
                                    <li
                                        key={video._id}
                                        className={`cursor-pointer p-4 border border-gray-300 rounded-lg hover:rounded-lg flex justify-start ${
                                            selected===index?"bg-green-100":""
                                        }`}
                                        onClick={() => handleVideoSelect(video,index)}
                                        style={{ height: '95px' }}
                                    >
                                        <div className="flex gap-x-4 items-center">
                                            <div className='text-xs'>
                                                {index+1}
                                            </div>
                                            <img 
                                                src={video.thumbnail} 
                                                alt={video.title} 
                                                className="w-28 h-20 rounded-lg shadow-md object-cover" // Added shadow and object-cover for better visual separation
                                            />
                                            <div>
                                                <span className="font-semibold text-lg text-gray-700">{video.title}</span>
                                                <div className="text-sm text-gray-500">{teacherInfo.name}</div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default CoursePage;