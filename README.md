# -ClassLens
API-first facial recognition attendance system built with FastAPI, Next.js, InsightFace, and SQLite for seamless student enrollment, face verification, and automated attendance tracking.

🚀 Quick Start

Prerequisites

Python 3.10 or higher
(Optional) TensorFlow GPU dependencies for accelerated ML performance
Installation & Setup

Clone the repository

git clone https://github.com/yourusername/lens-attendance.git
cd lens-attendance
Create a Python virtual environment

python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
Install dependencies

pip install -r backend/requirements.txt
Run the Backend Server

python -m backend.main
The API will be available at http://localhost:8000

Run the Frontend Open a new terminal, activate the virtual environment, and run:

cd frontend
npm install
npm run dev
The dashboard will be available at http://localhost:3000

🏗️ Architecture

The system follows a standard Client-Server architecture with a clear separation of concerns.

Frontend (Next.js)

UI/UX: Dark mode, glassmorphism design language.
Pages:
Dashboard (/): Overview of operations.
Enrollment (/enroll): Form to register new students with their photos.
Attendance (/attendance): Upload class photos to detect and verify students.
Backend (FastAPI)

Database: SQLite (in-memory or file-based) for persistence.
ML Integration: Uses the deepface library for high-accuracy facial recognition (ArcFace algorithm).
📂 Project Structure

lens-attendance/
├── backend/                   # FastAPI Application
│   ├── main.py                # Application entry point & configuration
│   ├── database.py            # Database connection & session management
│   ├── models.py              # SQLAlchemy ORM models (Student, Attendance, etc.)
│   ├── ml_service.py          # Core ML logic: Face detection & verification
│   └── routers/               # API endpoint handlers
│       ├── enrollment.py      # Student registration endpoints
│       └── attendance.py      # Attendance tracking endpoints
├── frontend/                  # Next.js Application
│   ├── app/                   # Page routes
│   ├── components/            # UI components
│   └── styles/                # Tailwind CSS & global styles
├── LICENSE                    # MIT License
└── README.md                  # This file
📋 API Reference

Enrollment Endpoints

POST /enroll-student Registers a new student.

Request: multipart/form-data
Fields:
student_id (str): Unique identifier for the student.
name (str): Full name of the student.
level (str): Academic level (e.g., "100L").
department (str): Department/Faculty (e.g., "Computer Science").
files (list[File]): One or more images of the student's face.
Response: 200 OK with success message and database ID.
Attendance Endpoints

POST /detect-faces Detects faces in an uploaded image.

Request: multipart/form-data
Fields:
file (File): Image to analyze.
threshold (float, optional): Confidence threshold for matching (default: 0.75).
Response: 200 OK with detected faces and analysis results.
POST /process-attendance Processes a class photo, identifies students, and records attendance.

Request: multipart/form-data
Fields:
lecture_id (str): Identifier for the lecture/class.
image_file (File): Class photo.
threshold (float, optional): Matching threshold.
Response: 200 OK with detailed attendance report including matches and unidentified faces.
🛠️ Tech Stack

Backend: Python 3.14, FastAPI, SQLAlchemy
Machine Learning: DeepFace (ArcFace algorithm)
Frontend: Next.js 14 (App Router), Tailwind CSS 4
Database: SQLite
🤝 Contributing

Contributions are welcome! Please follow the standard Fork -> Branch -> PR workflow.

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
