import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import AnalysisView from './components/AnalysisView';
import LayoutPage from './components/LayoutPage';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Box,
  IconButton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsightsIcon from '@mui/icons-material/Insights';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7c4dff',
    },
    background: {
      default: '#f3f3f3',
    },
  },
  typography: {
    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar
          position="static"
          sx={{
            background: 'linear-gradient(to right, #7c4dff, #651fff)',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                letterSpacing: 1.2,
              }}
            >
              PBIX Analyzer
            </Typography>

            <Button
              color="inherit"
              component={Link}
              to="/"
              startIcon={<UploadFileIcon />}
              sx={{
                mx: 1,
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              Upload
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/analysis"
              startIcon={<InsightsIcon />}
              sx={{
                mx: 1,
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              Analysis
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2 }}>
          <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/analysis" element={<AnalysisView />} />
            <Route path="/layout/:pageIndex" element={<LayoutPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
