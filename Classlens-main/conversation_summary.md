# Face Detection Student Attendance System - Project Log

## Architecture Built
1. **Frontend**: Next.js App Router, Tailwind CSS 4, dark mode glassmorphism UI.
   - `src/app/page.tsx`: Landing dashboard.
   - `src/app/enroll/page.tsx`: Enrollment form (Student ID, Name, Photo).
   - `src/app/attendance/page.tsx`: Class photo upload and facial detection preview.
2. **Backend**: FastAPI, SQLite (SQLAlchemy), `deepface` (mocked temporarily due to macOS ARM64 TensorFlow limitations).
   - `ml_service.py`: Encapsulates AI/ML logic for extracting and comparing ArcFace embeddings.
   - `database.py` & `models.py`: Schema for Students, Embeddings, Lectures, and Attendance Records.
   - `routers/enrollment.py` & `routers/attendance.py`: REST APIs.

## Key Troubleshooting Steps Resolved
1. **Python Dependency Issue**: `deepface` & `tensorflow` failed to install natively on the local macOS arm64 environment with Python 3.14. 
   *Resolution*: Created a mocked version of `ml_service.py` to allow the API and frontend to be developed and tested locally without ML blockers.
2. **Database Schema Bug**: Fixed an `AttributeError` where the codebase referenced `student_id` instead of `id` on the `Student` SQLAlchemy model.
3. **CORS Policy**: Configured `CORSMiddleware` on the FastAPI server to allow the Next.js frontend to send requests successfully.
4. **Data Serialization**: Ensured mock face embeddings (lists of floats) were properly JSON-serialized before being saved to the SQLite database.
5. **Frontend API Parsing**: Fixed a `TypeError: Cannot read properties of undefined (reading 'map')` by correctly mapping `data.result.detected` from the FastAPI payload.

## Current Status
- Both frontend (`http://localhost:3000`) and backend (`http://localhost:8000`) servers are running successfully.
- Enrollment and Attendance flows work end-to-end (using the mock ML service).
- **Next Steps**: To deploy this to production, the application needs to be run in a Python 3.10/3.11 environment (e.g., using Docker or a Linux VPS) to successfully install the real `deepface` AI models.
