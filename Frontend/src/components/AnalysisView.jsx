import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Divider,
  Grid,
  Paper,
  Button,
  CssBaseline,
  Switch,
  FormControlLabel,
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function AnalysisView() {
  const [metadata, setMetadata] = useState(null);
  const [selectedPage, setSelectedPage] = useState(0);
  const [columnUsage, setColumnUsage] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const data = localStorage.getItem('report_metadata');
    if (data) {
      const parsedData = JSON.parse(data);
      setMetadata(parsedData);
      analyzeColumnUsage(parsedData.pages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const analyzeColumnUsage = (pages) => {
    const usageMap = {};
    pages.forEach((page) => {
      page.visuals.forEach((visual) => {
        visual.query_fields?.forEach((field) => {
          usageMap[field] = (usageMap[field] || 0) + 1;
        });

        Object.values(visual.projections || {}).forEach((fields) => {
          fields.forEach((field) => {
            usageMap[field] = (usageMap[field] || 0) + 1;
          });
        });
      });
    });
    setColumnUsage(usageMap);
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

  const handlePageChange = (e) => {
    setSelectedPage(e.target.value);
  };

  if (!metadata) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label="Dark Mode"
            sx={{ position: 'fixed', bottom: 10, right: 20, zIndex: 1000 }}
          />
          <Typography variant="h6">⛔ No data found. Please upload a PBIX file.</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const page = metadata.pages[selectedPage];
  const sortedColumns = Object.entries(columnUsage).sort((a, b) => b[1] - a[1]);
  const mostUsed = sortedColumns.slice(0, 5).map(([col, count]) => ({ col, count }));
  const leastUsed = sortedColumns.slice(-5).map(([col, count]) => ({ col, count }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ maxWidth: '1200px', mx: 'auto', py: 5, px: 3 }}>
        {/* Dark mode toggle fixed bottom right */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label="Dark Mode"
          />
        </Box>

        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: 'primary.main' }}>
          📊 Report Analysis Dashboard
        </Typography>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Select Page</InputLabel>
          <Select value={selectedPage} onChange={handlePageChange} label="Select Page">
            {metadata.pages.map((p, idx) => (
              <MenuItem key={idx} value={idx}>
                📘 Page {p.page_number}: {p.page_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Card sx={{ mb: 4, p: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              📘 Page {page.page_number}: {page.page_name}
            </Typography>
            <Typography variant="body1" mb={2}>
              <strong>Visuals:</strong> {page.visuals.length}
            </Typography>

            {page.visuals.map((v, idx) => (
              <Box
                key={idx}
                sx={{
                  my: 2,
                  p: 2,
                  border: '1px solid #ddd',
                  borderRadius: 3,
                  backgroundColor: darkMode ? '#1e1e1e' : '#fafafa',
                  boxShadow: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  🔲 Visual {v.visual_number}
                </Typography>
                <Typography>Type: {v.visual_type}</Typography>
                <Typography>
                  Position: x={v.position.x}, y={v.position.y}, size={v.position.width}x{v.position.height}
                </Typography>

                {Object.keys(v.projections).length > 0 && (
                  <Box mt={1}>
                    <Typography sx={{ mt: 1 }}>
                      🎯 <strong>Projections:</strong>
                    </Typography>
                    <ul>
                      {Object.entries(v.projections).map(([role, fields], i) => (
                        <li key={i}>
                          <strong>{role}</strong>: {fields.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}

                {v.query_fields.length > 0 && (
                  <Typography sx={{ mt: 1 }}>
                    🧮 <strong>Query Fields:</strong> {v.query_fields.join(', ')}
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                📈 Most Used Columns: Hover to find the Column and its Count
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
  <BarChart data={mostUsed} layout="vertical">
    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#888' : '#ccc'} />
    <XAxis type="number" stroke={darkMode ? '#fff' : '#000'} />
    <YAxis dataKey="col" tick={false} type="category" stroke={darkMode ? '#fff' : '#000'} />
    <Tooltip
      contentStyle={{
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#000',
      }}
    />
    <Bar dataKey="count" fill="#1976d2" />
  </BarChart>
</ResponsiveContainer>

            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                📉 Least Used Columns: Hover to find the Column and its Count
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
  <BarChart data={leastUsed} layout="vertical">
    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#888' : '#ccc'} />
    <XAxis type="number" stroke={darkMode ? '#fff' : '#000'} />
    <YAxis dataKey="col" tick={false} type="category" stroke={darkMode ? '#fff' : '#000'} />
    <Tooltip
      contentStyle={{
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#000',
      }}
    />
    <Bar dataKey="count" fill="#d32f2f" />
  </BarChart>
</ResponsiveContainer>

            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            variant="contained"
            color="warning"
            startIcon={<TipsAndUpdatesIcon />}
            onClick={() => setShowSuggestions(!showSuggestions)}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: 2,
            }}
          >
            {showSuggestions ? 'Hide AI Suggestions' : 'Show AI Suggestions'}
          </Button>
        </Box>

        {showSuggestions && (
          <Card
  sx={{
    mt: 4,
    backgroundColor: darkMode ? '#333' : '#fff8e1',
    borderLeft: '6px solid #ffb300',
    borderRadius: 3,
    color: darkMode ? '#fff' : '#000', // Ensure consistent text color
  }}
>

            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                💡 AI Suggestions
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography>{metadata.suggestions?.replace(/\*/g, '')}</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </ThemeProvider>
  );
}
