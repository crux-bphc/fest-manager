print("name|institute|email|phone");
db.usersmodels.find({}, {
	"name": true,
	"email": true,
	"phone": true,
	"institute": true
}).forEach(function (user) {
    if(user.institute)
        user.institute = user.institute.replace(/,/g, " ");
	print(user.name + "|" + user.institute + "|" + user.email + "|" + user.phone);
});
