from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import datetime

from database import get_db
from models import Student, Lecture, AttendanceRecord, StudentFaceEmbedding, Integration, SyncLog
import integration_service

router = APIRouter(tags=["Admin Management"])

# Pydantic Schemas
class StudentOut(BaseModel):
    id: str
    name: str
    level: str
    department: str
    embedding_count: int

    class Config:
        from_attributes = True

class StudentUpdate(BaseModel):
    name: str
    level: str
    department: str

class LectureOut(BaseModel):
    id: str
    name: str
    date: datetime.datetime
    present_count: int
    attendance_rate: float

    class Config:
        from_attributes = True

class AttendanceRecordOut(BaseModel):
    student_id: str
    name: str
    level: str
    department: str
    present: bool
    confidence: Optional[float] = None
    distance: Optional[float] = None
    timestamp: Optional[datetime.datetime] = None

class LectureDetailsOut(BaseModel):
    id: str
    name: str
    date: datetime.datetime
    records: List[AttendanceRecordOut]
    attendance_rate: float
    present_count: int
    absent_count: int

class ManualAttendanceUpdate(BaseModel):
    student_id: str
    present: bool

class IntegrationSchema(BaseModel):
    id: Optional[int] = None
    system_name: str
    endpoint_url: str
    api_key: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True

class SyncLogOut(BaseModel):
    id: int
    lecture_id: str
    lecture_name: str
    system_name: str
    status: str
    response_payload: str
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

# --- Endpoints ---

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """
    Returns real statistics for the admin dashboard.
    """
    total_students = db.query(Student).count()
    total_lectures = db.query(Lecture).count()
    
    # Calculate average attendance rate
    lectures = db.query(Lecture).all()
    avg_attendance_rate = 0.0
    if total_students > 0 and total_lectures > 0:
        rates = []
        for lec in lectures:
            present = db.query(AttendanceRecord).filter(AttendanceRecord.lecture_id == lec.id).count()
            rates.append((present / total_students) * 100)
        avg_attendance_rate = sum(rates) / len(rates)
    
    return {
        "total_students": total_students,
        "total_lectures": total_lectures,
        "average_attendance_rate": round(avg_attendance_rate, 1)
    }

@router.get("/students", response_model=List[StudentOut])
def list_students(db: Session = Depends(get_db)):
    """
    Lists all enrolled students with their embedding counts.
    """
    students = db.query(Student).all()
    out = []
    for s in students:
        emb_count = db.query(StudentFaceEmbedding).filter(StudentFaceEmbedding.student_id == s.id).count()
        out.append(StudentOut(
            id=s.id,
            name=s.name,
            level=s.level,
            department=s.department,
            embedding_count=emb_count
        ))
    return out

@router.put("/students/{student_id}", response_model=StudentOut)
def update_student(student_id: str, payload: StudentUpdate, db: Session = Depends(get_db)):
    """
    Updates an enrolled student's information (name, level, department).
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student.name = payload.name
    student.level = payload.level
    student.department = payload.department
    db.commit()
    db.refresh(student)
    
    emb_count = db.query(StudentFaceEmbedding).filter(StudentFaceEmbedding.student_id == student.id).count()
    return StudentOut(
        id=student.id,
        name=student.name,
        level=student.level,
        department=student.department,
        embedding_count=emb_count
    )

@router.delete("/students/{student_id}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    """
    Deletes an enrolled student, their facial embeddings, and attendance records.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(student)
    db.commit()
    return {"message": f"Student {student_id} and all associated data deleted successfully."}

@router.get("/lectures", response_model=List[LectureOut])
def list_lectures(db: Session = Depends(get_db)):
    """
    Lists all lectures with student presence count and rate.
    """
    lectures = db.query(Lecture).order_by(Lecture.date.desc()).all()
    total_students = db.query(Student).count()
    out = []
    for lec in lectures:
        present_count = db.query(AttendanceRecord).filter(AttendanceRecord.lecture_id == lec.id).count()
        rate = 0.0
        if total_students > 0:
            rate = round((present_count / total_students) * 100, 1)
            
        out.append(LectureOut(
            id=lec.id,
            name=lec.name,
            date=lec.date,
            present_count=present_count,
            attendance_rate=rate
        ))
    return out

@router.get("/lectures/{lecture_id}", response_model=LectureDetailsOut)
def get_lecture_details(lecture_id: str, db: Session = Depends(get_db)):
    """
    Gets detailed attendance record for a specific lecture, including present and absent students.
    """
    lecture = db.query(Lecture).filter(Lecture.id == lecture_id).first()
    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found")
    
    total_students = db.query(Student).all()
    total_student_count = len(total_students)
    
    # Fetch all present records
    present_records = db.query(AttendanceRecord).filter(AttendanceRecord.lecture_id == lecture_id).all()
    present_by_student_id = {r.student_id: r for r in present_records}
    
    records = []
    present_count = 0
    
    for s in total_students:
        is_present = s.id in present_by_student_id
        if is_present:
            present_count += 1
            record = present_by_student_id[s.id]
            records.append(AttendanceRecordOut(
                student_id=s.id,
                name=s.name,
                level=s.level,
                department=s.department,
                present=True,
                confidence=record.confidence,
                distance=record.distance,
                timestamp=record.timestamp
            ))
        else:
            records.append(AttendanceRecordOut(
                student_id=s.id,
                name=s.name,
                level=s.level,
                department=s.department,
                present=False
            ))
            
    # Sort present first, then by name
    records.sort(key=lambda x: (not x.present, x.name))
            
    rate = 0.0
    if total_student_count > 0:
        rate = round((present_count / total_student_count) * 100, 1)
        
    return LectureDetailsOut(
        id=lecture.id,
        name=lecture.name,
        date=lecture.date,
        records=records,
        attendance_rate=rate,
        present_count=present_count,
        absent_count=total_student_count - present_count
    )

@router.delete("/lectures/{lecture_id}")
def delete_lecture(lecture_id: str, db: Session = Depends(get_db)):
    """
    Deletes a lecture and all its attendance records.
    """
    lecture = db.query(Lecture).filter(Lecture.id == lecture_id).first()
    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found")
    
    # Also delete logs associated
    sync_logs = db.query(SyncLog).filter(SyncLog.lecture_id == lecture_id).all()
    for log in sync_logs:
        db.delete(log)
        
    db.delete(lecture)
    db.commit()
    return {"message": "Lecture deleted successfully"}

@router.post("/lectures/{lecture_id}/attendance/manual")
def update_manual_attendance(
    lecture_id: str,
    payload: ManualAttendanceUpdate,
    db: Session = Depends(get_db)
):
    """
    Manually overrides/sets a student's attendance for a lecture.
    """
    lecture = db.query(Lecture).filter(Lecture.id == lecture_id).first()
    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found")
        
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    existing_record = db.query(AttendanceRecord).filter(
        AttendanceRecord.lecture_id == lecture_id,
        AttendanceRecord.student_id == payload.student_id
    ).first()

    if payload.present:
        if not existing_record:
            # Add new record
            new_rec = AttendanceRecord(
                lecture_id=lecture_id,
                student_id=payload.student_id,
                confidence=1.0,
                distance=0.0
            )
            db.add(new_rec)
            db.commit()
            return {"message": f"Successfully marked {student.name} as Present."}
        else:
            return {"message": f"{student.name} is already marked as Present."}
    else:
        if existing_record:
            db.delete(existing_record)
            db.commit()
            return {"message": f"Successfully marked {student.name} as Absent."}
        else:
            return {"message": f"{student.name} is already marked as Absent."}

# --- Integrations & Webhooks ---

@router.get("/integrations", response_model=List[IntegrationSchema])
def list_integrations(db: Session = Depends(get_db)):
    """
    Lists all configured external integrations. Seeds defaults if empty.
    """
    integrations = db.query(Integration).all()
    if not integrations:
        # Seed default mock integrations
        canvas = Integration(
            system_name="Canvas LMS",
            endpoint_url="mock://canvas.instructure.com/api/v1/courses/attendance",
            api_key="canvas_dummy_token_12345",
            is_active=True
        )
        banner = Integration(
            system_name="Ellucian Banner (SIS)",
            endpoint_url="mock://sis.university.edu/api/v1/attendance-sync",
            api_key="banner_secured_secret_9988",
            is_active=False
        )
        webhook = Integration(
            system_name="Registrar Custom Webhook",
            endpoint_url="mock://webhook.university.edu/registrar/sync",
            api_key="",
            is_active=True
        )
        db.add_all([canvas, banner, webhook])
        db.commit()
        integrations = db.query(Integration).all()
        
    return integrations

@router.post("/integrations", response_model=IntegrationSchema)
def save_integration(payload: IntegrationSchema, db: Session = Depends(get_db)):
    """
    Creates or updates an integration configuration.
    """
    existing = db.query(Integration).filter(Integration.system_name == payload.system_name).first()
    if existing:
        existing.endpoint_url = payload.endpoint_url
        existing.api_key = payload.api_key
        existing.is_active = payload.is_active
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_int = Integration(
            system_name=payload.system_name,
            endpoint_url=payload.endpoint_url,
            api_key=payload.api_key,
            is_active=payload.is_active
        )
        db.add(new_int)
        db.commit()
        db.refresh(new_int)
        return new_int

@router.post("/integrations/sync/{lecture_id}")
def trigger_sync(lecture_id: str, payload: dict, db: Session = Depends(get_db)):
    """
    Manually triggers syncing attendance data for a lecture to an integration target.
    """
    integration_id = payload.get("integration_id")
    if not integration_id:
        raise HTTPException(status_code=400, detail="integration_id is required")
        
    res = integration_service.sync_lecture_attendance(db, lecture_id, integration_id)
    if res.get("status") == "FAILED":
        raise HTTPException(status_code=500, detail=res.get("message"))
    return res

@router.get("/integrations/logs", response_model=List[SyncLogOut])
def get_sync_logs(db: Session = Depends(get_db)):
    """
    Lists the history of external system sync logs.
    """
    logs = db.query(SyncLog).order_by(SyncLog.timestamp.desc()).all()
    out = []
    for log in logs:
        out.append(SyncLogOut(
            id=log.id,
            lecture_id=log.lecture_id,
            lecture_name=log.lecture.name if log.lecture else "Deleted Lecture",
            system_name=log.system_name,
            status=log.status,
            response_payload=log.response_payload,
            timestamp=log.timestamp
        ))
    return out
