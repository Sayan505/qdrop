import File                from "../models/file.model.js";
import delete_file_by_uuid from "../util/delete_file_by_uuid.util.js";


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
        // delete file by uuid
        delete_file_by_uuid(file.uuid);

        // and return file doesn't exist
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
