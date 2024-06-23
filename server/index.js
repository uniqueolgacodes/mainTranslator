// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Log the current directory name for debugging
console.log(__dirname);

// Create an Express app
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use CORS

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

let data = [];

try {
  // Load the JSON file
  const jsonData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8');
  data = JSON.parse(jsonData);
  console.log('Loaded data from JSON:', data); // Debugging line
} catch (error) {
  console.error('Error reading the JSON file:', error);
}

// Create a translation function
const translate = (sourceText, sourceLang, targetLang) => {
  const cleanedSourceText = sourceText.trim().toLowerCase();
  console.log('Searching for:', cleanedSourceText); // Debugging line
  
  const results = data.filter(entry => 
    entry[sourceLang] && entry[sourceLang].toString().toLowerCase().includes(cleanedSourceText)
  );
  
  return results.length > 0 ? results : [{ error: `No translation found for "${sourceText}"` }];
};

// Define the /translate endpoint s
app.post('/translate', (req, res) => {
  const { source_text, source_lang, target_lang } = req.body;
  if (!source_text) {
    return res.status(400).json({ error: 'Source text is required' });
  }
  
  if (!source_lang || !target_lang) {
    return res.status(400).json({ error: 'Source and target languages are required' });
  }
  
  const translation = translate(source_text, source_lang, target_lang);
  res.json({ translated_text: translation });
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
