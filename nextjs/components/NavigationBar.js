import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRouter } from 'next/router';

const NavigationBar = () => {
  const router = useRouter();
  const handleChange = (event, newValue) => {
      router.push(newValue);
  };

  return (
      <AppBar position="static">
          <Toolbar>
              <Tabs value={router.pathname} onChange={handleChange}>
                  <Tab label="Dashboard" value="/" />
                  <Tab label="Attendance" value="/attendance" />
                  <Tab label="Add attendance" value="/add-attendance" />
                  <Tab label="Subject report" value="/subject-report" />
              </Tabs>
          </Toolbar>
      </AppBar>
  );
};

export default NavigationBar;
