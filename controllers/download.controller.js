import path from "path";
import { fileURLToPath } from "url"

import File from "../models/file.model.js";


async function download_controller(req, res) {
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
    res.status(200).download(`${path.dirname(fileURLToPath(import.meta.url))}../../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`, file.og_filename, (err) => {
        if(err) {
            return res.status(500).send({
                error: "500: Internal Server Error"
            });
        }
    });
}


export default download_controller;
