import urllib.request
import urllib.error
import json
import datetime
from sqlalchemy.orm import Session
from models import Lecture, AttendanceRecord, Student, Integration, SyncLog

def sync_lecture_attendance(db: Session, lecture_id: str, integration_id: int) -> dict:
    """
    Syncs attendance of a specific lecture to an external system.
    Returns a dictionary with status details.
    """
    # 1. Fetch integration settings
    integration = db.query(Integration).filter(Integration.id == integration_id).first()
    if not integration or not integration.is_active:
        return {"status": "FAILED", "message": "Integration not found or inactive"}

    # 2. Fetch lecture details
    lecture = db.query(Lecture).filter(Lecture.id == lecture_id).first()
    if not lecture:
        return {"status": "FAILED", "message": "Lecture not found"}

    # 3. Compile present and absent students
    present_records = db.query(AttendanceRecord).filter(AttendanceRecord.lecture_id == lecture_id).all()
    present_student_ids = {r.student_id for r in present_records}
    
    all_students = db.query(Student).all()
    
    attendance_data = []
    for s in all_students:
        status = "PRESENT" if s.id in present_student_ids else "ABSENT"
        attendance_data.append({
            "student_id": s.id,
            "name": s.name,
            "level": s.level,
            "department": s.department,
            "status": status
        })

    payload = {
        "event": "attendance_sync",
        "system": integration.system_name,
        "lecture": {
            "id": lecture.id,
            "name": lecture.name,
            "date": lecture.date.isoformat()
        },
        "attendance_count": len(present_student_ids),
        "total_students": len(all_students),
        "records": attendance_data,
        "synced_at": datetime.datetime.utcnow().isoformat()
    }

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Lens-Attendance-System/1.0"
    }
    if integration.api_key:
        headers["Authorization"] = f"Bearer {integration.api_key}"

    # 4. Make HTTP Post request
    status = "SUCCESS"
    response_payload = ""
    
    # If the URL is empty or matches a placeholder, we do a premium mock sync
    if not integration.endpoint_url or integration.endpoint_url.startswith("mock://") or "example.com" in integration.endpoint_url:
        response_payload = json.dumps({
            "status": "success",
            "message": f"Successfully simulated sync with {integration.system_name} SIS Gateway",
            "transaction_id": f"tx_{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        })
    else:
        try:
            req = urllib.request.Request(
                integration.endpoint_url,
                data=json.dumps(payload).encode('utf-8'),
                headers=headers,
                method='POST'
            )
            # Timeout of 5 seconds
            with urllib.request.urlopen(req, timeout=5) as response:
                response_payload = response.read().decode('utf-8')
        except urllib.error.HTTPError as e:
            status = "FAILED"
            response_payload = f"HTTP Error {e.code}: {e.read().decode('utf-8', errors='ignore')}"
        except urllib.error.URLError as e:
            status = "FAILED"
            response_payload = f"Connection error: {str(e.reason)}"
        except Exception as e:
            status = "FAILED"
            response_payload = f"Unexpected error: {str(e)}"

    # 5. Log the sync attempt in DB
    sync_log = SyncLog(
        lecture_id=lecture.id,
        system_name=integration.system_name,
        status=status,
        response_payload=response_payload
    )
    db.add(sync_log)
    db.commit()

    return {
        "status": status,
        "message": f"Sync process executed to {integration.system_name}",
        "response": response_payload
    }
