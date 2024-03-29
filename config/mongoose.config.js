import mongoose from "mongoose";

import logger from "../config/pino.config.js";


// ref: https://mongoosejs.com/docs/connections.html#options
// ref: https://mongoosejs.com/docs/connections.html#callback
function connect_db() {
    mongoose.connect(process.env.MONGO_CONN_URI, { dbName: "qdrop" }).then(
        () =>  { logger.info("[connected to db: \"qdrop\"]"); },
        err => { logger.info(`[DB ERROR: ${err}]`);           }
    );
}


export default connect_db;
