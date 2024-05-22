import fs                  from "fs";
import path                from "path";
import { fileURLToPath }   from "url"

import logger              from "../utils/logger.util.js";
import File                from "../models/file.model.js";


async function delete_file_by_uuid(__uuid) {
    // query db for the requested file by uuid
    const file = await File.findOne({ uuid: __uuid });

    // if file is not found
    if(!file) {
        logger.info(`[file uuid \"${__uuid}\" does not exist]`);
        return;
    }


    const alleged_path = `${path.dirname(fileURLToPath(import.meta.url))}/../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`;

    // attempt to delete file
    if(fs.existsSync(alleged_path)) {
        try {
            fs.unlinkSync(alleged_path);
            await file.deleteOne();
            logger.info(`[file \"${file.uploaded_filename}\" having uuid \"${__uuid}\" cleaned up]`);
        } catch(err) {
            logger.error(`[delete error on file \"${file.uploaded_filename}\" having uuid \"${__uuid}\"]`);
        }
    } else {
        // file doesn't exist on disk. delete this dangling db record
        await file.deleteOne();
        logger.info(`[dangling db record for file \"${file.uploaded_filename}\" having uuid \"${__uuid}\" cleaned up]`);
    }
}


export default delete_file_by_uuid;
