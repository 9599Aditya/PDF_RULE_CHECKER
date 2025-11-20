// Simple Express server for PDF extraction and rule checking
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const fs = require('fs');
require('dotenv').config();

const checkRouter = require('./routes/check');
const app = express();
app.use(express.json());

// File uploads to ./uploads
const upload = multer({ dest: path.join(__dirname, 'uploads/') });
app.use(cors());

// Single endpoint that accepts either a browser-uploaded PDF or a serverFilePath
app.post('/api/check', upload.single('pdf'), async (req, res) => {
  try {
    // If client uploaded a file, use it; else they can pass serverFilePath
    const serverFilePath = req.body.serverFilePath;
    const filePath = serverFilePath || (req.file && req.file.path);
    if (!filePath) return res.status(400).json({ error: 'No PDF provided' });

    const rules = JSON.parse(req.body.rules || '[]');
    const results = await checkRouter.checkPdfWithRules(filePath, rules);
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Simple health endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
