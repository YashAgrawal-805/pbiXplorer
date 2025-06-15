import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Button,
  Slider
} from '@mui/material';

export default function LayoutPage() {
  const { pageIndex } = useParams();
  const [metadata, setMetadata] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [scale, setScale] = useState(0.48);

  const handleScaleChange = (event, newValue) => {
    setScale(newValue);
  };

  useEffect(() => {
    const data = localStorage.getItem('report_metadata');
    if (data) {
      const parsed = JSON.parse(data);
      setMetadata(parsed);
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#7c4dff',
      },
    },
  });

  if (!metadata) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6">⛔ No metadata found.</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const oldpage = metadata.pages[pageIndex];
let page;

try {
  // Remove backticks or code block markers if present
  const sanitizedLayout = metadata.optimal_layout.replace(/```json|```/g, '').trim();

  // Parse the sanitized JSON
  page = JSON.parse(sanitizedLayout).pages[pageIndex];
} catch (error) {
  console.error("Failed to parse metadata.optimal_layout:", error);
  page = null; // Fallback if parsing fails
}


return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box sx={{ p: 2 }}>
      <Button
        component={Link}
        to="/analysis"
        variant="outlined"
        sx={{ mb: 2, borderRadius: 2 }}
      >
        ← Back to Dashboard
      </Button>

      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        🗺️ Compare Layouts: Old vs New
      </Typography>

      <Box sx={{ mb: 4 }}>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            Adjust Scale: {scale.toFixed(2)}
          </Typography>
          <Slider
            value={scale}
            min={0.1}
            max={10}
            step={0.01}
            onChange={handleScaleChange}
            valueLabelDisplay="auto"
            sx={{ width: 300 }}
          />
        </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 4,
          width: '100%',
          maxWidth: '100%',
          height: 800,
          mx: 'auto',
          backgroundColor: darkMode ? '#121212' : '#f0f0f0',
          borderRadius: 3,
          overflow: 'auto', // enable scrolling
        }}
      >
        {/* Old Layout */}
        <Box
          sx={{
            flex: 1,
            border: '2px dashed #aaa',
            position: 'relative',
            backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9',
            borderRadius: 3,
            overflow: 'auto',
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ textAlign: 'center', mt: 2, mb: 2 }}
          >
            Old Layout
          </Typography>
          <Box
            sx={{
              minWidth: 'auto',
              minHeight: 'auto',
              position: 'relative',
              mx: 'auto',
            }}
          >
            {oldpage.visuals.map((v, idx) => {
              const { x, y, width, height } = v.position;
              return (
                <Box
                  key={idx}
                  title={`${v.visual_type} #${v.visual_number}`}
                  sx={{
                    position: 'absolute',
                    left: x * scale,
                    top: y * scale,
                    width: width * scale,
                    height: height * scale,
                    backgroundColor: darkMode ? '#333' : '#fff',
                    border: '1px solid #999',
                    borderRadius: 2,
                    padding: 0.5,
                    boxShadow: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      fontSize: '0.7rem',
                      lineHeight: 1.2,
                    }}
                  >
                    🔲 {v.visual_type}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      fontSize: '0.65rem',
                      lineHeight: 1.2,
                      color: darkMode ? '#ccc' : '#555',
                    }}
                  >
                    #{v.visual_number}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* New Layout */}
        <Box
          sx={{
            flex: 1,
            border: '2px dashed #aaa',
            position: 'relative',
            backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9',
            borderRadius: 3,
            overflow: 'auto',
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ textAlign: 'center', mt: 2, mb: 2 }}
          >
            New Layout
          </Typography>
          <Box
            sx={{
              minWidth: 'auto',
              minHeight: 'auto',
              position: 'relative',
              mx: 'auto',
              padding: 10,
            }}
          >
            {page.visuals.map((v, idx) => {
              const { x, y, width, height } = v.position;
              return (
                <Box
                  key={idx}
                  title={`${v.visual_type} #${v.visual_number}`}
                  sx={{
                    position: 'absolute',
                    left: x * scale,
                    top: y * scale,
                    width: width * scale,
                    height: height * scale,
                    backgroundColor: darkMode ? '#333' : '#fff',
                    border: '1px solid #999',
                    borderRadius: 2,
                    padding: 0.5,
                    boxShadow: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      fontSize: '0.7rem',
                      lineHeight: 1.2,
                    }}
                  >
                    🔲 {v.visual_type}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      fontSize: '0.65rem',
                      lineHeight: 1.2,
                      color: darkMode ? '#ccc' : '#555',
                    }}
                  >
                    #{v.visual_number}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  </ThemeProvider>
);
}
