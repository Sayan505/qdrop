import mongoose from "mongoose";

import logger   from "../config/pino.config.js";


// ref: https://mongoosejs.com/docs/connections.html#options
// ref: https://mongoosejs.com/docs/connections.html#callback
function connect_db() {
    logger.info("[trying to connect to db ...]");

    return mongoose.connect(process.env.MONGO_CONN_URI, { dbName: "qdrop" }).then(
        () =>  { logger.info("[connected to db: \"qdrop\"]"); },
        err => { logger.info(`[DB ERROR: ${err}]`);           }
    );
}

// ref: https://mongoosejs.com/docs/api/connection.html#Connection.prototype.close()
function disconnect_db() {    
    return mongoose.connection.close().then(
        () => { logger.info("[db disconnected]");   },
        err => { logger.info(`[DB ERROR: ${err}]`); }  
    );
}


export default { connect_db, disconnect_db };
export const     mongoose_instance = mongoose;
