# test_database.py

import asyncio
from database import connect_db, disconnect_db, fetch_all_students  # Adjust the import based on your directory structure

async def test_fetch_students():
    # Connect to the database
    await connect_db()
    
    # Fetch all students
    students = await fetch_all_students()
    
    # Print the results
    print("Fetched students data:", students)
    
    # Disconnect from the database
    await disconnect_db()

# Run the test
if __name__ == "__main__":
    asyncio.run(test_fetch_students())
