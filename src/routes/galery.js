const { Router } = require('express');

const path = require('path');

const router = Router();

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dznlgyace',
  api_key: '963437351462539',
  api_secret: 'b8xLUpJh_61edY75PvA-xFtsyO8'
});

const fs = require('fs-extra');

// Models
const Image = require('../models/Image');

router.get('/galery', async (req, res) => {
    const images = await Image.find({}).lean();
    res.render('galerys/all-galery', { images });
});

router.get('/galery/upload', (req, res) => {
    res.render('galerys/upload');
});

router.post('/galery/upload', async (req, res) => {

    const result = await cloudinary.v2.uploader.upload(req.file.path);

    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = result.public_id;
    image.path = result.url;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;

    await image.save();
    await fs.unlink(req.file.path);

    res.redirect('/galery');
});

router.get('/galery/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id).lean();
    res.render('galerys/profile', { image });
});

router.get('/galery/image/:id/delete', async (req, res) => {
    const { id } = req.params;
    
    const imageDeleted = await Image.findByIdAndDelete(id);
    //const filenamedelete = await Image.findById(id).lean();
    //console.log(imageDeleted);
    //console.log(filenamedelete);
    await cloudinary.v2.uploader.destroy(imageDeleted.filename);
    res.redirect('/galery');
});

module.exports = router;