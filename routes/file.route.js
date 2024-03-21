require("dotenv").config();

const express = require("express");

const File = require('../models/file.model');


const router = express.Router();

router.get("/:uuid", async (req, res) => {
    // query db for the requested file by uuid
    const file = await File.findOne({ uuid: req.params.uuid });
    if(!file) {
        return res.status(404).send({
            error: "404: Requested File Does NOT Exist"
        });
    }

    // if the file is found return info about it
    return res.status(200).send({
        filename:                file.og_filename,
        filesize_nbytes:         file.filesize_nbytes,
        upload_timestamp:        file.upload_timestamp,
        last_download_timestamp: file.last_download_timestamp,
        total_download_count:    file.total_download_count,
        download_uri:            `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/api/download/${file.uuid}`
    });
});


module.exports = router;
