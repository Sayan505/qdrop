import path         from "path";

import logger       from "../config/pino.config.js";

import upload       from "../config/multer.config.js";
import File         from "../models/file.model.js";


async function upload_controller(req, res) {
    upload(req, res, async (err) => {
        if(err) {
            return res.status(500).send({
                error: "500: Internal Server Error"
            });
        }

        var calculated_expiry_timestamp = (new Date().setMinutes(new Date().getMinutes() + 30));    // default expiry 30 mins
        
        // available expiry modes: "5mins", "30mins", "1hrs", "2hrs", "5hrs", "12hrs", "24hrs"/"1day", "2days" and "7days", else default
        switch(req.body.expire_in) {
            case "__testcase_0sec__":
                if(process.env.NODE_ENV === "test") {
                    calculated_expiry_timestamp = Date.now();
                    break;
                } else { break; }
            case "5mins":
                calculated_expiry_timestamp = (new Date().setMinutes(new Date().getMinutes() + 5));
                break;
            case "30mins":
                calculated_expiry_timestamp = (new Date().setMinutes(new Date().getMinutes() + 30));
                break;
            case "1hrs":
                calculated_expiry_timestamp = (new Date().setHours(new Date().getHours()     + 1));
                break;
            case "2hrs":
                calculated_expiry_timestamp = (new Date().setHours(new Date().getHours()     + 2));
                break;
            case "5hrs":
                calculated_expiry_timestamp = (new Date().setHours(new Date().getHours()     + 5));
                break;
            case "12hrs":
                calculated_expiry_timestamp = (new Date().setHours(new Date().getHours()     + 12));
                break;
            case "24hrs":  // fallthrough
            case "1day":
                calculated_expiry_timestamp = (new Date().setDate(new Date().getDate()       + 1));
                break;
            case "2days":
                calculated_expiry_timestamp = (new Date().setDate(new Date().getDate()       + 2));
                break;
            case "7days":
                calculated_expiry_timestamp = (new Date().setDate(new Date().getDate()       + 7));
                break;
            default: break;
        }

        // craft db  record
        const file = new File({
            uuid:                    path.parse(req.file.filename).name,
            upload_timestamp:        Date.now(),
            last_download_timestamp: null,
            total_download_count:    0,
            og_filename:             req.file.originalname,
            uploaded_filename:       req.file.filename,
            filesize_nbytes:         req.file.size,
            file_expiry_timestamp:   calculated_expiry_timestamp
        });

        // record to db
        await file.save();
        
        logger.info(`[file \"${file.og_filename}\" uploaded as \"${file.uploaded_filename}\"]`);
        
        // return download info
        return res.status(200).send({
            file_url: `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/api/file/${file.uuid}`
        });
    });
}


export default upload_controller;
