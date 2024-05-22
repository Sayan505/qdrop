import fs                  from "fs";
import path                from "path";
import { fileURLToPath }   from "url"

import logger              from "../utils/logger.util.js";
import File                from "../models/file.model.js";


async function cleanup_expired_files() {
    process.emit("cleanup-ongoing");

    logger.info("[running cleanup subroutine]");


    var expired_objects_count  = 0;
    var successful_purge_count = 0;
    for await (const file of File.find()) {
        // if the file is expired
        if(Date.now() >= file.file_expiry_timestamp) {
            ++expired_objects_count;

            const alleged_path = `${path.dirname(fileURLToPath(import.meta.url))}/../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`;

            // attempt to delete file
            if(fs.existsSync(alleged_path)) {
                try {
                    fs.unlinkSync(alleged_path);
                    await file.deleteOne();

                    ++successful_purge_count;
                    logger.info(`[expired file \"${file.uploaded_filename}\" cleaned up]`);
                } catch(err) {
                    logger.error(`[delete error on expired file \"${file.uploaded_filename}\"]`);
                }
            } else {
                // file doesn't exist on disk. delete this dangling db record
                await file.deleteOne();

                ++successful_purge_count;
                logger.info(`[dangling db record for expired file \"${file.uploaded_filename}\" cleaned up]`);
            }
        }
    }
    
    
    logger.info(`[cleanup subroutine purged ${expired_objects_count}/${successful_purge_count} objects this time.]`);

    process.emit("cleanup-ended");


    if(process.env.NODE_ENV === "test") {
        // await for this in tests
        return { expired_objects_count, successful_purge_count };
    }
}


export default cleanup_expired_files;
