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



router.post("/", function(req, res, next) {
    var album = (req.body.album).trim();
    var title = (req.body.title).trim();
    var subtitle = (req.body.subtitle).trim();
    var imagePath = (req.body.path).trim();
    var imageName = imagePath.split("/")[4];

        var imageModel = new model({
            albumname: album,
            title: title,
            subtitle: subtitle,
            img: imageName
        });
        imageModel.save();
        return res.json(req.body);
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