import express from 'express';
import {jsp} from './index.js';
const port = process.env.PORT || 3000

const app = express();

app.get("/", (req, res) => {
  res.send("Autovote is running now !")
  jsp();
});