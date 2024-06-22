// src/Translate.js

import React, { useState } from 'react';
import axios from 'axios';
import './Translate.css'; // Import the CSS file

const Translate = () => {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('Edo');
  const [targetLang, setTargetLang] = useState('English');
  const [translatedText, setTranslatedText] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSourceText(e.target.value);
  };

  const handleLangChange = (e) => {
    if (e.target.name === 'sourceLang') {
      setSourceLang(e.target.value);
    } else {
      setTargetLang(e.target.value);
    }
  };

  const handleTranslate = async () => {
    try {
      setError(''); // Reset error message
      console.log('Sending request to server with source text:', sourceText); // Debugging line
      const response = await axios.post('http://localhost:10000/translate', {
        source_text: sourceText,
        source_lang: sourceLang,
        target_lang: targetLang,
      });
      console.log('Response from server:', response.data); // Debugging line
      if (response.data.translated_text[0].error) {
        setError(response.data.translated_text[0].error);
        setTranslatedText([]);
      } else {
        setTranslatedText(response.data.translated_text);
        setError('');
      }
    } catch (err) {
      console.error('Error while getting translation:', err.response ? err.response.data : err.message); // Debugging line
      setError('Failed to get translation. Please try again.');
      setTranslatedText([]);
    }
  };

  return (
    <div className="translate-container">
      <h1>Translator</h1>
      <textarea
        value={sourceText}
        onChange={handleInputChange}
        placeholder={`Enter text in ${sourceLang}...`}
      />
      <div>
        <label>
          Source Language:
          <select name="sourceLang" value={sourceLang} onChange={handleLangChange}>
            <option value="Edo">Edo</option>
            <option value="English">English</option>
          </select>
        </label>
        <label>
          Target Language:
          <select name="targetLang" value={targetLang} onChange={handleLangChange}>
            <option value="Edo">Edo</option>
            <option value="English">English</option>
          </select>
        </label>
      </div>
      <button onClick={handleTranslate}>Translate</button>
      {translatedText.length > 0 && (
        <div className="translation-result">
          <h2>Translation:</h2>
          {translatedText.map((entry, index) => (
            <div className="translation-result-item" key={index}>
              {Object.entries(entry).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
            </div>
          ))}
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Translate;
