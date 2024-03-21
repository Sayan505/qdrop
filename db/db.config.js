require("dotenv").config();

const mongoose = require("mongoose");


function connect_db() {
    mongoose.connect(process.env.MONGO_DB_URI, { dbName: "qdrop" }).then(
        () => { console.log("[connected to db: \"qdrop\"]"); },
        err => { console.log(`[${err}]`); }
    );
}


module.exports = connect_db;
