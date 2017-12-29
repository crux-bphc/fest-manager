var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var config = fq('config-loader');

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

var docs = {
	terpsichore: new GoogleSpreadsheet(config.spreadsheets.terpsichore),
	kaleidoscope: new GoogleSpreadsheet(config.spreadsheets.kaleidoscope),
	tilldeaf: new GoogleSpreadsheet(config.spreadsheets.tilldeaf),
};
var sheet;
var worker = function (req, res, next) {

	async.series([
		function setAuth(step) {
			var creds = config.googleServiceAccount;
			docs[req.body.event].useServiceAccountAuth(creds, step);
		},

		function check(step) {
			step();
		},

		function addRecord(step) {
			console.log('Event: ',req.body.event);
			docs[req.body.event].addRow(1, req.body, function (err, row) {

				if (err) {
					console.log(err);
					return res.json({
						status: 500,
						msg: "Insert Failed !"
					});
				}
				row.save(function (err) {
					if (err) {
						console.log(err);
						return res.json({
							status: 500,
							msg: "Insert Failed !"
						});
					} else {
						return res.json({
							status: 200,
							msg: "Inserted !"
						});
					}
				});

			});

		}
	], function (err) {
		console.log(err);
	});
};

router.post('/terpsichore', function (req, res, next) {
	req.body.event = 'terpsichore';
	next();
}, worker);

router.post('/tilldeaf', function (req, res, next) {
	req.body.event = 'tilldeaf';
	next();
}, worker);

router.post('/kaleidoscope', function (req, res, next) {
	req.body.event = 'kaleidoscope';
	next();
}, worker);

module.exports = router;
