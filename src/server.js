require('dotenv').config();

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

const SRV_PORT = parseInt(process.env.SRV_PORT, 10) || 3000;

const cors = require('cors');

const body_parser = require('body-parser');


// export 'app' before setting routes
module.exports = app;

// set routes
const upload_route = require('./routes/upload.routes');                 // upload api endpoint
const download_page_route = require('./routes/download_page.routes');   // download page route
const download_file_route = require('./routes/download_file.routes');   // download api endpoint


app.prepare().then(() => {
    const server = express();   // set express as server


    // connect to the DB:
    const connect_db = require('./config/db.config');

    connect_db();


    // set up cors:
    const cors_options = {
        origin: process.env.ALLOWED_CLIENT
    };

    server.use(cors(cors_options));


    server.use(body_parser.json()); // body-parser


    server.use(express.urlencoded({ extended: true }));


    // routes:
    //server.use('/', index_route);
    server.use('/api/upload', upload_route);      // upload api endpoint
    server.use('/file', download_page_route);     // download page route
    server.use('/file/download', download_file_route); // download api endpoint


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
