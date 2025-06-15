import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Button,
} from '@mui/material';

export default function LayoutPage() {
  const { pageIndex } = useParams();
  const [metadata, setMetadata] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

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

  const page = metadata.pages[pageIndex];
  const scale = 1;

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
          🗺️ Layout of Page {page.page_number}: {page.page_name}
        </Typography>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            height: 800,
            border: '2px dashed #aaa',
            mx: 'auto',
            backgroundColor: darkMode ? '#121212' : '#f0f0f0',
            position: 'relative',
            overflow: 'auto', // enable scrolling
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              width: page.page_width ? page.page_width * scale : 1500,
              height: page.page_height ? page.page_height * scale : 1200,
              position: 'relative',
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
    </ThemeProvider>
  );
}
