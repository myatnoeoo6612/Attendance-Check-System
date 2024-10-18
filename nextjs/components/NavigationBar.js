import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRouter } from 'next/router';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const NavigationBar = () => {
  const router = useRouter();
  const handleChange = (event, newValue) => {
    router.push(newValue);
  };

  // Custom theme with a new font
  const theme = createTheme({
    palette: {
      primary: {
        main: '#8BC34A', // Light green color
      },
      background: {
        default: '#f5f5f5', // Light background for a cool effect
      },
    },
    typography: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif', // Custom font family
    },
    components: {
      MuiTab: {
        styleOverrides: {
          root: {
            fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif', // Custom font for tabs
            textTransform: 'none', // Prevent all caps
            fontSize: '1rem', // Adjust font size if needed
            '&.Mui-selected': {
              color: '#fff', // White text for selected tab
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        color="primary"
        sx={{
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Adds shadow
          borderBottomLeftRadius: '16px', // Curved bottom-left corner
          borderBottomRightRadius: '16px', // Curved bottom-right corner
        }}
      >
        <Toolbar>
          <Tabs
            value={router.pathname}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary" // Secondary color for the indicator
          >
            <Tab label="Dashboard" value="/dashboard" />
            <Tab label="Attendance List" value="/attendance" />
            <Tab label="Add/Delete" value="/add-attendance" />
            <Tab label="Report" value="/subject-report" />
          </Tabs>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default NavigationBar;
