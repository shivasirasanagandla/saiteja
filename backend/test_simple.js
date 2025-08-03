const express = require('express');
const app = express();
const PORT = 5000;

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
}); 