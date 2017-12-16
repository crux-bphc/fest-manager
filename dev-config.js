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

    googleServiceAccount: {
        "type": "service_account",
        "project_id": "pearl-2018",
        "private_key_id": "881dfa4e0087e69f95c13a2cd5b99aff6e43a0b2",
        "private_key": "XXXXXXXX",
        "client_email": "pearl-41@pearl-2018.iam.gserviceaccount.com",
        "client_id": "108883000641250891138",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/pearl-41%40pearl-2018.iam.gserviceaccount.com"
    },

    googleSpreadsheetId: "1BsOH79AJpjdOia0g3TL2RyP5o36ablXMd1b6WG0bozo",

    port: 3000,
};
module.exports = config;