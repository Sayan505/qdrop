import fs                  from "fs";
import path                from "path";
import { fileURLToPath }   from "url"

import logger              from "../config/pino.config.js";

import File                from "../models/file.model.js";


async function file_controller(req, res) {
    // query db for the requested file by uuid
    const file = await File.findOne({ uuid: req.params.uuid });
    
    // if file is not found
    if(!file) {
        return res.status(404).send({
            error: "404: Requested File Does NOT Exist"
        });
    }

    // if the file is found and is expired
    if(Date.now() >= file.file_expiry_timestamp) {
        const alleged_path = `${path.dirname(fileURLToPath(import.meta.url))}/../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`;

        // attempt to delete file
        if(fs.existsSync(alleged_path)) {
            fs.promises.unlink(alleged_path).then(
                () =>  {
                    // delete db record only if file deletion succeeds
                    file.deleteOne().then(
                        logger.info(`[expired file \"${file.uploaded_filename}\" cleaned up]`)
                    );
                },
                err => { logger.info(`[delete error on file \"${file.uploaded_filename}\"]`); }
            );
        } else {
            // file doesn't exist on disk. delete this dangling db record
            file.deleteOne().then(
                logger.info(`[dangling db record for expired file \"${file.uploaded_filename}\" cleaned up]`)
            );
        }

        // and return file doesn't exist (don't allow download of expired files)
        return res.status(404).send({
            error: "404: Requested File Does NOT Exist"
        });
    }

    // else return info about it
    return res.status(200).send({
        filename:                file.og_filename,
        filesize_nbytes:         file.filesize_nbytes,
        upload_timestamp:        file.upload_timestamp,
        last_download_timestamp: file.last_download_timestamp,
        total_download_count:    file.total_download_count,
        download_uri:            `${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/api/file/download/${file.uuid}`
    });
}


export default file_controller;
