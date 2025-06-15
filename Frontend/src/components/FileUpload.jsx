import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  CssBaseline,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResponseMessage('');
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      localStorage.setItem('report_metadata', JSON.stringify(data.report_metadata));
      setResponseMessage('success');
    } catch (error) {
      setResponseMessage('error');
    } finally {
      setUploading(false);
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#7c4dff',
      },
    },
    typography: {
      fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: darkMode
            ? 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(220, 151, 234, 0.9)), url(https://images.unsplash.com/photo-1604014237744-5dd2cfed7fef?auto=format&fit=crop&w=1470&q=80)'
            : 'linear-gradient(rgba(255,255,255,0.8), rgba(231, 241, 191, 0.9)), url(https://images.unsplash.com/photo-1581090700227-1e7b5a99c630?auto=format&fit=crop&w=1470&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.3s ease-in-out',
        }}
      >
        {/* Dark mode toggle button fixed bottom right */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="primary"
              />
            }
            label="Dark Mode"
          />
        </Box>

        <Card
          sx={{
            maxWidth: 500,
            mx: 2,
            p: 4,
            boxShadow: 6,
            borderRadius: 4,
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            background: darkMode
              ? 'linear-gradient(135deg, #1c1c1c 30%, #2c2c2c 90%)'
              : 'linear-gradient(135deg, #f3e5f5 30%, #ede7f6 90%)',
          }}
        >
          <CardContent>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              🔍 PBIX Analyzer
            </Typography>

            <label htmlFor="upload-input">
              <input
                id="upload-input"
                type="file"
                accept=".pbix"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <IconButton
                color="primary"
                component="span"
                size="large"
                sx={{
                  backgroundColor: darkMode ? '#333' : '#e3f2fd',
                  p: 2,
                  mb: 2,
                }}
              >
                <UploadFileIcon fontSize="large" />
              </IconButton>
            </label>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {file ? `Selected File: ${file.name}` : 'No file selected'}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={uploading}
              sx={{
                py: 1.2,
                fontSize: '1rem',
                borderRadius: 3,
                textTransform: 'none',
              }}
            >
              Upload & Analyze
            </Button>

            {uploading && <LinearProgress sx={{ mt: 3 }} />}

            <Box sx={{ mt: 3 }}>
              {responseMessage === 'success' && (
                <Typography color="success.main">
                  <CheckCircleOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  File uploaded successfully! Go to Analysis tab.
                </Typography>
              )}
              {responseMessage === 'error' && (
                <Typography color="error">
                  <ErrorOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Upload failed. Try again.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
