# 📚 UPSKILL - Advanced Course Selling Platform

UPSKILL is a high-performance, full-stack course management and selling application. It enables admins to create premium educational content, students to purchase and track progress, and features an AI-driven ecosystem for intelligent course discovery.

---

## 📝 Latest Features

### 🌟 Review & Rating System
- **Teacher Reviews**: Students can now rate and review their instructors. Teacher profiles display aggregated star ratings and total reviews.
- **Course Reviews**: Individual courses feature a robust feedback system with star ratings and comments.
- **Aggregated Ratings**: Real-time calculation of average ratings for both courses and teachers, displayed across course tiles and info pages.

### 🤖 AI Course Assistant (Chatbot)
- **Natural Language Discovery**: A premium floating chatbot powered by **LangChain** and **Google Gemini**.
- **Vector Search**: Utilizes **MongoDB Atlas Vector Search** for semantic course discovery based on descriptions, bios, and tags.
- **Ranked Results**: Recommendations are intelligently sorted by rating hierarchy to show the best content first.
- **Automated Seeding**: Real-time vector embedding updates. Whenever a course is created or edited in the Java backend, it automatically updates the AI's "knowledge" via a Python microservice hook.

### 🎥 Core Capabilities
- **Advanced Media Player**: Custom video player with playback persistence (resume where you left off) and picture-in-picture support.
- **Secure Payments**: Fully integrated with **Razorpay** for seamless course enrollments.
- **Progress Tracking**: Holistic tracking of course completion and video watching history.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, React Router.
- **Backend (API)**: Java (Spring Boot), MongoDB, Spring Security (JWT), Spring Data MongoDB.
- **AI Microservice**: Python (FastAPI), LangChain, Google Gemini API, MongoDB Atlas Vector Search.
- **Cloud Infrastructure**: Cloudinary (Media Storage), MongoDB Atlas (DB & Search Index).
- **Payments**: Razorpay.

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Java 17+**
- **Node.js 18+**
- **Python 3.10+**
- **MongoDB Atlas Cluster** (with Search Index configured)
- **API Keys**: Google Gemini, Cloudinary, Razorpay.

### ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Course_app
   ```

2. **Configure Environment Variables**:
   - Create `.env` in `Frontend/` for Vite.
   - Configure `application.properties` in `Server/src/main/resources/`.
   - Create `.env` in `Chatbot/` for Gemini and MongoDB URI.

3. **Bootstrap AI Indices**:
   ```powershell
   cd Chatbot
   pip install -r requirements.txt
   python indexer.py
   ```

### ⚡ Startup Commands

Open three terminal windows and run:

**1. AI Chatbot Service**
```powershell
cd Chatbot
python -m uvicorn main:app --port 8001 --reload
```

**2. Spring Boot Server**
```powershell
cd Server
.\mvnw.cmd spring-boot:run
```

**3. Frontend Dev Server**
```powershell
cd Frontend
npm run dev
```

---

## 🏗️ Architecture Design
The application follows a modern microservice-lite pattern:
- **Java Spring Boot** handles core business logic, authentication, and database transactions.
- **Python FastAPI** handles AI processing and vector embeddings asynchronously.
- **React** provides a high-fidelity, responsive user experience.
