const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KVARON_X</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #000;
          color: #fff;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          flex-direction: column;
          gap: 16px;
        }
        h1 {
          font-size: 48px;
          letter-spacing: 8px;
          font-weight: 900;
        }
        p {
          color: #444;
          font-size: 14px;
          letter-spacing: 3px;
        }
        .dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #fff;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      </style>
    </head>
    <body>
      <h1>KVARON_X</h1>
      <div class="dot"></div>
      <p>PLATFORM IS LOADING — KRX</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(\`KVARON_X running on port \${PORT}\`);
});
