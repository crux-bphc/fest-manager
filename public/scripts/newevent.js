// AJAX call for autocomplete
$(document).ready(function () {
	$("#submit-button").click(function () {
		$.ajax({
			type: "POST",
			url: "/api/events/",
			headers: {
				"Client": "Fest-Manager/dash"
			},
			data: {
				name: $('#field-name').val(),
				tagline: $('#field-tagline').val(),
				category: $('#field-category').val(),
				body: $('#field-body').text(), // span element
				about: $('#field-about').val(),
				startTime: $('#field-startTime').val(),
				endTime: $('#field-endTime').val(),
			},
			success: function (data, textStatus, req) {
				console.log(req);
				if (data == "Success") {
					manager.route('/portals');
				}
			}
		})
	})
});
