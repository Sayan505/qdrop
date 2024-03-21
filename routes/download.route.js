require("dotenv").config();

const express = require("express");

const File = require('../models/file.model');


const router = express.Router();

router.get("/:uuid", async (req, res) => {
    // query db for the requested file by uuid
    // if the file is found
    // update its last_download_timestamp
    // increment its total_download_count
    const file = await File.findOneAndUpdate({ uuid: req.params.uuid }, { $inc: { total_download_count: 1 }, last_download_timestamp: Date.now() });
    if(!file) {
        return res.status(404).send({
            error: "404: Requested File Does NOT Exist"
        });
    }

    // then, invoke a file download
    res.status(200).download(`${__dirname}../../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`, file.og_filename);
});


module.exports = router;
