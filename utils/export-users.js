print("name|institute|email|phone");
db.usersmodels.find({}, {
	"name": true,
	"email": true,
	"phone": true,
	"institute": true
}).forEach(function (user) {
	print(user.name + "|" + user.institute.replace(/,/g, " ") + "|" + user.email + "|" + user.phone);
});
