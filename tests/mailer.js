var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var fq = require('fuzzquire');
var mailer = fq("utils/mailer");

describe('Mailer', function() {
    // it('should render email correctly.', function() {
    //     var options = { subject: "Hell with world", template: "#Abhilash \n This is a sample email" };
    //     return mailer({}, options).then((data) => {
    //         console.log(data);
    //         assert(data[0].req.html == '<h1>Abhilash</h1><p>This is a sampe email</p>', "Template not rendered properly.");
    //         assert(data[0].req.to.length > 0, "No receiver.");
    //     }).catch(error => {
    //         assert.isNotOk(error, error.messag);
    //     });

        /* TODO:
            Rewrite test to fit query, markdown based mail roll out.
        */
});