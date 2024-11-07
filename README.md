# 📚 Course App

A full-featured course management application where admins can create and manage courses, students can explore and purchase courses, and video lectures can be streamed with playback progress tracking. Built on the MERN stack, this app integrates various third-party services for media storage, payments, and AI-driven recommendations.

---

## 📝 Features

### Core Features
- **Course Management**: Admins can create, update, and delete courses, including details like title, description, price, tags, and media resources.
- **User Authentication**: JWT-based authentication for both admins and students, with separate levels of access.
- **Course Purchase**: Integration with Razorpay payment gateway to handle secure transactions.
- **Media Streaming**: Courses contain video lectures hosted on Cloudinary, playable within a custom media player that saves playback position.
- **Course Recommendations**: ChatGPT-powered recommendations help users discover relevant courses.
- **Progress Tracking**: Users can resume video lectures from where they left off.

### Additional Functionalities
- **User Roles**: Separate schemas for Admin and Student with distinct capabilities.
- **Tags and Categories**: Tag-based filtering of courses.
- **Interactive Video Player**: Draggable picture-in-picture player, providing a YouTube-style experience.
- **File Uploads**: Uses Multer middleware to upload and manage files with Cloudinary.
- **Responsive Design**: Frontend styled with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **Media Storage**: Cloudinary
- **Payments**: Razorpay
- **AI Integration**: OpenAI API

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB**
- **Razorpay account**
- **Cloudinary account**
- **OpenAI API key**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/course-app.git
   cd course-app
