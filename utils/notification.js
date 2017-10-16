const projectRoot = require('project-root-path');
const userService = require(projectRoot + '/routes/api/services/users').model;
const moment = require('moment');
/**
Usage Details :

id: User's object ID
notification: Object that contatins the notification and it properties. (title, message, icon, image, read, time)

var notification = require("PATH-TO-notification.js");
notification.createNotification(req.user._id, {
	title: "Test Notification",
	message: "Some one line text here ......",
	icon: "icon-<choose from icomoon/font.css>",
	time: "Some Timestamp",
	read: false,
	route: "where-the-notification-leads-to"
});

**/

function pushToMany(id, notification){
	notification.date = moment().format('DD/MM/YY hh:mm A');
	userService.update({_id: id},{$push: {notifications: notification}} ,function(){
		console.log("Notification Added");
	});
}

module.exports = {
	push: pushToMany
};