$("#submit-button").click(function () {
	if (!manager.validateForm()) {
		return;
	}
	$.ajax({
		type: "POST",
		url: "/api/notify",
		headers: {
			"Client": "Fest-Manager/dash"
		},
		data: {
			to: $('#field-to').val(),
			title: $('#field-title').val(),
			message: $('#field-message').val(),
			route: $('#field-route').val() || "#",
			type: $('#field-icon').val() || "Information",
			email: emailTemplate.value(),
		}
	}).done(function (data, textStatus, req) {
		swal({
			title: "Notifications pushed",
			type: "success",
			confirmButtonText: "OK",
			confirmButtonColor: "#202729"
		});
	}).fail(function (err) {
		swal({
			title: "Registration Failed",
			text: "Something went wrong. Please try again.",
			type: "error",
			confirmButtonText: "OK",
			confirmButtonColor: "#202729"
		});
	});
});

var emailTemplate = new SimpleMDE({
	element: $("#field-email")[0],
	toolbar: false,
	status: false
});
