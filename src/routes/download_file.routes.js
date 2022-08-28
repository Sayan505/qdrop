const router = require('express').Router();
const File = require('../models/file.models');


router.get('/:uuid', async (req, res) => {
    // query for the target file
    const file = await File.findOne({ uuid: req.params.uuid });

    // if file is not found
    if(!file) {
        return res.render('/download', { error: '404. File Not Found'});
    }

    // if file is found
    const response = await file.save();
    const path = `${__dirname}/../${file.path}`;
    res.download(path, file.og_filename);
});


module.exports = router;
