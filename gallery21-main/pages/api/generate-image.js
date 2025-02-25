// pages/api/generate-image.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
        {
          inputs: prompt,
        },
        {
          headers: {
            Authorization: `Bearer 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`, // Use your Hugging Face API Key
            'Content-Type': 'application/json',
          },
        }
      );

      const image = response.data[0]; // Assuming the API returns a URL or base64 image
      res.status(200).json({ imageUrl: image });
    } catch (error) {
      console.error('Error generating image:', error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
