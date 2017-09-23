var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var fq = require('fuzzquire');
var mailer = fq("utils/mailer");

describe('Mailer', function() {
    it('should render single email correctly.', function() {
        var users = [];
        users.push({ email: "vermaabhilash70@gmail.com", params: { title: "Abhilash" } });
        var options = { subject: "Hell with world", template: "email-templates/test" };
        return mailer(users, options, true).then((data) => {
            assert(data.length == 1, "Should return single event");
            assert(data[0].req.html == '<h1>Abhilash</h1><p>This is a sampe email</p>', "Template not rendered properly.");
            assert(data[0].req.to == 'vermaabhilash70@gmail.com', "Incorrect sender.");
            assert(data[0].req.template == 'views/email-templates/test.jade', "Incorrect path to template.");
        }).catch(error => {
            assert.isNotOk(error, error.messag);
        });
    });
    it('should render multiple emails correctly.', function() {
        var users = [];
        users.push({ email: "aero31aero@gmail.com", params: { title: "Rohitt" } });
        users.push({ email: "vermaabhilash70@gmail.com", params: { title: "Abhilash" } });
        users.push({ email: "nichaypro@gmail.com", params: { title: "Nischay" } });
        var options = { subject: "Hell with world", template: "email-templates/test" };
        return mailer(users, options, true).then((data) => {
            assert(data.length == 3, "Length of testcases and responses differs.");
            assert(data[1].req.html == '<h1>Abhilash</h1><p>This is a sampe email</p>', "Template not rendered properly.");
            assert(data[1].req.to == 'vermaabhilash70@gmail.com', "Incorrect sender.");
            assert(data[1].req.template == 'views/email-templates/test.jade', "Incorrect path to template.");
        }).catch(error => {
            console.log("ERR:", error.message);
            assert.isNotOk(error, error.message);
        });
    });
});