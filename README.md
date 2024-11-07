### Welcome to Course App
📚 Course App
A full-featured course management application where admins can create and manage courses, students can explore and purchase courses, and video lectures can be streamed with video progress saved. This app is built on the MERN stack and integrates with various third-party services for media storage, payments, and AI-driven recommendations.

📝 Features
Core Features
Course Management: Admins can create, update, and delete courses with detailed information, including title, description, price, tags, and media resources (videos, PDFs).
User Authentication: JWT-based authentication for both admins and students, with different levels of access.
Course Purchase: Integration with Razorpay payment gateway to handle secure transactions.
Media Streaming: Courses contain video lectures hosted on Cloudinary, playable within a custom media player that saves playback position.
Course Recommendations: A ChatGPT-powered recommendation system suggests relevant courses to users based on their interests.
Progress Tracking: Users can resume video lectures from where they left off within each course.
Additional Functionalities
User Roles: Separate schemas for Admin and Student with distinct capabilities.
Tags and Categories: Tag-based filtering of courses to help users find relevant content more easily.
Interactive Video Player: Picture-in-picture video player with draggable interface, providing a YouTube-style viewing experience with a scrollable list of course videos.
File Uploads: Using Multer middleware to upload and manage files, with Cloudinary as the storage solution.
Responsive Design: Frontend styled with Tailwind CSS, optimized for various screen sizes.
🛠️ Tech Stack
Frontend: React, Tailwind CSS
Backend: Node.js, Express, Mongoose
Database: MongoDB
Media Storage: Cloudinary (video storage and streaming)
Payments: Razorpay
AI Integration: OpenAI API (for course recommendations)
🚀 Getting Started
Prerequisites
Node.js (v14 or higher)
MongoDB
Razorpay account
Cloudinary account
OpenAI API key
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/course-app.git
cd course-app
Install dependencies:

bash
Copy code
npm install
Setup environment variables:
Create a .env file in the root of your project with the following variables:

env
Copy code
PORT=3000
MONGO_URI=your_mongo_db_connection_string
CLOUDINARY_URL=your_cloudinary_url
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
Run the application:

bash
Copy code
npm start
📖 API Endpoints
Authentication
POST /api/auth/signup: Register a new user or admin.
POST /api/auth/signin: Login and receive a JWT.
Course Management
POST /api/courses: Create a new course (Admin only).
PUT /api/courses/:id: Update an existing course (Admin only).
DELETE /api/courses/:id: Delete a course (Admin only).
GET /api/courses: Retrieve a list of all courses.
Course Content
POST /api/courses/:id/tags: Update tags for a course.
GET /api/courses/:id/videos: Retrieve videos for a specific course.
POST /api/upload: Upload course resources (Admin only).
User-Specific
POST /api/recommend-courses: Get AI-based course recommendations.
GET /api/user/progress: Fetch and save playback progress for each user.
POST /api/purchase: Initiate purchase for a course.
🧑‍💻 Frontend Development
The frontend is built with React and Tailwind CSS.

Run Frontend Development Server:
bash
Copy code
cd client
npm install
npm start
Key Components
CoursePage: Displays course details, video player, and playlist.
VideoPlayer: Custom video player with saved playback position and draggable interface.
RecommendationsWidget: Popup with AI-driven recommendations, draggable for a picture-in-picture experience.
🛡️ Security
Authentication: JWT-based authentication, stored in cookies.
Authorization: Middleware checks to restrict actions to admins or authorized users.
Password Management: Ensure passwords are securely hashed before production deployment.
📈 Future Enhancements
Real-time Chat Support: Provide in-course chat for students to ask questions.
Enhanced Analytics: Track user progress across different courses.
In-App Notifications: Notify users about new courses and discounts.
💬 Support
For any issues or feature requests, please open an issue in the GitHub repository.

📜 License
This project is licensed under the MIT License. See the LICENSE file for details.