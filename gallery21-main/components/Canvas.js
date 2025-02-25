import React, { useRef, useEffect, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#ff0000');
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 800;

    const startDrawing = (e) => {
      setDrawing(true);
      draw(e);
    };

    const stopDrawing = () => {
      setDrawing(false);
      context.beginPath();
    };

    const draw = (e) => {
      if (!drawing) return;

      context.lineWidth = 5;
      context.lineCap = 'round';
      context.strokeStyle = color;

      context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      context.stroke();
      context.beginPath();
      context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mousemove', draw);
    };
  }, [color, drawing]);

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas.png';
    link.click();
  };

  return (
    <div>
      <div>
        <input type="color" onChange={(e) => setColor(e.target.value)} value={color} />
        <button onClick={saveCanvas}>Save Canvas</button>
      </div>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
    </div>
  );
};

export default Canvas;
