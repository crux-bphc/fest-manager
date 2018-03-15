var express = require('express');
var router = express.Router();
var projectroot = require('project-root-path');
var path = require('path');
router.post('/base64img', function (req, res, next) {

	var base64Img = require('base64-img');
	var file_name = req.body.file_name;
	var data = req.body.data;
	console.log(__dirname);
	base64Img.img(data, path.join(projectroot, './public/static/data/images'), file_name, function (err, file_path) {
		if (err) {
			console.log("Image Upload Error: " + err);
			res.json({
				status: "Failed"
			});
			res.end();
		} else {
			console.log("Successfully uploaded");
			res.json({
				status: "Success",
				path: file_path.split('public')[1]
			});
		}
	});
});

module.exports = router;
