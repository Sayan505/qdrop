import fs                  from "fs/promises";
import path                from "path";
import { fileURLToPath }   from "url"

import logger              from "../config/pino.config.js";
import File                from "../models/file.model.js";


async function delete_file_by_uuid(_uuid) {
    // query db by uuid and delete the record if found
    const file = await File.findOne({ uuid: _uuid });

    // if file is not found
    if(!file) { return; }

    // if file is found, delete it
    fs.unlink(`${path.dirname(fileURLToPath(import.meta.url))}/../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`).then(
        () =>  {
            // delete db record only if file deletion succeeds
            file.deleteOne().then(
                logger.info(`[expired file \"${file.uploaded_filename}\" cleaned up]`)
            );
        },
        err => { logger.error(`[delete error on file \"${file.uploaded_filename}\"]`); }
    );
}


export default delete_file_by_uuid;
