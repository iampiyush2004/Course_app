import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../Context/Context';
import { FaRocket, FaUsers, FaBookOpen, FaStar, FaGlobe, FaCertificate, FaQuoteLeft } from 'react-icons/fa';

function Home() {
  const { isLoggedIn } = useContext(Context);

  const stats = [
    { label: 'Active Students', value: '50K+', icon: <FaUsers className="text-blue-500" /> },
    { label: 'Total Courses', value: '1.2K+', icon: <FaBookOpen className="text-green-500" /> },
    { label: 'Expert Mentors', value: '200+', icon: <FaRocket className="text-orange-500" /> },
    { label: 'Success Rate', value: '94%', icon: <FaStar className="text-yellow-500" /> },
  ];

  const features = [
    {
      title: "Self-Paced Learning",
      description: "Learn at your own speed with lifetime access to high-quality course content across all devices.",
      icon: <FaGlobe className="text-3xl text-blue-600" />,
      bg: "bg-blue-50"
    },
    {
      title: "Expert Instruction",
      description: "Our instructors are industry professionals who bring real-world experience to every lesson.",
      icon: <FaRocket className="text-3xl text-orange-600" />,
      bg: "bg-orange-50"
    },
    {
      title: "Verified Certificates",
      description: "Gain recognized certificates upon completion to showcase your skills to potential employers.",
      icon: <FaCertificate className="text-3xl text-green-600" />,
      bg: "bg-green-50"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "UX Designer",
      content: "UpScale transformed my career. The project-based learning approach helped me build a portfolio that landed me my dream job.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content: "The quality of instructors on this platform is unmatched. I've taken several courses and each one has been exceptional.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-left">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl lg:text-7xl leading-tight">
                {isLoggedIn ? "Share Your Expertise with" : "Discover and Learn with"}
                <div className="relative inline-flex ml-2">
                  <span className="absolute inset-x-0 bottom-1 h-3 sm:h-6 bg-green-400 opacity-60"></span>
                  <span className="relative">UpScale</span>
                </div>
              </h1>

              <p className="mt-8 text-lg text-gray-600 sm:text-xl leading-relaxed">
                {isLoggedIn 
                  ? "Unlock the power of your knowledge! Create, sell, and teach courses to a global audience. Empower learners while earning by sharing your expertise." 
                  : "Unlock your potential by exploring a variety of courses tailored to your needs. Learn from industry experts and elevate your skills at your own pace."}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link 
                  to={isLoggedIn ? "/adminName/AddCourse" : "/courses"} 
                  className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-300 bg-orange-500 rounded-xl hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1 active:translate-y-0"
                >
                  {isLoggedIn ? "Sell Your Courses" : "Explore Courses"}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30"></div>
              <img 
                className="relative w-full drop-shadow-2xl animate-float" 
                src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/hero-img.png" 
                alt="Learning Illustration" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/80 backdrop-blur-md border-y border-green-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4 text-3xl">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Why UpScale?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Better way to learn and grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className={`${feature.bg} p-10 rounded-[2.5rem] transition-all duration-300 hover:scale-105 border border-transparent hover:border-white/50 shadow-sm`}>
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-900 text-white rounded-[4rem] mx-4 sm:mx-8 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">How it works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Three simple steps to start your learning journey with UpScale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { step: "01", title: "Explore Courses", desc: "Browse our extensive catalog of courses across various domains." },
              { step: "02", title: "Enroll & Learn", desc: "Join your favorite courses and start learning from experts." },
              { step: "03", title: "Master Skills", desc: "Complete projects and quizzes to master new skills and get certified." }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl font-black text-white/10 mb-6 group-hover:text-green-500/30 transition-colors duration-500">{item.step}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 pb-32 bg-white rounded-b-[4rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-gray-900">Loved by Students & Teachers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl relative">
                <FaQuoteLeft className="text-4xl text-green-100 absolute top-8 left-8" />
                <div className="relative z-10">
                  <p className="text-gray-600 text-lg italic mb-8 pt-4">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full bg-gray-100" />
                    <div>
                      <h4 className="font-bold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="my-24 px-4">
        <div className="max-w-5xl mx-auto bg-green-500 rounded-[3rem] p-12 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-green-200">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-bold mb-8 italic text-white/90">Ready to upskill your career?</h2>
            <p className="text-xl mb-12 text-green-50/80 max-w-2xl mx-auto">
              Join thousands of learners who are already advancing their careers with UpScale.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to={isLoggedIn ? "/adminName/courses" : "/courses"} 
                className="inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-green-600 transition-all duration-300 bg-white rounded-2xl hover:bg-green-50 hover:scale-105 active:scale-95"
              >
                Get Started Now
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-24 bg-white rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">Connect With Our Community</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: 'Twitter', icon: <FaRocket />, color: 'text-blue-400', bg: 'bg-blue-50' },
              { name: 'Instagram', icon: <FaGlobe />, color: 'text-pink-500', bg: 'bg-pink-50' },
              { name: 'LinkedIn', icon: <FaUsers />, color: 'text-blue-700', bg: 'bg-blue-50' }
            ].map((social, i) => (
              <a 
                key={i} 
                href="#" 
                className={`flex items-center gap-3 px-8 py-4 ${social.bg} rounded-2xl hover:scale-105 transition-all duration-300 border border-gray-100 shadow-sm`}
              >
                <span className={`${social.color} text-xl`}>{social.icon}</span>
                <span className="font-bold text-gray-700">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Style for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-left {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
}

export default Home;
