const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const serverSecret = 'secret'
const { db } = require('./firebase/firebase.js')

app.use(express.urlencoded({ extended: false }))
app.use(express.json()) //we expect JSON data to be sent as payloads
app.use(cors())

const logger = require('morgan'); //importing a HTTP logger

app.use(logger('dev')); //using the HTTP logger library

// Definirea unei rute de bază
app.get('/', (req, res) => {
  res.send('Bun venit pe serverul Express!');
});

// Ascultarea pe portul definit
app.listen(port, () => {
  console.log(`Serverul rulează la adresa http://localhost:${port}`);
});
