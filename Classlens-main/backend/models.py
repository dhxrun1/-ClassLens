from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
import datetime
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    level = Column(String, index=True)
    department = Column(String, index=True)

    embeddings = relationship("StudentFaceEmbedding", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("AttendanceRecord", back_populates="student", cascade="all, delete-orphan")

class StudentFaceEmbedding(Base):
    __tablename__ = "student_face_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"))
    embedding = Column(String)  # JSON string of list of floats

    student = relationship("Student", back_populates="embeddings")

class Lecture(Base):
    __tablename__ = "lectures"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)

    attendance_records = relationship("AttendanceRecord", back_populates="lecture", cascade="all, delete-orphan")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    lecture_id = Column(String, ForeignKey("lectures.id"))
    student_id = Column(String, ForeignKey("students.id"))
    confidence = Column(Float, nullable=True)
    distance = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    lecture = relationship("Lecture", back_populates="attendance_records")
    student = relationship("Student", back_populates="attendance_records")

class Integration(Base):
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    system_name = Column(String, unique=True, index=True)
    endpoint_url = Column(String)
    api_key = Column(String)
    is_active = Column(Boolean, default=True)

class SyncLog(Base):
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, index=True)
    lecture_id = Column(String, ForeignKey("lectures.id"))
    system_name = Column(String)
    status = Column(String)
    response_payload = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    lecture = relationship("Lecture")

