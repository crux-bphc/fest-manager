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
    if(user.institute)
        user.institute = user.institute.replace(/,/g, " ");
    if(user.address)
        user.address = user.address.replace(/[\n\r]+/g, "").replace(/ +/g, " ").replace(/,/g, " ");
    if(user.why)
        user.why = user.why.replace(/[\n\r]+/g, "").replace(/ +/g, " ").replace(/,/g, " ");
	print(user.name + "|" + user.institute + "|" + user.email + "|" +  + "|" + user.phone + "|" + user.pincode + "|" + user.why);
});
