import express from 'express';
import {jsp} from './index.js';

const app = express();

app.get("/", (req, res) => {
  res.send("Autovote is running now !")
  jsp();
});