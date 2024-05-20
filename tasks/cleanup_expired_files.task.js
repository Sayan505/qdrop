import fs                  from "fs";
import path                from "path";
import { fileURLToPath }   from "url"

import logger              from "../config/pino.config.js";
import File                from "../models/file.model.js";


async function cleanup_expired_files(_uuid) {
    logger.info("[running cleanup subroutine]");


    var delete_count = 0;
    for await (const file of File.find()) {
        // if the file is expired
        if(Date.now() >= file.file_expiry_timestamp) {
            const alleged_path = `${path.dirname(fileURLToPath(import.meta.url))}/../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`;

            // attempt to delete file
            if(fs.existsSync(alleged_path)) {
                fs.promises.unlink(alleged_path).then(
                    () =>  {
                        // delete db record only if file deletion succeeds
                        file.deleteOne().then(() => {
                            ++delete_count;

                            logger.info(`[expired file \"${file.uploaded_filename}\" cleaned up]`);
                        });
                    },
                    err => { logger.error(`[delete error on file \"${file.uploaded_filename}\"]`); }
                );
            } else {
                // file doesn't exist on disk. delete this dangling db record
                file.deleteOne().then(() => {
                    ++delete_count;

                    logger.info(`[dangling db record for expired file \"${file.uploaded_filename}\" cleaned up]`)
                });
            }
        }
    }
    
    
    logger.info(`[cleanup subroutine over: deleted ${delete_count} objects this time.]`);
}


export default cleanup_expired_files;
