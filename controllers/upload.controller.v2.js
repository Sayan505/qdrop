import path from "path";

import upload from "../config/multer.config.js";
import File from "../models/file.model.js";


async function upload_controller(req, res) {
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
            file_expiry_timestamp:   (new Date().setMinutes(new Date().getMinutes() + 30))   // default expiry 30 mins
        });

        // record to db:
        await file.save();

        // return download info
        return res.status(200).send({
            file_url: `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/api/file/${file.uuid}`
        });
    });
}


export default upload_controller;
