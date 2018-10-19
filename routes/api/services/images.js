var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require("fs"); 

var imageSchema = new Schema({
    albumname: String,
    title: String,
    subtitle: String,
    img: String
});
var model = mongoose.model('images', imageSchema);
var images = []; // stores image names as string.



router.post("/", function(req, res, next) {
    var album = (req.body.album).trim();
    var title = (req.body.title).trim();
    var subtitle = (req.body.subtitle).trim();
    var imagePath = (req.body.image).trim();

    fs.readdir("public/static/data/images", function(err, files) {
        files.forEach(file => {
            if(file.search(/.png|.jpg|.jpeg/) != -1) {
                images.push(file);
            }
        });
        var latestImage = images[images.length -1];
        var imageModel = new model({
            albumname: album,
            title: title,
            subtitle: subtitle,
            img: latestImage
        });
        imageModel.save();
        return res.json(req.body);
    });
});
var permission = {
	read_one: 0,
	read_all: 0,
	insert: 1,
	update: 2,
	delete: 2
};
module.exports = {
    route: '/images',
    router: router,
    model: model,
    permission: permission
}; 