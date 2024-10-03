from typing import Union
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from database import *
from routes.users import router
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession


app = FastAPI()

# Allow CORS for the frontend application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include user-related routes
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()

# Updated Pydantic model for creating a new student without studentID
class StudentCreate(BaseModel):
    name: str
    attendanceCount: int = 0
    absentCount: int = 0

# Endpoint to get a student by ID
@app.get("/api/students/{studentID}")
async def get_student(studentID: int):
    student = await get_student_by_id(studentID)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"student": student}


# Updated endpoint to create a new student without requiring studentID
@app.post("/api/students")
async def add_student(student: StudentCreate):
    # Ensure we are not including `studentID` in the creation
    new_student = await create_student(
        name=student.name,
        attendanceCount=student.attendanceCount,
        absentCount=student.absentCount
    )
    if not new_student:
        raise HTTPException(status_code=400, detail="Failed to create student")
    return {"message": "Student created successfully", "student": new_student}



# Updated Pydantic model for creating a new attendance entry
class AttendanceCreate(BaseModel):
    Date: date  # Use `date` type instead of `str` for proper validation




# Endpoint to delete a student by ID
@app.delete("/api/students/{studentID}")
async def delete_student(studentID: int):
    # Call the database function to delete the student
    deleted_student = await delete_student_by_id(studentID)
    if not deleted_student:
        raise HTTPException(status_code=404, detail=f"Student with ID {studentID} not found")
    return {"message": f"Student ID {studentID} deleted successfully", "student": deleted_student}


# Updated /api/students endpoint in app.py

# Endpoint to get all students
@app.get("/api/students")
async def get_all_students():
    students = await get_all_students()
    if not students:
        raise HTTPException(status_code=404, detail="No students found")
    return students

# Endpoint to get attendance by ID
@app.get("/api/attendance/{attendanceID}")
async def get_attendance(attendanceID: int):
    attendance = await get_attendance_by_id(attendanceID)
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance not found")
    return {"attendance": attendance}


# Endpoint to create a new attendance entry
@app.post("/api/attendance")
async def add_attendance(attendance: AttendanceCreate):
    new_attendance = await create_attendance(Date=attendance.Date)
    if not new_attendance:
        raise HTTPException(status_code=400, detail="Failed to create attendance")
    return {"message": "Attendance created successfully", "attendance": new_attendance}
