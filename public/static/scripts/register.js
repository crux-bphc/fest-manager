// AJAX call for autocomplete
$(document).ready(function () {
	$("#field-institute").keyup(function () {
		$.ajax({
			type: "GET",
			url: "/api/typeahead/institutes/" + $(this).val(),
			headers: {
				"Client": "Fest-Manager/dash"
			},
			success: function (data) {
				$("#field-institute").css("background", "#fff");
				for (i = 1; i < 11; i++) {
					$("#list-institute option").eq(i).attr("value", data[i - 1] || "");
				}
			}
		});
	});
	$("#submit-button").click(function () {
		$.ajax({
			type: "PUT",
			url: "/api/users/me",
			headers: {
				"Client": "Fest-Manager/dash"
			},
			data: {
				institute: $('#field-institute').val(),
				name: $('#field-name').val(),
				phone: $('#field-phone').val() || "",
				address: $('#field-address').val() || "",
				pincode: $('#field-pincode').val() || "",
				year: $('#field-year').val() || "",
				why: $('#field-why').val() || "",
			}
		}).done(function (data, textStatus, req) {
			console.log(req);
			if (data == "Success") {
				manager.route('/dashboard');
			}
		}).fail(function(err) {
			console.log("Failed to do so");
		});
	})
});
