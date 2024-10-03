import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Snackbar, Alert } from "@mui/material";

const API_URL = "http://localhost:8000"; // Replace with your FastAPI backend URL

export default function StudentManagement() {
  const [newStudentName, setNewStudentName] = useState("");
  const [deleteStudentID, setDeleteStudentID] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Handle adding a new student
  const handleAddStudent = async () => {
    try {
      const response = await axios.post(`${API_URL}/students`, {
        name: newStudentName,
      });
      setSnackbarMessage(`Student "${response.data.name}" added successfully!`);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to add student. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setNewStudentName(""); // Clear the input field
    }
  };

  // Handle deleting a student by ID
  const handleDeleteStudent = async () => {
    try {
      await axios.delete(`${API_URL}/students/${deleteStudentID}`);
      setSnackbarMessage(`Student ID ${deleteStudentID} deleted successfully!`);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to delete student. Please check the ID and try again.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setDeleteStudentID(""); // Clear the input field
    }
  };

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Manage Students</h2>
      <div>
        <TextField
          label="New Student Name"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          style={{ margin: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={handleAddStudent}>
          Add Student
        </Button>
      </div>
      <div>
        <TextField
          label="Student ID to Delete"
          value={deleteStudentID}
          onChange={(e) => setDeleteStudentID(e.target.value)}
          style={{ margin: "10px" }}
        />
        <Button variant="contained" color="secondary" onClick={handleDeleteStudent}>
          Delete Student
        </Button>
      </div>
      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}