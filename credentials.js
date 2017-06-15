var credentials = {
    facebook: {
        clientID: '1963512117202201',
        clientSecret: '0749b4a51ed5accc02ffda7d6f4df837',
        callbackURL: "http://localhost:3000/registration",
        profileFields: ['emails']
    },
    google: {
        clientID: '566366256828-ius4a49h14bnl77f8v7esr0g85e8isf8.apps.googleusercontent.com',
        clientSecret: 'lSijULuEwtR7sSuiepZwpf_t',
        callbackURL: "http://localhost:3000/registration",
        profileFields: ['emails']
    }
}
module.exports = credentials;