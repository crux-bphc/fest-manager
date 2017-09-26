print("name|institute|email|phone|referred_by");
db.usersmodels.find({}, {
	"name": true,
	"email": true,
	"phone": true,
	"institute": true,
	"referred_by": true,
}).forEach(function (user) {
	if (user.institute)
		user.institute = user.institute.replace(/,/g, " ");
	print(user.name + "|" + user.institute + "|" + user.email + "|" + user.phone + "|" + user.referred_by);
});
