var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var config = fq('config-loader');

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

var doc = new GoogleSpreadsheet(config.googleSpreadsheetId);
var sheet;

var worker = function (req, res, next) {

	async.series([
		function setAuth(step) {

			var creds = config.googleServiceAccount;
			doc.useServiceAccountAuth(creds, step);

		},

		function check(step) {

			if (((typeof req.body.name === 'undefined') || (typeof req.body.institute === 'undefined') || (typeof req.body.event === 'undefined') || (typeof req.body.link === 'undefined') || (typeof req.body.email === 'undefined'))) {
				return res.json({
					status: 500,
					msg: "Some POST parameters missing."
				});
			}
			step();
		},

		function addRecord(step) {

			doc.addRow(1, {

				"Name": req.body.name,
				"Insitute": req.body.institute,
				"Event": req.body.event,
				"Submission": req.body.link,
				"Email": req.body.email
			}, function (err, row) {

				if (err) {
					console.log(err);
					return res.json({
						status: 500,
						msg: "Insert Failed !"
					});
				}
				row.save(function (err) {
					if (err) {
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
