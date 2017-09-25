var express = require('express');
var router = express.Router();
var fq = require('fuzzquire');
var authenticate = fq('authentication').middleware.authenticate;
var eventModel = fq("services/events").model;
const qr = require("qrcode");
var config = fq('config-loader');

var applyStateChanges = function (req) {
	req.stateparams.title = req.stateparams.title = {
		text: 'Dashboard',
		route: '/dashboard',
	};
	req.stateparams.submenu = [{
			route: "/dashboard/account",
			label: "Account"
		},
		{
			route: "/dashboard/cart",
			label: "Cart"
		}
	];
	return req;
};

var getFields = function (user, isAmbassador = false) {
	var fields = [];
	fields.push({
		icon: "name",
		name: "name",
		label: "Name",
		editable: true,
		type: "text",
		required: true,
		value: user.name,
		typeahead: false,
		none: true,
	});
	fields.push({
		name: "email",
		label: "Email",
		editable: false,
		type: "text",
		required: true,
		value: user.email,
		typeahead: false,
		none: true,
	});
	fields.push({
		// icon: "building",
		name: "institute",
		label: "Institute",
		placeholder: "Type to Search",
		editable: true,
		type: "text",
		required: true,
		value: user.institute,
		typeahead: "institutes",
		none: true,
	});
	fields.push({
		// icon: "building",
		name: "phone",
		label: "Phone",
		editable: true,
		type: "tel",
		required: true,
		value: user.phone,
		none: true,
	});
	fields.push({
		// icon: "building",
		name: "referred_by",
		label: "Referred by",
		editable: true,
		type: "text",
		required: false,
		value: user.referred_by,
		typeahead: "ambassador",
		none: true,
	});
	return fields;
};

/* GET users listing. */
router.get('/', authenticate, function (req, res, next) {
	req = applyStateChanges(req);
	var subscribed, pending;
	Promise.all([eventModel.find({
			_id: {
				$in: req.user.pending
			}
		}).then(events => {
			pending = events;
		}), eventModel.find({
			_id: {
				$in: req.user.events
			}
		}).then(events => {
			subscribed = events;
		})])
		.then(function (events) {
			qr.toDataURL(req.user.email, {
				errorCorrectionLevel: 'H'
			}, function (err, url) {
				req.user.qrData = url;
				var params = {
					user: req.user,
					subscribed: subscribed,
					pending: pending,
					title: "Dashboard"
				};
				res.renderState('dashboard/dashboard', params);
			});
		});
});

router.get('/account', authenticate, function (req, res, next) {
	var params = {
		title: 'My Account',
		user: req.user,
	};
	req = applyStateChanges(req);
	params.fields = getFields(req.user);
	res.renderState('dashboard/account', params);
});

router.get('/cart', authenticate, function (req, res, next) {

	req = applyStateChanges(req);
	// req.user.additionals = [{
	// 	label: "Accommodation",
	// 	details: {
	// 		days: [27, 28, 29],
	// 		type: 2,
	// 	},
	// 	price: 300,
	// 	pending: true,
	// }];
	var params = {
		title: 'Check Out',
		user: req.user,
	};
	eventModel.find({
			_id: {
				$in: req.user.pending
			}
		})
		.then(function (result) {
			params.events = result;
			if (!result.length) {
				throw new Error("Nothing in cart");
			}
		})
		.catch(function (error) {
			params.error = error;
		})
		.then(function () {
			res.renderState('dashboard/cart', params);
		});
});

router.get('/checkout', function (req, res, next) {
	const genchecksum = fq('checksum').genchecksum;
	fq('api/users').getCart(req.user._id).then(function (response) {
			let transaction = Object.assign(config.payment.defaults, {
				TXN_AMOUNT: response.total,
				ORDER_ID: Date.now() + (Date.now() * Math.random()).toString().slice(0, 5),
				CUST_ID: req.user._id.toString(),
			});
			return transaction;
		})
		.then(function (transaction) {
			return genchecksum(transaction, config.payment.credentials.key);
		})
		.then(function (transaction) {
			req.session.CHECKSUMHASH = transaction.CHECKSUMHASH;
			req.session.CHECKSUMHASH = transaction.CHECKSUMHASH;
			req.session.ORDER_ID = transaction.ORDER_ID;
			req.stateparams.immersive = true;
			return res.renderState('dashboard/checkout', {
				user: req.user,
				config: config.payment,
				transaction: transaction,
			});
		})
		.catch(function (error) {
			console.log(error);
			return res.status(500).send(error);
		});
});

module.exports = router;
