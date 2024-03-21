require("dotenv").config();

const mongoose = require("mongoose");


// ref: https://mongoosejs.com/docs/connections.html#options
// ref: https://mongoosejs.com/docs/connections.html#callback
function connect_db() {
    mongoose.connect(process.env.MONGO_CONN_URI, { dbName: "qdrop" }).then(
        () => { console.log("[connected to db: \"qdrop\"]"); },
        err => { console.log(`[${err}]`); }
    );
}


module.exports = connect_db;
