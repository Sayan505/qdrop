require('dotenv').config();

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const SRV_PORT = parseInt(process.env.SRV_PORT, 10) || 3000;

const cors = require('cors');


app.prepare().then(() => {
    const server = express();   // set express as server
    
    // connect to the DB
    const connect_db = require('./config/db.config');
    connect_db();

    // set up cors
    const cors_options = {
        origin: process.env.ALLOWED_CLIENTS.split(',')
    };

    server.use(cors(cors_options));

    // Routes:
    server.use('/api/upload', require('./routes/upload.routes'));      // upload api endpoint
    server.use('/file', require('./routes/download_page.routes'));     // download page route
    server.use('/file/download', require('./routes/download.routes')); // download api endpoint


    server.all('*', (req, res) => {
        return handle(req, res);
    });

    // exec:
    server.listen(SRV_PORT, () => {
        console.log(`Listening on port: ${SRV_PORT}`);

    });

}).catch(err => {
    console.log(err);
});
