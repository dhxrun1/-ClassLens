from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models import Student, StudentFaceEmbedding, AttendanceRecord
import ml_service

router = APIRouter(tags=["Attendance"])

class AttendanceConfirmation(BaseModel):
    student_ids: List[str]
    course_name: str

@router.post("/process-class-photo")
async def process_class_photo(
    files: List[UploadFile] = File(...),
    lecture_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    # Fetch enrolled embeddings from DB
    embeddings_records = db.query(StudentFaceEmbedding).all()
    
    import json
    known_embeddings = {}
    for record in embeddings_records:
        if record.student_id not in known_embeddings:
            known_embeddings[record.student_id] = {"name": record.student.name, "embeddings": []}
        known_embeddings[record.student_id]["embeddings"].append(json.loads(record.embedding))
        
    # Read all uploaded files
    image_bytes_list = []
    for file in files:
        content = await file.read()
        image_bytes_list.append(content)
    
    import asyncio
    try:
        if len(image_bytes_list) == 1:
            result = await asyncio.to_thread(ml_service.process_group_photo, image_bytes_list[0], known_embeddings)
            result["total_images"] = 1
            result["total_faces_detected"] = len(result["detected"])
        else:
            result = await asyncio.to_thread(ml_service.process_multiple_photos, image_bytes_list, known_embeddings)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing photo: {str(e)}")
        
    return {"message": "Photo(s) processed successfully", "result": result, "lecture_id": lecture_id}

@router.post("/confirm-attendance")
def confirm_attendance(
    confirmation: AttendanceConfirmation,
    db: Session = Depends(get_db)
):
    import uuid
    from models import Lecture

    # Find or create lecture
    lecture = db.query(Lecture).filter(Lecture.name == confirmation.course_name).first()
    if not lecture:
        lecture = Lecture(id=str(uuid.uuid4()), name=confirmation.course_name)
        db.add(lecture)
        db.commit()
        db.refresh(lecture)

    records_to_add = []
    for student_id in confirmation.student_ids:
        existing = db.query(AttendanceRecord).filter(
            AttendanceRecord.student_id == student_id,
            AttendanceRecord.lecture_id == lecture.id
        ).first()
        if not existing:
            new_record = AttendanceRecord(
                student_id=student_id,
                lecture_id=lecture.id
            )
            db.add(new_record)
            records_to_add.append(new_record)
            
    db.commit()
    return {"message": f"{len(records_to_add)} attendance records confirmed"}
