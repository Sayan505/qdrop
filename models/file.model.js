import mongoose from "mongoose";


const Schema = mongoose.Schema;

// ref: https://github.com/Automattic/mongoose/blob/master/README.md#defining-a-model
const file_schema = new Schema({
    uuid                   : { type: String, required: true     },
    upload_timestamp       : { type: Date  , default : Date.now },
    last_download_timestamp: { type: Date  , default : null     },
    total_download_count   : { type: Number, default : 0        },
    og_filename            : { type: String, required: true     },
    uploaded_filename      : { type: String, required: true     },
    filesize_nbytes        : { type: Number, required: true     }
}); // files are stored at "process.env.STORAGE_BASEPATH/uploaded_filename"


export default mongoose.model("File", file_schema, "files");
