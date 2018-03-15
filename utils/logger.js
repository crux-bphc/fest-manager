module.exports = function () {
	temp = {};
	temp.log = console.log;
	console.log = function () {
		args = Array.prototype.slice.call(arguments);
		if (global.logging.log) {
			temp.log.apply(null, args);
		}
	};
	temp.warn = console.warn;
	console.warn = function () {
		args = Array.prototype.slice.call(arguments);
		if (global.logging.warn) {
			temp.warn.apply(null, args);
		}
	};
	temp.error = console.error;
	console.error = function () {
		args = Array.prototype.slice.call(arguments);
		if (global.logging.error) {
			temp.error.apply(null, args);
		}
	};
};
