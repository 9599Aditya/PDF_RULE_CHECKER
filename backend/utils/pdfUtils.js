const fs = require('fs');
const pdf = require('pdf-parse');

async function extractTextFromPdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return (data.text || '').replace(/\s+/g, ' ').trim();
}

module.exports = { extractTextFromPdf };
