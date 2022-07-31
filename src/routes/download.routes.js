const router = require('express').Router();
const File = require('../models/file.models');


router.get('/:uuid', async (req, res) => {
    // query for the target file
    const file = await File.findOne({ uuid: req.params.uuid });

    // if file is not found
    if(!file) {
        return res.render('', { error: 'Invalid File.' });
    }

    // if file is found
    const path = `${__dirname}/../${file.path}`;
    res.download(path);
});


module.exports = router;
