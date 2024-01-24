const express = require('express');
const app = express();
const port = 3000; // sau alt port la alegere

// Definirea unei rute de bază
app.get('/', (req, res) => {
  res.send('Bun venit pe serverul Express!');
});

// Ascultarea pe portul definit
app.listen(port, () => {
  console.log(`Serverul rulează la adresa http://localhost:${port}`);
});
