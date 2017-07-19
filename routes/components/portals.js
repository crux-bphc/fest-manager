var express = require('express');
var router = express.Router();
var authenticate = require('../../utils/authentication').middleware;
var bodiesService = require('../api/services/bodies').model;
var eventsService = require('../api/services/events').model;

var elevate = function(req, res, next) {
    if (req.user.privilege)
        return next();
    let error = new Error('Access denied');
    error.status = 404;
    return next(error);
};

router.get('/', authenticate, elevate, function(req, res, next) {
    if (req.user.privilege.level == 2)
        bodiesService.find(function(err, items) {
            if(err) {
                return next(err);
            }
            res.renderState('portals_home', {
                bodies: items,
                user: req.user,
                title: 'Portals Home'
            });
        });
    else if (req.user.privilege.level == 1) {
        res.redirect('/components/portals/' + req.user.privilege.body);
    }
});

var getFields = function(event) {
    fields = [];
    fields.push({
        name: "description",
        placeholder: "Add a description",
        editable: true,
        type: "textarea",
        required: true,
        value: event ? event.description : "",
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "hero",
        editable: true,
        type: "image",
        required: true,
        value: event ? event.hero : "",
        typeahead: false,
        none: true,
        width: 800,
        height: 400,
        id: 1
    });
    fields.push({
        name: "thumbnail",
        editable: true,
        type: "image",
        id: 0,
        required: true,
        value: event ? event.thumbnail : "",
        typeahead: false,
        none: true,
        width: 500,
        height: 500
    });
    fields.push({
        name: "type",
        placeholder: "Type",
        editable: true,
        value: event ? event.type : "",
        type: "select",
        options: ["Competition", "Workshop", "Proshow"],
        none: true,
        group: 0,
    });
    fields.push({
        name: "title",
        placeholder: "Title",
        editable: true,
        value: event ? event.title : "",
        type: "text",
        none: true,
        group: 1,
    });
    fields.push({
        name: "tagline",
        placeholder: "Tagline",
        editable: true,
        value: event ? event.tagline : "",
        type: "text",
        none: true,
        group: 1,
    });
    fields.push({
        name: "category",
        placeholder: "Category",
        editable: true,
        type: "text",
        value: event ? event.category : "",
        none: true,
        group: 1,
    });
    fields.push({
        name: "starttime",
        placeholder: "Start Time",
        editable: true,
        value: event ? event.startTime : "",
        type: "text",
        none: true,
        group: 2,
    });
    fields.push({
        name: "endtime",
        placeholder: "End Time",
        editable: true,
        type: "text",
        none: true,
        value: event ? event.endTime : "",
        group: 2,
    });
    fields.push({
        name: "venue",
        placeholder: "Venue",
        editable: true,
        type: "text",
        value: event ? event.venue : "",
        none: true,
        group: 2,
    });
    fields.push({
        name: "contact",
        placeholder: "Contact",
        editable: true,
        type: "phone",
        value: event ? event.contact : "",
        none: true,
        group: 2,
    });
    fields.push({
        name: "price",
        placeholder: "Price",
        editable: true,
        value: event ? event.price : "",
        type: "number",
        none: true,
        group: 2,
    });
    fields.push({
        name: "teamSize",
        placeholder: "Team Size",
        editable: true,
        value: event ? event.teamSize : "",
        type: "number",
        none: true,
        group: 2,
    });
    return fields;
};

router.get('/:body', authenticate, elevate, function(req, res, next) {
    if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
        var error = new Error('Access Denied');
        error.status = 403;
        return next(error);
    }
    var name;
    bodiesService.findOne({
        code: req.params.body
    }, function(err, body) {
        if (err) return res.send("Error");
        eventsService.find({
            body: body._id
        }, function(err, items) {
            if (err || !items) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }
            return res.renderState('portal', {
                user: req.user,
                title: body.name,
                items: items,
                fields: getFields()
            });
        });
    });

});

router.post('/:body/add', authenticate, elevate, function(req, res, next) {
    if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
        var error = new Error('Access Denied');
        error.status = 403;
        return next(error);
    }
    var event = new eventsService(req.body);
    bodiesService.findOne({
        code:req.params.body
    }, function(err, body) {
        event.body = body._id;
        event.save(function(err) {
            if (err) return res.send("Error");
            res.send("Success");
        });
    });
});

router.post('/:body/edit', authenticate, elevate, function(req, res, next) {
    if (req.params.body != req.user.privilege.body && req.user.privilege.level != 2) {
        var error = new Error('Access Denied');
        error.status = 403;
        return next(error);
    }
    eventsService.update({
        _id: req.body._id || req.body.id
    },req.body, function(err) {
        if (err) return res.send("Error");
        res.send("Success");
    });
});

module.exports = router;