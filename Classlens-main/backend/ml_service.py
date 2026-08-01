import json
import io

try:
    import numpy as np
    import face_recognition
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False

def extract_embeddings(images):
    """
    Extracts facial embeddings from a list of image bytes using face_recognition.
    Returns a list of 128-dimensional embeddings (as lists of floats).
    """
    if not ML_AVAILABLE:
        raise RuntimeError("face_recognition module is not installed or failed to load.")

    embeddings = []
    for image_bytes in images:
        try:
            image = face_recognition.load_image_file(io.BytesIO(image_bytes))
            # Find faces in the image
            face_encodings = face_recognition.face_encodings(image)
            if face_encodings:
                # We take the first face found in each enrollment image
                embeddings.append(face_encodings[0].tolist())
        except Exception as e:
            print(f"Error processing enrollment image: {e}")
            continue
            
    return embeddings

def process_group_photo(image_bytes, enrolled_embeddings, threshold=0.50):
    """
    Processes a single group photo, detects faces, and matches them against enrolled embeddings.
    enrolled_embeddings format:
    {
      "student_id": {
          "name": "Student Name",
          "embeddings": [ [128 floats], ... ]
      }
    }
    """
    if not ML_AVAILABLE:
        raise RuntimeError("face_recognition module is not installed or failed to load.")

    try:
        image = face_recognition.load_image_file(io.BytesIO(image_bytes))
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)
        
        detected = []
        unknown_count = 0
        
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            best_match_id = None
            best_distance = float('inf')
            best_name = "Unknown"
            
            for student_id, data in enrolled_embeddings.items():
                name = data.get("name", "Unknown")
                student_encs = data.get("embeddings", [])
                
                if not student_encs:
                    continue
                    
                distances = face_recognition.face_distance(student_encs, face_encoding)
                min_dist = min(distances)
                
                if min_dist < best_distance and min_dist <= threshold:
                    best_distance = min_dist
                    best_match_id = student_id
                    best_name = name
                    
            if best_match_id:
                confidence = max(0, 1.0 - best_distance)
                detected.append({
                    "bbox": [left, top, right - left, bottom - top],
                    "student_id": best_match_id,
                    "name": best_name,
                    "confidence": float(confidence),
                    "distance": float(best_distance)
                })
            else:
                unknown_count += 1
                
        return {
            "detected": detected,
            "unknown_count": unknown_count
        }
    except Exception as e:
        print(f"Error processing group photo: {e}")
        return {
            "detected": [],
            "unknown_count": 0
        }


def process_multiple_photos(image_bytes_list, enrolled_embeddings, threshold=0.50):
    """
    Processes multiple group photos, detects faces across all images,
    and returns deduplicated results (best match per student).

    Each image result is processed independently, then merged:
    - Same student appearing in multiple photos is kept once with best confidence.
    - Bounding boxes are tagged with the source image index.
    - Unknown counts are summed across all images.
    """
    if not ML_AVAILABLE:
        raise RuntimeError("face_recognition module is not installed or failed to load.")

    all_detected = []
    total_unknown = 0

    for idx, image_bytes in enumerate(image_bytes_list):
        try:
            result = process_group_photo(image_bytes, enrolled_embeddings, threshold)
            for face in result["detected"]:
                face["image_index"] = idx
            all_detected.extend(result["detected"])
            total_unknown += result["unknown_count"]
        except Exception as e:
            print(f"Error processing image {idx}: {e}")
            continue

    # Deduplicate: keep best confidence per student_id
    best_by_student = {}
    for face in all_detected:
        sid = face["student_id"]
        if sid not in best_by_student or face["confidence"] > best_by_student[sid]["confidence"]:
            best_by_student[sid] = face

    deduplicated = list(best_by_student.values())

    return {
        "detected": deduplicated,
        "unknown_count": total_unknown,
        "total_images": len(image_bytes_list),
        "total_faces_detected": len(all_detected)
    }
