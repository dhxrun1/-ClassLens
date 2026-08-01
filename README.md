# 🎓 ClassLens

**API-first facial recognition attendance system** built with **FastAPI, Next.js, InsightFace, and SQLite** for seamless student enrollment, face verification, and automated attendance tracking.

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- (Optional) TensorFlow GPU dependencies for faster ML performance

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ClassLens.git
cd ClassLens
```

### 2. Create a Virtual Environment

```bash
python3 -m venv venv
```

Activate it:

**macOS/Linux**

```bash
source venv/bin/activate
```

**Windows**

```bash
venv\Scripts\activate
```

### 3. Install Backend Dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Run the Backend

```bash
python -m backend.main
```

Backend API:

```
http://localhost:8000
```

---

### 5. Run the Frontend

Open a new terminal.

```bash
cd frontend
npm install
npm run dev
```

Frontend Dashboard:

```
http://localhost:3000
```

---

# 🏗️ Architecture

The project follows a **Client-Server Architecture**.

## Frontend (Next.js)

- Dashboard
- Student Enrollment
- Attendance
- Modern Dark UI
- Glassmorphism Design

## Backend (FastAPI)

- REST API
- Student Management
- Attendance Processing
- Face Recognition
- SQLite Database

---

# 📂 Project Structure

```text
ClassLens/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── ml_service.py
│   └── routers/
│       ├── enrollment.py
│       └── attendance.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── styles/
│
├── LICENSE
└── README.md
```

---

# 📋 API Endpoints

## Student Enrollment

**POST** `/enroll-student`

Registers a new student.

### Form Data

- student_id
- name
- level
- department
- files (Face Images)

---

## Face Detection

**POST** `/detect-faces`

Detects faces from an uploaded image.

### Form Data

- file
- threshold (optional)

---

## Attendance Processing

**POST** `/process-attendance`

Processes a classroom image, identifies students, and records attendance.

### Form Data

- lecture_id
- image_file
- threshold (optional)

---

# 🛠️ Tech Stack

### Backend

- FastAPI
- Python
- SQLAlchemy

### Frontend

- Next.js 14
- Tailwind CSS

### Machine Learning

- InsightFace
- ArcFace
- DeepFace

### Database

- SQLite

---

# ✨ Features

- Facial Recognition Attendance
- Student Enrollment
- Face Verification
- Attendance Reports
- REST API
- Responsive Dashboard
- FastAPI Backend
- Next.js Frontend

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.
