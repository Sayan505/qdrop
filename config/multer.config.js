require("dotenv").config();

const multer         = require("multer");
const { v4: uuidv4 } = require("uuid");
const path           = require("path");


// ref: https://github.com/expressjs/multer/blob/master/README.md#diskstorage
const multer_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, process.env.STORAGE_BASEPATH);
    },
    filename: function(req, file, cb) {
        const str = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, str);
    }
});     // storage space configured!

// https://github.com/expressjs/multer/blob/master/README.md#singlefieldname
const upload = multer({
    storage: multer_storage,
    limits: { fileSize: 268435456 /* 256 MiB */ },
    fileFilter: function(req, file, cb) {
        var mimetype = path.extname(file.mimetype);
        if(mimetype.includes("executable")) {
            return cb(new Error("restricted file type"));
        }
        cb(null, true);
    }
}).single("target_file");   // upload subroutine primed! (uploads the file in "target_file" multipart field)


module.exports = upload;
