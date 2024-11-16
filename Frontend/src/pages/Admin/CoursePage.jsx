import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Loading from "../../components/Loading";

const CoursePage = () => {
    const { courseId } = useParams(); // Get courseId from the URL
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [allData, setAllData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [selected, setSelected] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(true); // Set autoplay to true by default
    const [hasLogged, setHasLogged] = useState(true); // To ensure the log happens only once
    const [currentTime,setCurrentTime] = useState(0)
    const [progress,setProgress] = useState(null)
    const currentTimeRef = useRef(currentTime);
    const selectedRef = useRef(selected);
    const playingRef = useRef(playing)

    // Update refs when state changes
    useEffect(() => {
        currentTimeRef.current = currentTime;
        selectedRef.current = selected;
        playingRef.current = playing 
    }, [currentTime, selected]);
    
    // fetching videos
    useEffect(() => {
        const fetchVideos = async () => {
        
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3000/courses/videos/${courseId}`, {
                    withCredentials: true
                });
    
                setVideos(response.data.videos);
                setTeacherInfo(response.data.teacher);
                setAllData(response.data);
                if (response.data.videos.length > 0) {
                    setCurrentVideo(response.data.videos[0]);
                    setSelected(0);
                }
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [courseId]);

    // onProgress callback to track current video time
    const handleProgress = (progress) => {
        const currentTime = progress.playedSeconds;
        setCurrentTime(currentTime)
    };

    // for updating progress
    const updateProgress = async() => {
        if(!currentTimeRef.current===null || currentTimeRef.current===0) return
        if(!selectedRef.current===null) return
        try {
            const response = await axios.put(`http://localhost:3000/progress/update/${courseId}`,{
                videoId : selectedRef.current,
                timeStamp : currentTimeRef.current
            },{withCredentials : true})
            if(response.status===200){
                // console.log("Success!!!")
            }
            else{
                console.log("Error in updating timestamp")
            }
        } catch (error) {
            console.error("Error",error)
        }
    }
    useEffect(() => {
        // Function to be called every 10 seconds
        const intervalId = setInterval(() => {
          updateProgress()
        }, 10000); 
    
        return () => {
          clearInterval(intervalId);
        };
    }, []);
    
    // for fetching progress
    useEffect(()=>{
        const fetchProgress = async() => {
            try {
                const response = await axios.get(`http://localhost:3000/progress/getProgress/${courseId}`,{
                    withCredentials : true
                })
                if(response.status===200){
                    setProgress(response.data.progress)
                }
                else{
                    console.log("Error in fetching progress")
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchProgress()
        // const local = JSON.parse(localStorage.getItem("videoStamps"))
        // if(local && local[courseId]){
        //     setProgress(local[courseId])
        // }
        // else{
            
        // }
    },[])

    useEffect(()=>{
        if(!videos || !progress) return
        setCurrentVideo(videos[progress.videoId])
        setSelected(progress.videoId)
    },[videos,progress])

    // for setting video time inittially
    const handleReady = () => {
        if (videoRef.current && hasLogged) {
            videoRef.current.seekTo(progress.timeStamp, 'seconds');
            setHasLogged(false)
        }
    };

    // for playing next video after another
    const nextVideoPlay = () => {
        if(selected+1<videos.length){
            setCurrentVideo(videos[selected+1]);
            setSelected(selected+1)
        }
    }

    // video selector
    const handleVideoSelect = (video, index) => {
        setSelected(index);
        setCurrentVideo(video);
    };
    return (
        <div>
            {
                loading ? (
                    <Loading />
                ) : (
                    <div className="flex flex-col lg:flex-row p-4 lg:space-x-10">
                        {/* Left Part */}
                        <div className="lg:w-[58%] mb-4 lg:mb-0 lg:ml-[6%] bg-green-50 rounded-md">
                            {/* Video player */}
                            <div className="relative w-full rounded-md overflow-hidden" style={{ paddingTop: '56.25%' }}>
                                <ReactPlayer
                                    url={currentVideo?.videoFile}
                                    ref={videoRef}
                                    playing={playing}
                                    className="absolute top-0 left-0 w-full h-full bg-black"
                                    controls
                                    width="100%"
                                    height="100%"
                                    muted={true}  
                                    onReady={handleReady}
                                    onEnded={nextVideoPlay}
                                    onProgress={handleProgress} // Track progress
                                />
                            </div>

                            {/* Title */}
                            <div className='p-4 flex flex-col gap-y-3'>
                                <div className='text-2xl font-bold mb-2'>{currentVideo?.title}</div>
                                <Link to={`/teacher/${teacherInfo?._id}`} className="flex items-center mb-2">
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

                        {/* Right Part */}
                        <div className="w-[30vw] rounded-lg shadow-2xl h-[70vh] bg-green-50 p-6 border border-gray-200">
                            <div className='ml-3 mb-2'>
                                <h2 className="text-2xl font-bold text-gray-800">{allData?.title}</h2>
                                <div className='flex items-center gap-x-4'>
                                    <h3>Playlist</h3>
                                    <div>|</div>
                                    <div> {selected + 1}/{videos.length}</div>
                                </div>
                            </div>
                            <ul className="space-y-4 overflow-y-auto h-[calc(70vh-6rem)] overflow-x-hidden p-2">
                                {videos.map((video, index) => (
                                    <li
                                        key={video._id}
                                        className={`cursor-pointer p-4 border border-gray-300 rounded-lg hover:rounded-lg flex justify-start ${
                                            selected === index ? "bg-green-100" : ""
                                        }`}
                                        onClick={() => handleVideoSelect(video, index)}
                                        style={{ height: '95px' }}
                                    >
                                        <div className="flex gap-x-4 items-center">
                                            <div className='text-xs'>
                                                {index + 1}
                                            </div>
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-28 h-20 rounded-lg shadow-md object-cover"
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
