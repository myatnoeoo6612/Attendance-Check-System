from databases import Database
from datetime import date  # Import date from datetime module
import logging

from fastapi import logger


POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"


DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'


database = Database(DATABASE_URL)


async def connect_db():
   await database.connect()
   print("Database connected")


async def disconnect_db():
   await database.disconnect()
   print("Database disconnected")


# Function to insert a new user into the users table
async def insert_user(username: str, password_hash: str, email: str):
   query = """
   INSERT INTO users (username, password_hash, email)
   VALUES (:username, :password_hash, :email)
   RETURNING user_id, username, password_hash, email, created_at
   """
   values = {"username": username, "password_hash": password_hash, "email": email}
   return await database.fetch_one(query=query, values=values)


# Function to select a user by user_id from the users table
async def get_user(username: str):
   query = "SELECT * FROM users WHERE username = :username"
   return await database.fetch_one(query=query, values={"username": username})


# Function to select a user by email from the users table
async def get_user_by_email(email: str,password_hash:str):
   query = "SELECT * FROM users WHERE email = :email and password_hash = :password_hash"
   return await database.fetch_one(query=query, values={"email": email,"password_hash": password_hash})


# Function to update a user in the users table
async def update_user(user_id: int, username: str, password_hash: str, email: str):
   query = """
   UPDATE users
   SET username = :username, password_hash = :password_hash, email = :email
   WHERE user_id = :user_id
   RETURNING user_id, username, password_hash, email, created_at
   """
   values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
   return await database.fetch_one(query=query, values=values)


# Function to delete a user from the users table
async def delete_user(user_id: int):
   query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
   return await database.fetch_one(query=query, values={"user_id": user_id})


# Student-related functions
async def get_student_by_id(studentID: int):
    query = """
    SELECT name, attendanceCount, absentCount
    FROM Student
    WHERE studentID = :studentID
    """
    values = {"studentID": studentID}
    student = await database.fetch_one(query=query, values=values)
    return student

# Function to insert a new student into the Student table (no studentID needed)
async def create_student(name: str, attendanceCount: int = 0, absentCount: int = 0):
    query = """
    INSERT INTO Student (name, attendanceCount, absentCount)
    VALUES (:name, :attendanceCount, :absentCount)
    RETURNING studentID, name, attendanceCount, absentCount
    """
    values = {
        "name": name,
        "attendanceCount": attendanceCount,
        "absentCount": absentCount,
    }
    new_student = await database.fetch_one(query=query, values=values)
    return new_student
 
async def delete_student_by_id(studentID: int):
    """
    Deletes a student from the Student table using the studentID.

    Args:
        studentID (int): The ID of the student to delete.

    Returns:
        dict: The deleted student record if the deletion was successful, None otherwise.
    """
    query = "DELETE FROM Student WHERE studentID = :studentID RETURNING *"
    values = {"studentID": studentID}
    deleted_student = await database.fetch_one(query=query, values=values)
    return deleted_student

async def get_all_students():
    """
    Retrieves all student records from the 'Student' table.

    Returns:
        List[dict]: A list of dictionaries representing each student record.
    """
    query = "SELECT * FROM Student"
    try:
        students = await database.fetch_all(query=query)
        if not students:
            print("No students found in the database.")
        else:
            print(f"Retrieved {len(students)} students from the database.")
        return students
    except Exception as e:
        print(f"Error fetching students: {e}")  # Log the exact error
        raise RuntimeError(f"Failed to fetch students: {e}")
 
async def get_attendance_by_id(attendanceid: int):
    """
    Retrieve an attendance record by ID.
    
    Args:
        attendanceid (int): The ID of the attendance record to fetch.

    Returns:
        dict: The attendance record if found, or None.
    """
    try:
        # Log the input attendance ID
        logging.info(f"Fetching attendance record with ID: {attendanceid}")

        query = "SELECT attendanceid, Date FROM Attendance WHERE attendanceid = :attendanceid"
        values = {"attendanceid": attendanceid}
        attendance = await database.fetch_one(query=query, values=values)

        # Log the result if found, otherwise log a warning
        if attendance:
            logging.info(f"Attendance record found: {attendance}")
            return dict(attendance)  # Convert the record to a dictionary if found
        else:
            logging.warning(f"No attendance record found for ID: {attendanceid}")
            return None
    except Exception as e:
        logging.error(f"Error occurred while fetching attendance record for ID {attendanceid}: {e}")
        raise RuntimeError(f"Failed to fetch attendance by ID: {e}")

async def get_attendance_by_date(Date: date):
    """
    Retrieve an attendance record by date.
    Args:
        Date (date): The date of the attendance record to fetch.
    Returns:
        dict: The attendance record if found, or None.
    """
    try:
        query = "SELECT attendanceid, Date FROM Attendance WHERE Date = :Date"
        values = {"Date": Date}
        attendance = await database.fetch_one(query=query, values=values)

        # Log the result and convert the record to a dictionary, if found
        if attendance:
            logging.info(f"Attendance record found for date {Date}: {attendance}")
            return dict(attendance)  # Convert to dict if record is found
        else:
            logging.warning(f"No attendance record found for date {Date}.")
            return None

    except Exception as e:
        logging.error(f"Error occurred while fetching attendance for date {Date}: {e}")
        raise RuntimeError(f"Failed to fetch attendance by date: {e}")

async def create_attendance(Date: date):
    existing_attendance = await get_attendance_by_date(Date)
    if existing_attendance:
        return existing_attendance  # Return existing attendance record

    query = "INSERT INTO Attendance (Date) VALUES (:Date) RETURNING attendanceid, Date"
    values = {"Date": Date}
    new_attendance = await database.fetch_one(query=query, values=values)
    return dict(new_attendance) if new_attendance else None 

async def get_attendance_check_status(studentid: int, attendanceid: int):
    """
    Get the current attendanceCheck status for a specific student and attendance record.
    
    Args:
        studentid (int): The ID of the student.
        attendanceid (int): The ID of the attendance record.

    Returns:
        bool: The current attendanceCheck status.
    """
    query = """
    SELECT attendancecheck
    FROM studentattendancelink
    WHERE studentid = :studentid AND attendanceid = :attendanceid
    """
    values = {"studentid": studentid, "attendanceid": attendanceid}
    status = await database.fetch_one(query=query, values=values)
    return status['attendancecheck'] if status else None
# StudentAttendanceLink-related functions

async def get_student_attendance_link(studentid: int, attendanceid: int):
    query = "SELECT * FROM StudentAttendanceLink WHERE studentid = :studentid AND attendanceid = :attendanceid"
    values = {"studentid": studentid, "attendanceid": attendanceid}
    link = await database.fetch_one(query=query, values=values)
    return dict(link) if link else None

async def create_student_attendance_link(studentid: int, attendanceid: int, attendancecheck: bool):
    """
    Create a new student attendance link for a given student and attendance record.
    Ensures that no duplicate links are created by checking for existing entries.
    """
    # Check if a link already exists for the given studentid and attendanceid
    existing_link = await get_student_attendance_link(studentid, attendanceid)
    
    if existing_link:
        logging.info(f"Link already exists for studentid={studentid} and attendanceid={attendanceid}. No new link created.")
        return existing_link  # Return the existing link without creating a new one

    try:
        # Create a new attendance link if no existing link is found
        query = """
        INSERT INTO studentattendancelink (studentid, attendanceid, attendancecheck)
        VALUES (:studentid, :attendanceid, :attendancecheck)
        RETURNING linkid, studentid, attendanceid, attendancecheck
        """
        values = {"studentid": studentid, "attendanceid": attendanceid, "attendancecheck": attendancecheck}
        new_link = await database.fetch_one(query=query, values=values)
        
        logging.info(f"New attendance link created: {new_link}")
        return new_link

    except Exception as e:
        logging.error(f"Error while creating attendance link: {e}")
        raise RuntimeError(f"Failed to create attendance link: {e}")

async def update_student_attendance_link(studentid: int, attendanceid: int, attendancecheck: bool):
    query = """
    UPDATE StudentAttendanceLink
    SET attendancecheck = :attendancecheck
    WHERE studentid = :studentid AND attendanceid = :attendanceid
    RETURNING linkid, studentid, attendanceid, attendancecheck
    """
    values = {"studentid": studentid, "attendanceid": attendanceid, "attendancecheck": attendancecheck}
    updated_link = await database.fetch_one(query=query, values=values)
    return dict(updated_link) if updated_link else None

# Function to retrieve all attendance links for a given attendance ID
async def get_all_attendance_links(attendanceid: int):
    """
    Retrieve all attendance links for a given attendance ID.
    Args:
        attendanceid (int): The ID of the attendance record to fetch links for.
    Returns:
        List[dict]: A list of attendance link records.
    """
    try:
        query = """
        SELECT * FROM StudentAttendanceLink
        WHERE attendanceid = :attendanceid
        """
        values = {"attendanceid": attendanceid}
        links = await database.fetch_all(query=query, values=values)
        return [dict(link) for link in links] if links else []
    except Exception as e:
        logging.error(f"Error occurred while fetching attendance links for attendanceid={attendanceid}: {e}")
        raise RuntimeError(f"Failed to fetch attendance links for attendanceid={attendanceid}")

# Function to retrieve all attendance links for a given attendance ID
async def get_all_student_attendance_links_for_attendance(attendanceid: int):
    """
    Retrieve all student attendance links for a given attendance ID.

    Args:
        attendanceid (int): The ID of the attendance record to fetch links for.

    Returns:
        List[dict]: A list of dictionaries representing each attendance link record.
    """
    query = """
    SELECT * FROM StudentAttendanceLink
    WHERE attendanceid = :attendanceid
    """
    values = {"attendanceid": attendanceid}
    try:
        links = await database.fetch_all(query=query, values=values)
        if not links:
            logger.warning(f"No attendance links found for attendanceID: {attendanceid}")
        return [dict(link) for link in links]
    except Exception as e:
        logger.error(f"Error occurred while fetching attendance links for attendanceID {attendanceid}: {e}")
        raise RuntimeError(f"Failed to fetch attendance links: {e}")


#increment

async def increment_attendance_count(studentid: int):
    """Increment the attendance count for a given student."""
    try:
        query = """
        UPDATE Student
        SET attendancecount = attendancecount + 1
        WHERE studentid = :studentid
        RETURNING studentid, name, attendancecount, absentcount
        """
        values = {"studentid": studentid}
        updated_student = await database.fetch_one(query=query, values=values)
        logging.info(f"Attendance count incremented for student: {updated_student}")
        return updated_student
    except Exception as e:
        logging.error(f"Error incrementing attendance count for studentid={studentid}: {e}")
        raise RuntimeError(f"Failed to increment attendance count: {e}")
    
async def increment_absent_count(studentid: int):
    """Increment the absent count for a given student."""
    try:
        query = """
        UPDATE Student
        SET absentcount = absentcount + 1
        WHERE studentid = :studentid
        RETURNING studentid, name, attendancecount, absentcount
        """
        values = {"studentid": studentid}
        updated_student = await database.fetch_one(query=query, values=values)
        logging.info(f"Absent count incremented for student: {updated_student}")
        return updated_student
    except Exception as e:
        logging.error(f"Error incrementing absent count for studentid={studentid}: {e}")
        raise RuntimeError(f"Failed to increment absent count: {e}")
    
async def decrement_attendance_count(studentid: int):
    """Decrement the attendance count for a given student."""
    try:
        query = """
        UPDATE Student
        SET attendancecount = attendancecount - 1
        WHERE studentid = :studentid AND attendancecount > 0  -- Ensure it doesn't go below zero
        RETURNING studentid, name, attendancecount, absentcount
        """
        values = {"studentid": studentid}
        updated_student = await database.fetch_one(query=query, values=values)
        logging.info(f"Attendance count decremented for student: {updated_student}")
        return updated_student
    except Exception as e:
        logging.error(f"Error decrementing attendance count for studentid={studentid}: {e}")
        raise RuntimeError(f"Failed to decrement attendance count: {e}")

async def decrement_absent_count(studentid: int):
    """Decrement the absent count for a given student."""
    try:
        query = """
        UPDATE Student
        SET absentcount = absentcount - 1
        WHERE studentid = :studentid AND absentcount > 0  -- Ensure it doesn't go below zero
        RETURNING studentid, name, attendancecount, absentcount
        """
        values = {"studentid": studentid}
        updated_student = await database.fetch_one(query=query, values=values)
        logging.info(f"Absent count decremented for student: {updated_student}")
        return updated_student
    except Exception as e:
        logging.error(f"Error decrementing absent count for studentid={studentid}: {e}")
        raise RuntimeError(f"Failed to decrement absent count: {e}")
