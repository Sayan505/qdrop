require("dotenv").config();

const express = require("express");


const app  = express();
const SRV_PORT = parseInt(process.env.SRV_PORT) || 3000;

require("./db/db.config")()

app.get("/api/ping", (req, res) => {
  res.send("Hello World!");
});


app.listen(SRV_PORT, () => {
  console.log(`[server listening on port ${SRV_PORT}]`);
});
