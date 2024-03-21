require("dotenv").config();

const express = require("express");


const app      = express();
const SRV_PORT = parseInt(process.env.SRV_PORT) || 3000;


// connect to db
require("./config/mongodb.config")();


// define routes
app.use("/api/status", require('./routes/status.route'));       // query service status
app.use("/api/upload", require('./routes/upload.route'));       // upload file to the service
app.use("/api/file", require('./routes/file.route'));           // file query route
app.use("/api/download", require('./routes/download.route'));   // file download route


// start server
app.listen(SRV_PORT, () => {
    console.log(`[server listening on port ${SRV_PORT}]`);
});
