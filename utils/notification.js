const projectRoot = require('project-root-path');
const userService = require(projectRoot + '/routes/api/services/users').model;

/**
Usage Details :

id: User's object ID
notification: Object that contatins the notification and it properties. (title, message, icon, image, read, time)

var notification = require("PATH-TO-notification.js");
notification.createNotification(req.user._id, {
	title: "Test Notification",
	message: "Some one line text here ......",
	icon: "Random.ico",
	image: "Path-to-image",
	time: "Some Timestamp",
	read: true or false

});

**/

function pushToMany(id, notification){
	userService.update({_id: id},{$push: {notifications: notification}} ,function(){
		console.log("Notification Added");
	});
}

module.exports = {
	push: pushToMany
};