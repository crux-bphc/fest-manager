var express = require('express');
var router = express.Router();
var userService = require('../models/users.model');

/* routing CRUD operations for users service */

router.get('/', function(req, res, next) {
    userService.find(function(err, users) {
        if (err) {
            res.send('Error');
            return 0;
        }
        res.send(users);
    });
});

router.get('/:id', function(req, res, next) {
    userService.find({ _id: req.params("id") }, function(err, user) {
        if (err) {
            res.send('Error');
            return 0;
        }
        res.send(user);
    });
});

router.post('/', function(req, res, next) {
    var user = new userService(req.body);
    user.save(function(err) {
        if (err) {
            res.send("Error");
            return 0;
        }
        res.send("Success");
    })
});

router.put('/', function(req, res, next) {
    userService.update({ _id: req.body._id }, req.body, function(err) {
    	if (err) {
    		res.send("Error");
    		return 0;
    	}
        res.send("Success");
    });
});

router.delete('/:id', function(req, res, next) {
    userService.findByIdAndRemove(req.params.id, function(err, item) {
        if (err) {
            res.send("Error");
        }
        res.send("Success");
    })
})

module.exports = router;
