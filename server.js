import dotenv                from "dotenv";
dotenv.config();

import express               from "express";

import db                    from "./config/mongoose.config.js";

import { CronJob }           from "cron";
import cleanup_expired_files from "./tasks/cleanup_expired_files.task.js";

import logger                from "./config/pino.config.js";
import logger_middleware     from "./middleware/logger.middleware.js";

// import routes
import upload_route          from "./routes/upload.route.js";
import upload_route_v2       from "./routes/upload.route.v2.js";
import file_route            from "./routes/file.route.js";




const app        = express();
const SRV_PORT   = parseInt(process.env.SRV_PORT) || 3000;
const SRV_DOMAIN = process.env.SRV_DOMAIN         || "localhost";


// register request logger middleware
app.use(logger_middleware);


// register routes:
//app.use("/api/status",    status_route);      // query service status
app.use("/api/v1/upload", upload_route);      // upload file to the service (v1)
app.use("/api/v2/upload", upload_route_v2);   // upload file to the service (v2)
app.use("/api/upload",    upload_route_v2);   // upload file to the service (latest v2)
app.use("/api/file",      file_route);        // file query and /download route


// connect to db
db.connect_db().then(() => {
    cleanup_expired_files().then(() => {
        // then start server
        const server = app.listen(SRV_PORT, SRV_DOMAIN, () => {
            logger.info(`[server listening @ ${SRV_DOMAIN}:${SRV_PORT}]`);
        });

        // schedule cleanup every sunday midnight
        const cleanup_task = CronJob.from({
            cronTime: "0 0 0 * * 0",
            onTick: function () {
                cleanup_expired_files();
            },
            start: true
        });

        
        // register events for graceful shutdown
        for(let sig of ["SIGINT", "SIGTERM"]) {
            process.on(sig, () => {
                logger.info(`[${sig}: shutting down]`);
                
                // stop accepting new reqs
                server.close(() => {
                    logger.info("[server stopped accepting new requests]");

                    cleanup_task.stop();
                    logger.info("[stopped scheduled cleanup task]");
            
                    // then disconnect db
                    db.disconnect_db().then(() => {
                        logger.info("[===server closed===]");
                        
                        // then exit the node process
                        process.exit();
                    });
                });
            });
        }
    });
});
