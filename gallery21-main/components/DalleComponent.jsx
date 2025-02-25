import React, { useState, useRef } from 'react';
import styles from '../styles/DalleComponent.module.css';

const DalleComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const imageRef = useRef(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.imageUrl);
        imageRef.current?.focus();  // Focus on the image container once it's loaded
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dalleComponent}>
      <h2>Generate artwork with Gallery21</h2>
      <input
        type="text"
        placeholder="Enter your text prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className={styles.promptInput}
      />
      <button onClick={handleGenerate} className={styles.generateButton} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {imageUrl && (
        <div className={styles.imageContainer} tabIndex="-1" ref={imageRef}>
          <div className={styles.dialogBox}>
            <img src={imageUrl} alt={`Generated artwork based on the prompt: ${prompt}`} className={styles.generatedImage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DalleComponent;
