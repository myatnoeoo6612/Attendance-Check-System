from typing import Union
from fastapi import FastAPI, HTTPException, Depends, Query, logger, Path ,HTTPException
from pydantic import BaseModel,conint
from database import *
from routes.users import router
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession
import logging

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

#Base model
class StudentCreate(BaseModel):
    name: str
    attendanceCount: int = 0
    absentCount: int = 0

class AttendanceLinkCreate(BaseModel):
    studentid: int  # Ensure this field is 'studentid' in the request payload
    attendanceid: int  # Ensure this field is 'attendanceid' in the request payload
    attendancecheck: bool  # Ensure this field is 'attendancecheck' in the request payload
    
class AttendanceCreate(BaseModel):
    Date: date

class AttendanceLinkQuery(BaseModel):
    attendanceid: conint(gt=0) # type: ignore # Ensure that attendanceid is a positive integer

class AttendanceLinkUpdate(BaseModel):
    studentid: conint(gt=0) # type: ignore
    attendanceid: conint(gt=0) # type: ignore
    attendancecheck: bool


# Student-related endpoints
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

# Endpoint to delete a student by ID
@app.delete("/api/students/{studentID}")
async def delete_student(studentID: int):
    # Call the database function to delete the student
    deleted_student = await delete_student_by_id(studentID)
    if not deleted_student:
        raise HTTPException(status_code=404, detail=f"Student with ID {studentID} not found")
    return {"message": f"Student ID {studentID} deleted successfully", "student": deleted_student}

@app.get("/api/sstudents")
async def read_all_students():
    return await get_all_students()

# @app.post("/api/attendance/link/{attendanceid}")
# async def create_student_links_for_attendance(attendanceid: int = Path(..., description="The ID of the attendance record to link students to")):
#     """
#     Create student attendance links for a given attendance ID and mark all students as absent by default.

#     Args:
#         attendanceid (int): The ID of the attendance record to link students to.

#     Returns:
#         dict: A success message if links are created, or raises an HTTPException.
#     """
#     # Custom validation to ensure `attendanceid` is a positive integer
#     if attendanceid <= 0:
#         raise HTTPException(status_code=422, detail="attendanceid must be a positive integer.")

#     try:
#         # Check if the attendance record exists
#         attendance = await get_attendance_by_id(attendanceid)
#         if not attendance:
#             raise HTTPException(status_code=404, detail=f"Attendance with ID {attendanceid} not found")

#         # Fetch all students and create links for the given attendance ID, with `attendancecheck=False` by default
#         students = await get_all_students()
#         for student in students:
#             # Create a new attendance link and mark as absent (attendancecheck=False)
#             await create_student_attendance_link(
#                 studentid=student['studentid'],
#                 attendanceid=attendanceid,
#                 attendancecheck=False  # Set the default check to False (absent)
#             )
            
#             # Increment the absent count for each student since they are marked as absent by default
#             await increment_absent_count(student['studentid'])

#         return {"message": "Student attendance links created successfully, and absent counts incremented."}
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         logger.error(f"Error occurred while creating student attendance links: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to create student attendance links: {str(e)}")

@app.post("/api/attendance/link/{attendanceid}")
async def create_student_links_for_attendance(attendanceid: int = Path(..., description="The ID of the attendance record to link students to")):
    """
    Create student attendance links for a given attendance ID and mark all students as absent by default.

    Args:
        attendanceid (int): The ID of the attendance record to link students to.

    Returns:
        dict: A success message if links are created, or raises an HTTPException.
    """
    # Custom validation to ensure `attendanceid` is a positive integer
    if attendanceid <= 0:
        raise HTTPException(status_code=422, detail="attendanceid must be a positive integer.")

    try:
        # Check if the attendance record exists
        attendance = await get_attendance_by_id(attendanceid)
        if not attendance:
            raise HTTPException(status_code=404, detail=f"Attendance with ID {attendanceid} not found")

        # Fetch all students and create links for the given attendance ID, with `attendancecheck=False` by default
        students = await get_all_students()
        for student in students:
            # Check if a link already exists for this student and attendance ID
            existing_link = await get_student_attendance_link(student['studentid'], attendanceid)
            
            # If no link exists, create a new attendance link and increment the absent count
            if not existing_link:
                await create_student_attendance_link(
                    studentid=student['studentid'],
                    attendanceid=attendanceid,
                    attendancecheck=False  # Set the default check to False (absent)
                )
                
                # Increment the absent count for each student since they are marked as absent by default
                await increment_absent_count(student['studentid'])

        return {"message": "Student attendance links created successfully, and absent counts incremented where necessary."}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error occurred while creating student attendance links: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create student attendance links: {str(e)}")


@app.post("/api/attendance/link")
async def create_or_update_attendance_link(attendance_link: AttendanceLinkCreate):
    logging.info(f"Received attendance link data: {attendance_link}")

    # Validate the data types and content of the received fields
    if not isinstance(attendance_link.studentid, int):
        logging.error(f"Invalid studentID type: {type(attendance_link.studentid)}. Expected int.")
        raise HTTPException(status_code=422, detail="Invalid studentID type. Expected int.")
    if not isinstance(attendance_link.attendanceid, int):
        logging.error(f"Invalid attendanceID type: {type(attendance_link.attendanceid)}. Expected int.")
        raise HTTPException(status_code=422, detail="Invalid attendanceID type. Expected int.")
    if not isinstance(attendance_link.attendancecheck, bool):
        logging.error(f"Invalid attendanceCheck type: {type(attendance_link.attendancecheck)}. Expected bool.")
        raise HTTPException(status_code=422, detail="Invalid attendanceCheck type. Expected bool.")

    logging.info(f"Validated attendance link data: {attendance_link}")

    # Retrieve the existing attendanceCheck status for this link
    current_status = await get_attendance_check_status(attendance_link.studentid, attendance_link.attendanceid)

    # If no attendance link found, create a new link and initialize counts
    if current_status is None:
        logging.info("No existing attendance link found. Creating a new link.")
        try:
            # Create the attendance link with the initial attendance check value
            new_link = await create_student_attendance_link(
                studentid=attendance_link.studentid,
                attendanceid=attendance_link.attendanceid,
                attendancecheck=attendance_link.attendancecheck
            )

            # Based on initial status, update attendance or absent count
            if attendance_link.attendancecheck:
                await increment_attendance_count(attendance_link.studentid)
            else:
                await increment_absent_count(attendance_link.studentid)

            logging.info(f"Created new attendance link: {new_link}")
            return {"message": "Attendance link created successfully", "link": new_link}
        except Exception as e:
            logging.error(f"Error creating new attendance link: {e}")
            raise HTTPException(status_code=500, detail="Failed to create new attendance link")

    # If attendance link exists, update it and adjust the counts if necessary
    if current_status != attendance_link.attendancecheck:
        # Adjust the counters based on the old and new status
        if attendance_link.attendancecheck:  # Marking as present
            await increment_attendance_count(attendance_link.studentid)
            await decrement_absent_count(attendance_link.studentid)
        else:  # Marking as absent
            await decrement_attendance_count(attendance_link.studentid)
            await increment_absent_count(attendance_link.studentid)

    # Update the attendance link with the new status
    try:
        updated_link = await update_student_attendance_link(
            attendance_link.studentid,
            attendance_link.attendanceid,
            attendance_link.attendancecheck
        )
        logging.info(f"Updated link: {updated_link}")
        return {"message": "Attendance link updated successfully", "link": updated_link}
    except Exception as e:
        logging.error(f"Error updating attendance link: {e}")
        raise HTTPException(status_code=500, detail="Failed to update attendance link")


# 1. Create an attendance record
@app.post("/api/attendance")
async def add_attendance(attendance: AttendanceCreate):
    try:
        existing_attendance = await get_attendance_by_date(attendance.Date)
        if existing_attendance and 'attendanceid' in existing_attendance:
            return {"message": "Attendance record already exists", "attendanceID": existing_attendance['attendanceid']}
        elif existing_attendance:
            raise HTTPException(status_code=500, detail=f"Unexpected attendance record structure: {existing_attendance}")

        # Create a new attendance record
        new_attendance = await create_attendance(Date=attendance.Date)
        if not new_attendance or 'attendanceid' not in new_attendance:
            raise HTTPException(status_code=500, detail=f"Unexpected structure in new attendance record: {new_attendance}")

        return {"message": "Attendance created successfully", "attendanceID": new_attendance['attendanceid']}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error occurred while creating attendance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create attendance record: {str(e)}")

# Verify the endpoint definition expects an integer and has proper validation
@app.get("/api/attendance/link/check")
async def check_student_attendance_link(attendanceid: int = Query(..., description="The ID of the attendance record to link students to")):

    """
    Check if student attendance links exist for a given attendance ID.
    Returns a JSON object with the links.
    """
    try:
        # Ensure `attendanceid` is a valid integer before proceeding
        if attendanceid <= 0:
            raise HTTPException(status_code=422, detail="attendanceid must be a positive integer.")

        # Fetch all student attendance links for the specified attendance ID
        existing_links = await get_all_student_attendance_links_for_attendance(attendanceid)
        return {"links": existing_links}  # Return the attendance links
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error occurred while checking student attendance links: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to check attendance links.")


@app.post("/api/attendance/link")
async def create_or_update_attendance_link(attendance_link: AttendanceLinkCreate):
    logging.info(f"Received attendance link data: {attendance_link}")

    # Validate the data types and content of the received fields
    if not isinstance(attendance_link.studentid, int):
        logging.error(f"Invalid studentID type: {type(attendance_link.studentid)}. Expected int.")
        raise HTTPException(status_code=422, detail="Invalid studentID type. Expected int.")
    if not isinstance(attendance_link.attendanceid, int):
        logging.error(f"Invalid attendanceID type: {type(attendance_link.attendanceid)}. Expected int.")
        raise HTTPException(status_code=422, detail="Invalid attendanceID type. Expected int.")
    if not isinstance(attendance_link.attendancecheck, bool):
        logging.error(f"Invalid attendanceCheck type: {type(attendance_link.attendancecheck)}. Expected bool.")
        raise HTTPException(status_code=422, detail="Invalid attendanceCheck type. Expected bool.")

    logging.info(f"Validated attendance link data: {attendance_link}")

    # Retrieve the existing attendanceCheck status for this link
    current_status = await get_attendance_check_status(attendance_link.studentid, attendance_link.attendanceid)

    # If no attendance link found, create a new link and initialize counts
    if current_status is None:
        logging.info("No existing attendance link found. Creating a new link.")
        try:
            # Create the attendance link with the initial attendance check value
            new_link = await create_student_attendance_link(
                studentid=attendance_link.studentid,
                attendanceid=attendance_link.attendanceid,
                attendancecheck=attendance_link.attendancecheck
            )

            # Based on initial status, update attendance or absent count
            if attendance_link.attendancecheck:
                await increment_attendance_count(attendance_link.studentid)
            else:
                await increment_absent_count(attendance_link.studentid)

            logging.info(f"Created new attendance link: {new_link}")
            return {"message": "Attendance link created successfully", "link": new_link}
        except Exception as e:
            logging.error(f"Error creating new attendance link: {e}")
            raise HTTPException(status_code=500, detail="Failed to create new attendance link")

    # If attendance link exists, update it and adjust the counts if necessary
    if current_status != attendance_link.attendancecheck:
        # Adjust the counters based on the old and new status
        if attendance_link.attendancecheck:  # Marking as present
            await increment_attendance_count(attendance_link.studentid)
            await decrement_absent_count(attendance_link.studentid)
        else:  # Marking as absent
            await decrement_attendance_count(attendance_link.studentid)
            await increment_absent_count(attendance_link.studentid)

    # Update the attendance link with the new status
    try:
        updated_link = await update_student_attendance_link(
            attendance_link.studentid,
            attendance_link.attendanceid,
            attendance_link.attendancecheck
        )
        logging.info(f"Updated link: {updated_link}")
        return {"message": "Attendance link updated successfully", "link": updated_link}
    except Exception as e:
        logging.error(f"Error updating attendance link: {e}")
        raise HTTPException(status_code=500, detail="Failed to update attendance link")
 
@app.get("/api/attendance/by-date")
async def get_attendance_by_date_api(date: str = Query(..., description="Date in YYYY-MM-DD format")):
    """
    Get the attendance record by date.

    Args:
        date (str): Date in YYYY-MM-DD format.

    Returns:
        dict: Attendance record for the specified date, or a 404 error if not found.
    """
    try:
        # Parse the date string into a `datetime.date` object
        attendance_date = datetime.strptime(date, "%Y-%m-%d").date()
        logging.info(f"Parsed date: {attendance_date}")

        # Fetch the attendance record for the given date
        attendance = await get_attendance_by_date(attendance_date)

        if not attendance:
            raise HTTPException(status_code=404, detail="Attendance record not found for the specified date.")
        
        # Return the found attendance record
        return {"attendance": attendance}

    except ValueError:
        # If the date format is incorrect, return a 422 error
        logging.error(f"Invalid date format received: {date}. Expected YYYY-MM-DD format.")
        raise HTTPException(status_code=422, detail="Invalid date format. Please use YYYY-MM-DD format.")
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.error(f"Error occurred while fetching attendance record by date: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch attendance record for the specified date: {str(e)}")