var nodemailer = require('nodemailer');
var jade = require('jade');
var fs = require('fs');
const config = require('./config-loader');
var userService = require('../routes/api/services/users').model;
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
		} else {
			reject("Add email creds to your config.");
		}
	});
};

var sendToMany = function (query, mailOptions, silent = false) {
	if(!mailOptions.template) return;
	mailOptions.silent = silent;
	var promises = [];
	userService.find(query)
	.then(function(users) {
		users.forEach(user => {
			var options = Object.assign({}, mailOptions);
			options.template = options.template.replace(/user.name/g, user.name || "Not Provided")
												.replace(/user.institute/g, user.institute || "Not Provided")
												.replace(/user.email/g, user.email || "Not Provided")
												.replace(/user.phone/g, user.phone || "Not Provided");
			var marked = require('marked');
			marked.setOptions({
				renderer: new marked.Renderer(),
				gfm: true,
				tables: true,
				breaks: false,
				pedantic: false,
				sanitize: false,
				smartLists: true,
				smartypants: false
			});
			options.html = marked(options.template);
			delete options.template;
			options.to = user.email;
			promises.push(send(options));
		});
		return Promise.all(promises);
	});
};

module.exports = sendToMany;
