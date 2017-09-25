var config = {
	passports: {
		// facebook: {
		// 	clientID: '1963512117202201',
		// 	clientSecret: 'a241d0e2064df597bdb6c8a8fc481f98',
		// 	callbackURL: "http://localhost:3000/auth/facebook/callback",
		// 	profileFields: ['emails', 'displayName']
		// },
		google: {
			clientID: '566366256828-ius4a49h14bnl77f8v7esr0g85e8isf8.apps.googleusercontent.com',
			clientSecret: 'oQZZbTwcXvebPYUA5zBdbiB8',
			callbackURL: "http://localhost:3000/auth/google/callback",
			profileFields: ['emails']
		},
		github: {
			clientID: '5fa857907229564490f0',
			clientSecret: '91bd7c4d0705dc917f41483350f2cbf04cbc3714',
			callbackURL: "http://localhost:3000/auth/github/callback",
			profileFields: ['emails']
		},
	},
	database: {
		name: "fest-manager-dev",
		url: "mongodb://127.0.0.1/",
	},
	email: {
		clientID: "566366256828-qr24q6b72krj9p66u2eccfpak56cjc38.apps.googleusercontent.com",
		clientSecret: "qktNgemJfKIKp-NVEkG03C0F",
		refreshToken: "1/UoSgLDZVOgXJ-QUp9nh-c2cP7ljIihGZ7_ytbyYxDpQ",
		user: "vermaabhilash70@gmail.com",
	},
	payment: {
		isEnabled: true,
		url: 'https://pguat.paytm.com',
		credentials: {
			id: 'RLABTF23274153190333',
			key: 'gv_cECHQtZUj5PmU',
		},
		defaults: {
			INDUSTRY_TYPE_ID: 'Retail',
		  	CHANNEL_ID: 'WEB',
		  	MID: 'RLABTF23274153190333',
		  	WEBSITE: 'WEB_STAGING',
		  	CALLBACK_URL: 'http://localhost:3000/api/users/checkout/callback',
		},
	},
};
module.exports = config;