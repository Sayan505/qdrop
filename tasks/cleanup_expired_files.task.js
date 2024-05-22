import fs                  from "fs";
import path                from "path";
import { fileURLToPath }   from "url"

import logger              from "../utils/logger.util.js";
import File                from "../models/file.model.js";


async function cleanup_expired_files() {
    logger.info("[running cleanup subroutine]");


    var expired_files_count = 0;
    for await (const file of File.find()) {
        // if the file is expired
        if(Date.now() >= file.file_expiry_timestamp) {
            ++expired_files_count;

            const alleged_path = `${path.dirname(fileURLToPath(import.meta.url))}/../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`;

            // attempt to delete file
            if(fs.existsSync(alleged_path)) {
                try {
                    fs.unlinkSync(alleged_path);
                    await file.deleteOne();
                    logger.info(`[expired file \"${file.uploaded_filename}\" cleaned up]`);
                } catch(err) {
                    logger.error(`[delete error on expired file \"${file.uploaded_filename}\"]`);
                }
            } else {
                // file doesn't exist on disk. delete this dangling db record
                await file.deleteOne();
                logger.info(`[dangling db record for expired file \"${file.uploaded_filename}\" cleaned up]`);
            }
        }
    }
    
    
    logger.info(`[cleanup subroutine invoked cleanup for ${expired_files_count} objects this time.]`);


    if(process.env.NODE_ENV === "test") {
        return expired_files_count;    // await for this in tests
    }
}


export default cleanup_expired_files;
