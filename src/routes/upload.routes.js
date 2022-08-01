require('dotenv').config();

const path = require('path');

const router = require('express').Router();

const multer = require('multer');

const { v4: uuidv4 } = require('uuid');


const File = require('../models/file.models');


// config multer:

let storage_path = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '../STORAGE/'),
    filename: (req, file, cb)    => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// 200MiB max
let upload = multer({
    storage: storage_path,
    limits: { fileSize: 209715200 },
}).single('target_file');


// config endpoints:

router.post('/', (req, res) => {
    // receive file
    upload(req, res, async (err) => {
        // verify req:
        if(err) {
            return res.status(500).send({
                error: err.message
            });
        }

        // record into db:

        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });

        const response = await file.save();

        // return file download page link
        return res.json({
            file: `${process.env.SRV_HOST_BASE_URL}/file/${response.uuid}`
        });
    });
});


module.exports = router;
