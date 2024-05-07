import fs                  from "fs/promises";
import path                from "path";
import { fileURLToPath }   from "url"

import logger   from "../config/pino.config.js";
import File                from "../models/file.model.js";


async function delete_file_by_uuid(_uuid) {
    // query db by uuid and delete the record if found
    const file = await File.findOneAndDelete({ uuid: _uuid });

    // if file is not found
    if(!file) { return; }

    // if file is found, delete it
    fs.unlink(`${path.dirname(fileURLToPath(import.meta.url))}/../${process.env.STORAGE_BASEPATH}/${file.uploaded_filename}`).then(
        () =>  { logger.info(`[expired file \"${file.uploaded_filename}\" cleaned up]`);          },
        err => { logger.info(`[delete error on file \"${file.uploaded_filename}\"]`);  }
    );
}

export default delete_file_by_uuid;
