export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests are allowed' });
    }
  
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
  
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DALLE_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: '1024x1024',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
  
      const data = await response.json();
      const imageUrl = data.data[0].url;
  
      return res.status(200).json({ imageUrl });
    } catch (error) {
      console.error('Error generating image:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  