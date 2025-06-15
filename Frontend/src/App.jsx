import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import AnalysisView from './components/AnalysisView';
import LayoutPage from './components/LayoutPage'; // ⬅️ Import the layout viewer
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PBIX Analyzer
          </Typography>
          <Button color="inherit" component={Link} to="/">Upload</Button>
          <Button color="inherit" component={Link} to="/analysis">Analysis</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/analysis" element={<AnalysisView />} />
        <Route path="/layout/:pageIndex" element={<LayoutPage />} /> {/* ⬅️ New Route */}
      </Routes>
    </Router>
  );
}
