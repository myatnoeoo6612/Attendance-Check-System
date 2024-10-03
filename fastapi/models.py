# models.py


from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# # Student Table Definition
# class Student(Base):
#     __tablename__ = 'Student'
#     studentID = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Auto-increment primary key
#     name = Column(String(200), nullable=False)
#     attendanceCount = Column(Integer, default=0)
#     absentCount = Column(Integer, default=0)

# # Attendance Table Definition
# class Attendance(Base):
#     __tablename__ = 'Attendance'
#     attendanceID = Column(Integer, primary_key=True, index=True)
#     Date = Column(Date, nullable=False)

# # StudentAttendanceLink Table Definition
# class StudentAttendanceLink(Base):
#     __tablename__ = 'StudentAttendanceLink'
#     linkID = Column(Integer, primary_key=True, index=True)
#     attendanceID = Column(Integer, nullable=False)
#     studentID = Column(Integer, nullable=False)
#     attendanceCheck = Column(Boolean, default=False)




class Student(Base):
    __tablename__ = "student"
    studentID = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    attendanceCount = Column(Integer, default=0)
    absentCount = Column(Integer, default=0)

class Attendance(Base):
    __tablename__ = "attendance"
    attendanceID = Column(Integer, primary_key=True, index=True)
    Date = Column(Date, nullable=False)

class StudentAttendanceLink(Base):
    __tablename__ = "studentattendancelink"
    linkID = Column(Integer, primary_key=True, index=True)
    attendanceID = Column(Integer, ForeignKey("attendance.attendanceID"), nullable=False)
    studentID = Column(Integer, ForeignKey("student.studentID"), nullable=False)
    attendanceCheck = Column(Boolean, default=False)