from databases import Database
from datetime import date  # Import date from datetime module

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

# Function to fetch all students from the database
async def get_all_students():
    """
    Fetches all students from the Student table.

    Returns:
        List of dictionaries containing student details.
    """
    query = """
    SELECT studentid, name, attendancecount, absentcount
    FROM student
    """
    try:
        students = await database.fetch_all(query=query)
        return students
    except Exception as e:
        print(f"Failed to fetch students: {e}")
        return []


async def get_attendance_by_id(attendanceID: int):
    query = """
    SELECT Date
    FROM Attendance
    WHERE attendanceID = :attendanceID
    """
    values = {"attendanceID": attendanceID}
    attendance = await database.fetch_one(query=query, values=values)
    return attendance



# Function to insert a new attendance record into the Attendance table
async def create_attendance(Date: date):
    query = """
    INSERT INTO Attendance (Date)
    VALUES (:Date)
    RETURNING attendanceID, Date
    """
    values = {"Date": Date}
    new_attendance = await database.fetch_one(query=query, values=values)
    return new_attendance