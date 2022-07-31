require('dotenv').config();

const router = require('express').Router();

const File = require('../models/file.models');


router.get('/:uuid', async (res, req) => {
    // query db
    try {
        const file = await File.findOne({
            uuid: req.params.uuid
        });

        // if file not found
        if(!file) {
            return res.render('download', { error: '404. File Not Found'});    
        }

        // if file is found, return download uri along with metadata
        return res.render('download', {
            uuid: file.uuid,
            filename: file.filename,
            size: file.size,
            download_link: `${process.env.SRV_HOST_BASE_URL}/file/download/${file.uuid}`
        });
    } catch(err) {
        return res.render('download', { error: 'Error.'});
    }
});


module.exports = router;
