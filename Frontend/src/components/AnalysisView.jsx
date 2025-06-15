import React, { useState, useEffect, useRef } from 'react';
import {
  Typography, Card, CardContent, MenuItem, Select, FormControl,
  InputLabel, Box, Grid, Paper, Button, CssBaseline, Switch,
  FormControlLabel, Divider, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const ChartCard = ({ title, data, color, darkMode }) => (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#888' : '#ccc'} />
        <XAxis type="number" stroke={darkMode ? '#fff' : '#000'} />
        <YAxis dataKey="col" type="category" stroke={darkMode ? '#fff' : '#000'} tick={false} />
        <Tooltip contentStyle={{
          backgroundColor: darkMode ? '#333' : '#fff',
          color: darkMode ? '#fff' : '#000'
        }} />
        <Bar dataKey="count" fill={color} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

export default function AnalysisView() {
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState(null);
  const [selectedPage, setSelectedPage] = useState(0);
  const [columnUsage, setColumnUsage] = useState({});
  const [showCharts, setShowCharts] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [openDialogIndex, setOpenDialogIndex] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const data = localStorage.getItem('report_metadata');
    if (data) {
      setMetadata(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleAnalyse = () => {
    if (!metadata) return;
    const usage = {};
    metadata.pages.forEach(page =>
      page.visuals.forEach(v => {
        v.query_fields?.forEach(f => usage[f] = (usage[f] || 0) + 1);
        Object.values(v.projections || {}).flat().forEach(f => usage[f] = (usage[f] || 0) + 1);
      })
    );
    setColumnUsage(usage);
    setShowCharts(!showCharts);
    setTimeout(() => {
      chartRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#7c4dff' },
    },
    typography: { fontFamily: "'Segoe UI', 'Roboto', sans-serif" },
  });

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
  const sorted = Object.entries(columnUsage).sort((a, b) => b[1] - a[1]);
  const mostUsed = sorted.slice(0, 5).map(([col, count]) => ({ col, count }));
  const leastUsed = sorted.slice(-5).map(([col, count]) => ({ col, count }));
  const visualTypes = page.visuals.reduce((acc, visual, idx) => {
    acc[visual.visual_type] = acc[visual.visual_type] || [];
    acc[visual.visual_type].push({ ...visual, index: idx });
    return acc;
  }, {});

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <Box sx={{ width: 280, p: 3, bgcolor: darkMode ? '#121212' : '#f0f0f0', borderRight: '1px solid #ccc' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            📘 Controls
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Page</InputLabel>
            <Select value={selectedPage} onChange={(e) => setSelectedPage(e.target.value)}>
              {metadata.pages.map((p, idx) => (
                <MenuItem key={idx} value={idx}>
                  Page {p.page_number}: {p.page_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label="Dark Mode"
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant={showCharts ? "outlined" : "contained"}
            color="primary"
            sx={{ mb: 2 }}
            onClick={handleAnalyse}
          >
            {showCharts ? "Hide Column Usage" : "Analyse Column Usage"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="warning"
            startIcon={<TipsAndUpdatesIcon />}
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            {showSuggestions ? 'Hide' : 'Show'} AI Suggestions
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }} color="primary">
            📊 Report Analysis Dashboard
          </Typography>

          <Typography variant="h6" gutterBottom>
            Page {page.page_number}: {page.page_name} — {page.visuals.length} Visuals
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {Object.entries(visualTypes).map(([type, visuals], idx) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={idx}>
                <Card
                  sx={{
                    height: 120,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: 3,
                    backgroundColor: darkMode ? '#222' : '#f5f5f5',
                    overflow: 'hidden',
                    p: 1
                  }}
                  onClick={() => setOpenDialogIndex(type)}
                >
                  <Typography variant="body2" fontWeight="bold" noWrap sx={{ maxWidth: '100%' }}>
                    {type}
                  </Typography>
                  <Typography variant="body2">{visuals.length} Visual(s)</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Visual Dialogs */}
          {Object.entries(visualTypes).map(([type, visuals]) => (
            <Dialog
              open={openDialogIndex === type}
              onClose={() => setOpenDialogIndex(null)}
              fullWidth maxWidth="md"
              key={type}
            >
              <DialogTitle>{type} Visuals ({visuals.length})</DialogTitle>
              <DialogContent dividers>
                {visuals.map((v, i) => (
                  <Box key={i} sx={{ mb: 2, px: 2, py: 1, border: '1px solid #ccc', borderRadius: 2, bgcolor: darkMode ? '#1e1e1e' : '#fafafa' }}>
                    <Typography><strong>🔲 Visual {v.visual_number}</strong> — {v.visual_type}</Typography>
                    <Typography>📐 Position: x={v.position.x}, y={v.position.y}, size={v.position.width}x{v.position.height}</Typography>
                    {Object.keys(v.projections).length > 0 && (
                      <Typography sx={{ mt: 1 }}>
                        🎯 <strong>Projections:</strong> {Object.entries(v.projections).map(
                          ([role, fields]) => `${role}: ${fields.join(', ')}`).join(' | ')
                        }
                      </Typography>
                    )}
                    {v.query_fields.length > 0 && (
                      <Typography sx={{ mt: 1 }}>
                        🧮 <strong>Query Fields:</strong> {v.query_fields.join(', ')}
                      </Typography>
                    )}
                  </Box>
                ))}
              </DialogContent>
            </Dialog>
          ))}

          {/* Conditional Charts */}
          {showCharts && (
            <Grid container spacing={4} sx={{ mt: 1 }} ref={chartRef}>
              <Grid item xs={12} md={6}>
                <ChartCard title="📈 Most Used Columns" data={mostUsed} color="#1976d2" darkMode={darkMode} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard title="📉 Least Used Columns" data={leastUsed} color="#d32f2f" darkMode={darkMode} />
              </Grid>
            </Grid>
          )}

          {/* AI Suggestions */}
          {showCharts && showSuggestions && (
            <Card sx={{
              mt: 4,
              bgcolor: darkMode ? '#333' : '#fff8e1',
              borderLeft: '6px solid #ffb300',
              borderRadius: 3,
              color: darkMode ? '#fff' : '#000'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  💡 AI Suggestions
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography>{metadata.suggestions?.replace(/\*/g, '')}</Typography>
              </CardContent>
            </Card>
          )}

          {/* View Layout */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              disabled={page.visuals.length === 0}
              onClick={() => navigate(`/layout/${selectedPage}`)}
              sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 'bold', fontSize: '16px' }}
            >
              View Layout
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
