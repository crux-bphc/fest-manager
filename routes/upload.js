var express = require('express');
var router = express.Router();

router.post('/base64img', function (req, res, next) {

	var base64Img = require('base64-img');
	var file_name = req.body.file_name;
	var data = req.body.data;

	console.log("Post params " + file_name);

	base64Img.img(data, './public/static/data/images', file_name, function (err, file_path) {
		console.log("Uploading...");
		if (err) {
			console.log("ERROR: " + err);
			res.json({
				status: "Failed"
			});
			res.end();
		} else {
			res.json({
				status: "Success",
				path: file_path.replace('public',"")
			});
		}
	});
});

module.exports = router;
