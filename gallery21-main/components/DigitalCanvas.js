import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useDropzone } from 'react-dropzone';
import styles from '../styles/DigitalCanvas.module.css';

const DigitalCanvas = () => {
  const canvasRef = useRef(null);
  const [pen, setPen] = useState(null);
  const [color, setColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(5);
  const [tool, setTool] = useState(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      setPen(context);

      canvas.width = 800;
      canvas.height = 600;
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const handleMouseDown = (e) => {
    if (!pen) return;

    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    pen.beginPath();
    pen.moveTo(offsetX, offsetY);
  };

  const handleMouseMove = (e) => {
    if (!drawing || !pen) return;

    const { offsetX, offsetY } = e.nativeEvent;
    pen.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    pen.lineWidth = lineWidth;
    pen.lineTo(offsetX, offsetY);
    pen.stroke();
  };

  const handleMouseUp = () => {
    if (!pen) return;
    setDrawing(false);
    pen.closePath();
  };

  const clearCanvas = () => {
    if (!pen) return;
    pen.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas.png';
    link.click();
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
          context.drawImage(img, 0, 0, canvas.width, canvas.height); // Fit the image to canvas dimensions
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
    },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Gallery21</title>
      </Head>
      <Link href="/dashboard" className={styles.backButton}>← Back to Dashboard</Link>
      <div
        className={styles.gridContainer}
        style={{
          backgroundImage: "url('/images/art_purple.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={styles.part1}>
          <div className={styles.objectStyle}>
            <button onClick={() => setTool('draw')} className={styles.imageBtn}>
              <img src="/images/draw.png" alt="draw" className={styles.iconImage} />
            </button>
            <button onClick={() => setTool('line')} className={styles.imageBtn}>
              <img src="/images/line.png" alt="line" className={styles.iconImage} />
            </button>
            <button onClick={() => setTool('rectangle')} className={styles.imageBtn}>
              <img src="/images/rectangle.png" alt="rectangle" className={styles.iconImage} />
            </button>
            <button onClick={() => setTool('circle')} className={styles.imageBtn}>
              <img src="/images/circle.png" alt="circle" className={styles.iconImage} />
            </button>
            <button onClick={() => setTool('eraser')} className={styles.imageBtn}>
              <img src="/images/eraser.png" alt="eraser" className={styles.iconImage} />
            </button>
          </div>
        </div>
        <div className={styles.part3}>
          <div className={styles.drawPageStyle}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseOut={handleMouseUp}
            ></canvas>
          </div>
        </div>
        <div className={styles.part2}>
          {/* Dropzone for Uploading Images */}
          <div {...getRootProps({ className: styles.dropzone })}>
            <input {...getInputProps()} />
            <p>Drop image here</p>
          </div>

          <div className={styles.colorStyle}>
            <h1 className={styles.titleStyle}><i className="fa-solid fa-fill"></i> Fill style</h1>
            <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} className={styles.Colorstyle} />
            <h1 className={styles.titleStyle}><i className="fa-sharp fa-solid fa-border-all"></i> Stroke style</h1>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className={styles.Colorstyle} />
            <h1 className={styles.titleStyle}><i className="fa-solid fa-pen"></i> Line Thickness</h1>
            <input type="range" min="1" max="20" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} className={styles.range} />
            <span>{lineWidth}</span>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <button onClick={clearCanvas} className={styles.canvasButton}>Clear Canvas</button>
          <button onClick={saveCanvas} className={styles.canvasButton}>Save Canvas</button>
        </div>
      </div>
    </div>
  );
};

export default DigitalCanvas;
