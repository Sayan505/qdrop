import fs                  from "fs";
import path                from "path";
import { fileURLToPath }   from "url"

import logger              from "../config/pino.config.js";

import File                from "../models/file.model.js";


async function download_controller(req, res) {
    // query db for the requested file by uuid
    // if the file is found
    // update its last_download_timestamp
    // increment its total_download_count
    const file = await File.findOneAndUpdate({ uuid: req.params.uuid }, { $inc: { total_download_count: 1 }, last_download_timestamp: Date.now() });


    // if file is not found
    if(!file) {
        return res.status(404).send({
            error: "404: Requested File Does NOT Exist"
        });
    }


    const alleged_path = `${path.dirname(fileURLToPath(import.meta.url))}/../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`;


    // if the file is found and is expired
    if(Date.now() >= file.file_expiry_timestamp) {
        // attempt to delete file
        if(fs.existsSync(alleged_path)) {
            fs.promises.unlink(alleged_path).then(
                () =>  {
                    // delete db record only if file deletion succeeds
                    file.deleteOne().then(
                        logger.info(`[expired file \"${file.uploaded_filename}\" cleaned up]`)
                    );
                },
                err => { logger.error(`[delete error on file \"${file.uploaded_filename}\"]`); }
            );
        } else {
            // file doesn't exist on disk. delete this dangling db record
            file.deleteOne().then(
                logger.info(`[dangling db record for expired file \"${file.uploaded_filename}\" cleaned up]`)
            );
        }

        // and return file doesn't exist
        return res.status(404).send({
            error: "404: Requested File Does NOT Exist"
        });
    }

    // else, invoke a file download
    res.status(200).download(alleged_path, file.og_filename, (err) => {
        if(err) {
            return res.status(500).send({
                error: "500: Internal Server Error"
            });
        }

        logger.info(`[download invoke of file \"${file.uploaded_filename}\"]`);
    });
}


export default download_controller;
