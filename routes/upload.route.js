require("dotenv").config();

const path    = require("path");
const express = require("express");

const upload = require("../config/multer.config.js");
const File   = require('../models/file.model');


const router = express.Router();

router.post("/", async (req, res) => {
    upload(req, res, async (err) => {
        if(err) {
            return res.status(500).send({
                error: "500: Internal Server Error"
            });
        }

        // craft db  record:
        const file = new File({
            uuid:                    path.parse(req.file.filename).name,
            upload_timestamp:        Date.now(),
            last_download_timestamp: null,
            total_download_count:    0,
            og_filename:             req.file.originalname,
            uploaded_filename:       req.file.filename,
            filesize_nbytes:         req.file.size,
        });

        // record to db:
        await file.save();

        // return download info
        return res.status(200).send({
            file: `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/api/file/${file.uuid}`
        });
    });
});


module.exports = router;
