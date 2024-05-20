import multer           from "multer";
import { v4 as uuidv4 } from "uuid";
import path             from "path";


// ref: https://github.com/expressjs/multer/blob/master/README.md#diskstorage
const multer_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, process.env.STORAGE_BASEPATH);
    },
    filename: function(req, file, cb) {
        var   str = Buffer.from(`${uuidv4()}`).toString("base64url");
        
        const l   = Math.random() * (parseInt(str.length / 2) - 5);
        const r   = Math.random() * (parseInt(str.length) - l + 5) + l + 5;
        
        str       = str.slice(l, r) + path.extname(file.originalname);

        cb(null, str);
    }
});  // storage space configured

// ref: https://github.com/expressjs/multer/blob/master/README.md#singlefieldname
const upload = multer({
    storage: multer_storage,
    limits: { fileSize: 536870912 /* 512 MiB */ },
    fileFilter: function(req, file, cb) {
        var mimetype = path.extname(file.mimetype);
        if(mimetype.includes("executable")) {
            return cb(new Error("restricted file type"));
        }
        cb(null, true);
    }
}).single("target_file");    // upload subroutine primed (uploads the file in "target_file" multipart field)


export default upload;
