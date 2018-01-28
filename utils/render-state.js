var fq = require('fuzzquire');

var stateHandler = fq('state');
var optionsHandler = fq('options');

module.exports = function (req, res, next) {
	req.stateparams = {};
	res.renderState = function (filename, options) {
		var state = stateHandler.getState(req);
		options = optionsHandler.updateOptions(options);
		res.render(filename, options, function (err, string) {
			if (err) console.log(err);

			res.send({
				html: string,
				state: state,
			});
		});
	};
	return next();
};
