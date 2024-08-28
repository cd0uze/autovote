import express from 'express';
import {voteloop} from './index.js';
const port = 3000

const app = express();

app.get("/", (req, res) => {
  res.send("Autovote is running now !")
  voteloop();
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
});