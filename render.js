import express from 'express';
import {jsp} from './index.js';

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Autovote is running now !")
  jsp();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});