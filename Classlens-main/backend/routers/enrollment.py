from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Student, StudentFaceEmbedding
import ml_service

router = APIRouter(tags=["Enrollment"])

@router.post("/enroll-student")
async def enroll_student(
    student_id: str = Form(...),
    name: str = Form(...),
    level: str = Form(...),
    department: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    # Check if student already exists
    existing_student = db.query(Student).filter(Student.id == student_id).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Student already exists")

    # Read image bytes
    images = []
    for file in files:
        content = await file.read()
        images.append(content)
        
    import asyncio
    try:
        embeddings = await asyncio.to_thread(ml_service.extract_embeddings, images)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting embeddings: {str(e)}")
        
    if not embeddings:
        raise HTTPException(status_code=400, detail="Could not extract face embeddings from the provided images")

    # Save to DB
    new_student = Student(id=student_id, name=name, level=level, department=department)
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    for emb in embeddings:
        import json
        new_embedding = StudentFaceEmbedding(student_id=new_student.id, embedding=json.dumps(emb))
        db.add(new_embedding)
        
    db.commit()
    
    return {"message": "Student enrolled successfully", "db_id": new_student.id, "student_id": student_id}
