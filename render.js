import express from 'express';
const { loop } = require("./scrapeLogic");

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Autovote is running now !")
  loop();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});