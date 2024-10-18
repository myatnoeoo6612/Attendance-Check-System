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
import { createTheme, ThemeProvider } from "@mui/material/styles";

const API_URL = "http://localhost:8000"; // FastAPI backend URL

// Custom Theme to Match Dashboard
const theme = createTheme({
  palette: {
    primary: {
      main: '#66BB6A', // Same primary green from Dashboard
    },
    secondary: {
      main: '#D81B60', // Same secondary color (red/pink)
    },
    background: {
      default: '#F1F8E9', // Light green background to match the Dashboard
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E7D32', // Dark green for text
      secondary: '#558B2F', // Lighter green for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '2.5rem', // Bigger title font size
      fontWeight: 600,
      color: '#2E7D32',
    },
    h6: {
      fontSize: '1.2rem',
      color: '#558B2F',
    },
  },
});

// Styled Components
const Background = styled("div")({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: theme.palette.background.default,
});

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
  backgroundColor: theme.palette.background.paper,
  textAlign: "center",
  width: "100%",
  maxWidth: "500px",
  minHeight: "400px", // Equal height for both forms
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // Center the content vertically
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: theme.typography.h4.fontSize,
  color: theme.palette.text.primary,
  marginBottom: "8px",
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize,
  color: theme.palette.text.secondary,
  marginBottom: "16px",
}));

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
    <ThemeProvider theme={theme}>
      <Background>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {/* Add Student Section */}
            <Grid item xs={12} md={6}>
              <FormContainer elevation={3}>
                <Title variant="h4">Add Student</Title>
                <Subtitle>Enter the student's name</Subtitle>
                <form onSubmit={handleAddStudent}>
                  <TextField
                    fullWidth
                    label="Student Name"
                    variant="outlined"
                    margin="normal"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    style={{ marginBottom: '20px' }} // Equal margin
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ padding: "12px", fontSize: "1.1rem" }}
                    type="submit"
                  >
                    Add
                  </Button>
                </form>
              </FormContainer>
            </Grid>

            {/* Delete Student Section */}
            <Grid item xs={12} md={6}>
              <FormContainer elevation={3}>
                <Title variant="h4">Delete Student by ID</Title>
                <Subtitle>Enter the student ID</Subtitle>
                <form onSubmit={handleDeleteStudent}>
                  <TextField
                    fullWidth
                    label="Student Name"
                    variant="outlined"
                    margin="normal"
                    value={deleteStudentID}
                    onChange={(e) => setDeleteStudentID(e.target.value)}
                    style={{ marginBottom: '20px' }} // Equal margin
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    style={{ padding: "12px", fontSize: "1.1rem" }}
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
    </ThemeProvider>
  );
}
