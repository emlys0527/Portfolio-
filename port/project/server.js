const express = require('express');
const path = require('path');
const mime = require('mime-types');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the latelierpaon.com directory
app.use(express.static(path.join(__dirname, 'latelierpaon.com'), {
  setHeaders: (res, filePath) => {
    // Set proper MIME types
    const mimeType = mime.lookup(filePath);
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
    
    // Handle JavaScript files specifically
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    
    // Handle SVG files
    if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
    
    // Handle font files
    if (filePath.endsWith('.woff') || filePath.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff');
    }
  }
}));

// Handle SPA routing - serve index.html for all routes that don't match static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'latelierpaon.com', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 L'Atelier Paon preview server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'latelierpaon.com')}`);
});