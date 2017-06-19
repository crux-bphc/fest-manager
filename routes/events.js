var express = require('express');
var router = express.Router();

var getEvent = function(n){
    var title = "Sample Event " + n;
    return {
        title: title,
        link: "/events/myevent",
        description: "Loads of random detail",
        tagline: "The Amazing Event",
        img: "https://avatars3.githubusercontent.com/u/11003211?v=3&s=200",
        category: "Coding",
        timestamp: "2017-10-23"
    };
};


/* GET users listing. */
router.get('/', function(req, res, next) {
    var params = {
        title: 'Events',
    };
    params.events = [];
    params.events.push(getEvent(1))
    params.events.push(getEvent(2))
    params.events.push(getEvent(3))
    params.events.push(getEvent(4))
    params.events.push(getEvent(5))
    params.events.push(getEvent(6))
    params.events.push(getEvent(7))
    params.events.push(getEvent(8))
    res.render('events', params);
});

module.exports = router;
