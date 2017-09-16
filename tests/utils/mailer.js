var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var projectroot = require('project-root-path');
var mailer = require(projectroot + "/utils/mailer");

describe('Mailer', function() {
    it('should render multiple emails correctly.', function() {
        var options = { subject: "Hell with world", template: "email-templates/test" }
        var users = [];
        users.push({ email: "aero31aero@gmail.com", params: { title: "Rohitt" } })
        users.push({ email: "vermaabhilash70@gmail.com", params: { title: "Abhilash" } })
        users.push({ email: "nichaypro@gmail.com", params: { title: "Nischay" } })
        mailer(users, options, false).then((data)=> {
            console.log("DATa",data);
            // done();
        }).catch(err => {
        	console.log("ERR:",err);
            // done(err);
        });
    });
});
