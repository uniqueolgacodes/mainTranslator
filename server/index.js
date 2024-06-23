
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const xlsx = require('xlsx'); 


console.log(__dirname);


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

//  translation function
const translate = async (sourceText, sourceLang, targetLang) => {
  const cleanedSourceText = sourceText.trim().toLowerCase();
  console.log('Sending request to external API with:', cleanedSourceText); 

  try {
    const response = await axios.post('https://bd14-34-125-88-65.ngrok-free.app/translate', {
      source_text: cleanedSourceText,
      source_lang: sourceLang,
      target_lang: targetLang
    }, {
      responseType: 'arraybuffer' 
    });

    console.log('Received response from external API:', response); 

    
    const workbook = xlsx.read(response.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    console.log('Parsed XLSX to JSON:', jsonData); 
    return jsonData.length > 0 ? jsonData : [{ error: `No translation found for "${sourceText}"` }];
  } catch (error) {
    console.error('Error while getting translation from external API:', error);
    if (error.response) {
      console.error('API response data:', error.response.data);
      console.error('API response status:', error.response.status);
      console.error('API response headers:', error.response.headers);
    }
    return [{ error: 'Failed to get translation from external API.' }];
  }
};

// Define the /translate endpoint
app.post('/translate', async (req, res) => {
  const { source_text, source_lang, target_lang } = req.body;
  if (!source_text) {
    return res.status(400).json({ error: 'Source text is required' });
  }
  
  if (!source_lang || !target_lang) {
    return res.status(400).json({ error: 'Source and target languages are required' });
  }
  
  const translation = await translate(source_text, source_lang, target_lang);
  res.json({ translated_text: translation });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
