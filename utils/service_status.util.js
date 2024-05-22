import { mongoose_instance } from "../config/mongoose.config.js";


var service_status = {
    database: "offline",
    server: "offline"
};


async function init() {
    /* server wide events */
    
    process.on("server-ready", () => {
        service_status.server = "online";
    });


    /* mongoose events */

    const db = mongoose_instance.connection;

    db.on("connected", () => {
        service_status.database = "online";
    });

    db.on("disconnected", () => {
        service_status.database = "offline";
    });

    db.on("reconnectedFailed", () => {
        service_status.database = "reconnection-error";
    });

    db.on("timeout", () => {
        service_status.database = "connection-timed-out";
    });

    db.on("error", () => {
        service_status.database = "error";
    });
}

export default service_status;
export const   init_status_monitor = init;
