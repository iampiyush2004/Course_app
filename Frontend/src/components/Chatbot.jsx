import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HiChatBubbleLeftRight, HiXMark, HiPaperAirplane } from 'react-icons/hi2';
import { Link, useLocation } from 'react-router-dom';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! I am the UPSCALE Assistant. How can I help you find the perfect course today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8001/chat', { message: input });
            const botMessage = {
                role: 'bot',
                text: response.data.reply,
                courses: response.data.courses || []
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my brain. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Floating Heading Bubble */}
            {!isOpen && isHomePage && (
                <div className="absolute bottom-full right-0 mb-4 whitespace-nowrap">
                    <div className="bg-white text-green-700 px-4 py-2 rounded-2xl shadow-xl text-sm font-bold border border-green-100 animate-bounce">
                        Need course recommendations?
                        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-green-100 transform rotate-45"></div>
                    </div>
                </div>
            )}

            {/* Chat Bubble Toggle */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
                >
                    <HiChatBubbleLeftRight size={35} className="group-hover:rotate-12 transition-transform" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-[calc(100vw-32px)] sm:w-[380px] h-[70vh] sm:h-[550px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all duration-300 transform scale-100 origin-bottom-right fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
                    {/* Header */}
                    <div className="bg-green-600 p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <HiChatBubbleLeftRight size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">UPSCALE AI Assistant</h3>
                                <p className="text-[10px] text-green-100">Always active</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <HiXMark size={24} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-green-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                    <p>{msg.text}</p>
                                    
                                    {/* Course Recommendations */}
                                    {msg.courses && msg.courses.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.courses.map((course) => (
                                                <Link 
                                                    to={`/courses/${course.id}`} 
                                                    key={course.id}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block bg-gray-50 hover:bg-gray-100 rounded-xl p-2 border border-gray-200 transition-colors group"
                                                >
                                                    <div className="flex gap-3">
                                                        <img src={course.imageLink} alt={course.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-xs text-gray-800 truncate group-hover:text-green-600">{course.title}</h4>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <span className="text-[10px] font-bold text-green-700">₹{course.price}</span>
                                                                <div className="flex items-center gap-0.5">
                                                                    <span className="text-[10px] text-yellow-500">★</span>
                                                                    <span className="text-[10px] text-gray-500 font-medium">{course.rating.toFixed(1)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your interests..."
                            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 transition-all outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-2.5 rounded-xl shadow-md transition-all duration-200"
                        >
                            <HiPaperAirplane size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
