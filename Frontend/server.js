import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Serve static files from dist folder (Vite build output)
 */
app.use(express.static(join(__dirname, 'dist')));

/**
 * SPA Route Handler
 * Redirect all routes to index.html so React Router can handle them
 * This fixes the "404 Not Found" issue on direct route access
 */
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

/**
 * Error handling
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on http://localhost:${PORT}`);
  console.log(`📁 Serving from: ${join(__dirname, 'dist')}`);
});