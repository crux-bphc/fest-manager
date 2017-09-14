print("name|institute|email|address|phone|pincode|why");
db.usersmodels.find({
	isAmbassador: true
}, {
	"name": true,
	"email": true,
	"address": true,
	"why": true,
	"pincode": true,
	"phone": true,
	"institute": true
}).forEach(function (user) {
	print(user.name + "|" + user.institute.replace(/,/g, " ") + "|" + user.email + "|" + user.address.replace(/[\n\r]+/g, "").replace(/ +/g, " ").replace(/,/g, " ") + "|" + user.phone + "|" + user.pincode + "|" + user.why.replace(/[\n\r]+/g, "").replace(/ +/g, " ").replace(/,/g, " "));
});
