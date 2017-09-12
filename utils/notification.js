const userService = require('../routes/api/services/users').model;

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
	read: true //or fale

});

**/

function createNotification(id, notification){
	userService.update({_id: id},{$push: {notifications: notification}} ,function(){
		console.log("Notification Added");
	});
}

module.exports = {
	createNotification: createNotification
}; 