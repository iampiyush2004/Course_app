import React from 'react';

const SignUp = ({
  name,
  setName,
  dob,
  setDob,
  experience,
  setExperience,
  gender,
  setGender,
  company,
  setCompany,
  username,
  setUsername,
  password,
  setPassword,
  email,
  setEmail,
  handleSubmit,
  isLoading,
  setAvatar,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Username */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
            Full Name
          </label>
          <input
            type="text"
            className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-gray-50/50"
            id="name"
            placeholder="Dr. John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
            Username
          </label>
          <input
            type="text"
            className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-gray-50/50"
            id="username"
            placeholder="@prof_john"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="^[^0-9].*"
            title="Username should not start with a number"
            required
          />
        </div>
      </div>

      {/* DOB and Gender */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label htmlFor="dob" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
            Date of Birth
          </label>
          <input
            type="date"
            className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-gray-50/50"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="gender" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
            Gender
          </label>
          <select
            id="gender"
            className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-gray-50/50 appearance-none cursor-pointer"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Company and Email */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label htmlFor="company" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
            Organization / Company
          </label>
          <input
            type="text"
            className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-gray-50/50"
            id="company"
            placeholder="e.g. Google, MIT"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
            Email Address
          </label>
          <input
            type="email"
            className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-gray-50/50"
            id="email"
            placeholder="john@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Avatar Selection Section */}
      <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100/50">
        <label className="block text-sm font-bold text-gray-700 mb-4 ml-1">
          Select Your Teacher Avatar
        </label>
        <div className="flex justify-center gap-10">
          {[
            'https://p7.hiclipart.com/preview/426/761/266/teacher-computer-icons-student-education-school-teacher.jpg',
            'https://img.favpng.com/0/25/10/computer-icons-teacher-png-favpng-sJASskmgxhuZQK1YaXjUMPjZG.jpg'
          ].map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch(url);
                  const blob = await response.blob();
                  const file = new File([blob], `teacher-avatar-${idx}.${blob.type.split('/')[1]}`, { type: blob.type });
                  setAvatar(file);
                } catch (e) {
                  console.error("Failed to set avatar", e);
                }
              }}
              className="relative group w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-xl border-4 border-transparent hover:border-orange-500 hover:scale-110 transition-all active:scale-95 overflow-hidden"
            >
              <img src={url} alt={`Teacher Avatar ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 text-orange-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Select</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Experience and Avatar Upload */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label htmlFor="experience" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
            Years of Experience
          </label>
          <input
            type="number"
            className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-gray-50/50"
            id="experience"
            placeholder="e.g. 5"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="avatar" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
            Or Upload Picture
          </label>
          <input
            type="file"
             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all cursor-pointer"
            id="avatar"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1 ml-1">
          Set Password
        </label>
        <input
          type="password"
          className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-gray-50/50"
          id="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="8"
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-4 px-4 rounded-xl text-white font-black text-lg bg-orange-600 hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Creating your portal...' : 'Join as Teacher'}
      </button>
    </form>
  );
};

export default SignUp;
