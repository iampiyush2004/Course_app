import React from 'react';
import { FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">About Us</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Empowering the Next Generation of Learners
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            UpScale is a premium learning platform designed to bridge the gap between industry experts and ambitious students.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-2">
            <div className="bg-green-50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                At UpScale, we believe that education should be accessible, engaging, and directly applicable to professional growth. Our mission is to provide a seamless marketplace where creators can monetize their expertise and students can find world-class mentorship.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether it's mastering a new programming language or learning business strategy, UpScale provides the tools and the community to help you reach your goals.
              </p>
            </div>

            <div className="bg-orange-50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-orange-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose UpScale?</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 text-green-500 font-bold">✓</span>
                  <span className="ml-3 font-medium text-gray-700">Expert-Led Curriculum</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 text-green-500 font-bold">✓</span>
                  <span className="ml-3 font-medium text-gray-700">Lifetime Access to Content</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 text-green-500 font-bold">✓</span>
                  <span className="ml-3 font-medium text-gray-700">Interactive Video Learning</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 text-green-500 font-bold">✓</span>
                  <span className="ml-3 font-medium text-gray-700">Community Support & Reviews</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-900 rounded-[3rem] p-10 sm:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-6">Join Our Growing Community</h3>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
              We started as a small team dedicated to improving online education, and today we're proud to support thousands of students and hundreds of teachers worldwide. Our platform is built on trust, quality, and the passion for lifelong learning.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full sm:w-48 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <FaTwitter className="text-[#1DA1F2] text-xl" />
                  <span className="font-semibold text-white">Twitter</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-400 group-hover:animate-pulse"></div>
              </a>

              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full sm:w-48 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <FaInstagram className="text-[#E4405F] text-xl" />
                  <span className="font-semibold text-white">Instagram</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-orange-400 group-hover:animate-pulse"></div>
              </a>

              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full sm:w-48 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <FaLinkedinIn className="text-[#0A66C2] text-xl" />
                  <span className="font-semibold text-white">LinkedIn</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-blue-400 group-hover:animate-pulse"></div>
              </a>
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
