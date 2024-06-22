import React, { useState } from 'react';
import axios from 'axios';

const TranslateComponent = () => {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = `${corsProxyUrl}https://bd14-34-125-88-65.ngrok-free.app/translate`;

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleTranslate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(apiUrl, {
                source_text: inputText
            });
            setTranslatedText(response.data.translated_text);
        } catch (err) {
            setError('Translation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: '20px' }}>
            <h2>Edo-English Translator</h2>
            <form onSubmit={handleTranslate}>
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Enter text to translate"
                    style={{ padding: '10px', width: '300px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
                    Translate
                </button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {translatedText && (
                <div>
                    <h3>Translation:</h3>
                    <p>{translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default TranslateComponent;
