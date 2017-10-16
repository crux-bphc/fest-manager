var nodemailer = require('nodemailer');
var jade = require('jade');
var fs = require('fs');
const config = require('./config-loader');

// Usage: send(mailOptions).then(res => console.log(res)).catch(err => console.log(err));

var isEnabled = config.email ? true : false;
var isProduction = process.env.NODE_ENV == 'production';

var transporter = null;
if (isEnabled) {
	transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			type: "OAuth2",
			user: config.email.user,
			clientId: config.email.clientID,
			clientSecret: config.email.clientSecret,
			refreshToken: config.email.refreshToken,
		}
	});
}

var printMail = function (mailOptions) {
	if (!isProduction) console.log("mailer: Running in dev environment. Not sending actual email.");
	console.log("--- EMAIL DATA BEGIN ---");
	console.log(mailOptions);
	console.log("--- EMAIL DATA END ---");
};

var send = function (mailOptions) {
	return new Promise(function (resolve, reject) {
		if (isEnabled) {
			if (!mailOptions.template) {
				reject("Specify path to jade template.");
			}
			if (!mailOptions.params) {
				reject("Specify params for jade template.");
			}
			jade.renderFile(mailOptions.template, mailOptions.params, function (err, html) {
				if (err) reject(err);
				mailOptions.html = html;
				if (!mailOptions.silent) {
					printMail(mailOptions);
				}
				if (isProduction) {
					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log("Error:", error);
							reject(error);
						} else {
							resolve({
								req: mailOptions,
								res: info.response
							});
						}
					});
				} else {
					resolve({
						req: mailOptions,
					});
				}
			});
		} else {
			reject("Add email creds to your config.");
		}
	});
};

var sendToMany = function (userData, mailOptions, silent = false) {
	if (mailOptions.template) {
		mailOptions.template = "views/" + mailOptions.template + ".jade";
	}
	mailOptions.silent = silent;
	var promises = [];
	userData.forEach(user => {
		var options = Object.assign({}, mailOptions);
		options.to = user.email;
		options.params = user.params;
		promises.push(send(options));
	});
	return Promise.all(promises);
};

module.exports = sendToMany;
