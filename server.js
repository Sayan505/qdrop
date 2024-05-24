import dotenv                  from "dotenv";
dotenv.config();

import express                 from "express";

import db                      from "./config/mongoose.config.js";

import { CronJob }             from "cron";
import cleanup_expired_files   from "./tasks/cleanup_expired_files.task.js";

import cors                    from "cors";
import logger                  from "./utils/logger.util.js";
import logger_middleware       from "./middleware/logger.middleware.js";

import { init_status_monitor } from "./utils/service_status.util.js";

// import routes
import status_route            from "./routes/status.route.js";
import upload_route            from "./routes/upload.route.js";
import upload_route_v2         from "./routes/upload.route.v2.js";
import file_route              from "./routes/file.route.js";




init_status_monitor();

const app        = express();
const SRV_PORT   = parseInt(process.env.SRV_PORT) || 3000;
const SRV_DOMAIN = process.env.SRV_DOMAIN         || "localhost";


// register CORS middleware
app.use(cors());

// register request logger middleware
app.use(logger_middleware);


// register routes:
app.use("/api/status",    status_route);      // query service status
app.use("/api/v1/upload", upload_route);      // upload file to the service (v1)
app.use("/api/v2/upload", upload_route_v2);   // upload file to the service (v2)
app.use("/api/upload",    upload_route_v2);   // upload file to the service (latest v2)
app.use("/api/file",      file_route);        // file query and /download route




function init_server() {
    return app.listen(SRV_PORT, () => {
        process.emit("server-ready");
        logger.info(`[server listening @ port ${SRV_PORT}]`);
    });
}

function rig_cleanup_task() {
    return CronJob.from({
        cronTime: "0 0 0 * * 0",  // schedule cleanup every sunday midnight
        onTick: function () {
            cleanup_expired_files();
        },
        start: true
    });
}

function graceful_shutdown(server, cleanup_task, db) {
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
            //process.exit();
        });
    });
}


// connect to db
db.connect_db().then(() => {
    cleanup_expired_files().then(() => {
        // then start server
        const server = init_server();
        
        // schedule automatic cleanups
        const cleanup_task = rig_cleanup_task();
        
        // register event listeners for graceful shutdown
        for(let sig of ["SIGINT", "SIGTERM", "graceful-shutdown"]) {
            process.on(sig, () => {
                graceful_shutdown(server, cleanup_task, db);
            });
        }
    });
});




// test candidate(s) set for export
export let tests = {
    app
};

if(process.env.NODE_ENV !== "test") {
    tests = undefined;  // make the exports undefined if not in a "test" env.
};
