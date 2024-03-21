import dotenv from "dotenv";
dotenv.config();

import express    from "express";

import connect_db from "./config/mongodb.config.js";

// import routes
import upload_route   from "./routes/upload.route.js";
import file_route     from "./routes/file.route.js";
import download_route from "./routes/download.route.js";


const app        = express();
const SRV_PORT   = parseInt(process.env.SRV_PORT) || 3000;
const SRV_DOMAIN = process.env.SRV_DOMAIN         || "localhost";


// connect to db
connect_db();


// define routes
//app.use("/api/status",   status_route);      // query service status
app.use("/api/upload",   upload_route);      // upload file to the service
app.use("/api/file",     file_route);        // file query route
app.use("/api/download", download_route);    // file download route


// start server
app.listen(SRV_PORT, SRV_DOMAIN, () => {
    console.log(`[server listening @ ${SRV_DOMAIN}:${SRV_PORT}]`);
});
