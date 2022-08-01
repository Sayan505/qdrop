require('dotenv').config();
const mongoose = require('mongoose');


function connect_db() {
    mongoose.connect(process.env.MONGO_CONN_STR);

    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Connected to the DB');
    })

}


module.exports = connect_db;
