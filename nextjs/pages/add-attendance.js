import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";

const API_URL = "http://localhost:8000"; // FastAPI backend URL

// Styled Components
const Background = styled("div")({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f9f9f9 50%, #fff 50%)",
});

const FormContainer = styled(Paper)({
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  textAlign: "center",
  marginBottom: "40px",
});

const Title = styled(Typography)({
  fontWeight: "bold",
  fontSize: "24px",
  color: "#0277bd",
  marginBottom: "8px",
});

const Subtitle = styled(Typography)({
  fontSize: "14px",
  color: "#ff4081",
  marginBottom: "16px",
});

export default function AddAttendancePage() {
  const [newStudentName, setNewStudentName] = useState("");
  const [deleteStudentID, setDeleteStudentID] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Handle adding a new student
  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newStudentName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add student.");
      }

      const data = await response.json();
      setSnackbarMessage(`Student "${data.student.name}" added successfully!`);
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
  const handleDeleteStudent = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/students/${deleteStudentID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student. Please check the ID and try again.");
      }

      setSnackbarMessage(`Student ID ${deleteStudentID} deleted successfully!`);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.message || "Failed to delete student. Please try again.");
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
    <Background>
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center">
          {/* Add Student Section */}
          <Grid item xs={12} sm={6} md={4}>
            <FormContainer elevation={3}>
              <Title variant="h4">Add New Student</Title>
              <Subtitle>Enter the student's name to add them to the system</Subtitle>
              <form onSubmit={handleAddStudent}>
                <TextField
                  fullWidth
                  label="Student Name"
                  variant="outlined"
                  margin="normal"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: "16px", backgroundColor: "#0277bd" }}
                  type="submit"
                >
                  Add Student
                </Button>
              </form>
            </FormContainer>
          </Grid>

          {/* Delete Student Section */}
          <Grid item xs={12} sm={6} md={4}>
            <FormContainer elevation={3}>
              <Title variant="h4">Delete Student</Title>
              <Subtitle>Enter the student ID to delete them from the system</Subtitle>
              <form onSubmit={handleDeleteStudent}>
                <TextField
                  fullWidth
                  label="Student ID"
                  variant="outlined"
                  margin="normal"
                  value={deleteStudentID}
                  onChange={(e) => setDeleteStudentID(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  style={{ marginTop: "16px", backgroundColor: "#d81b60" }}
                  type="submit"
                >
                  Delete Student
                </Button>
              </form>
            </FormContainer>
          </Grid>
        </Grid>

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
      </Container>
    </Background>
  );
}
