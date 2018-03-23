// AJAX call for autocomplete
$(document).ready(function () {
	$('#cancel-button').click(function () {
		$(".latent").toggleClass('active');
		$("form").removeClass('active');
		$("div.content").removeClass('inactive');
	});
	$('#open-form-button').click(function () {
		$(".latent").toggleClass('active');
		$("form").addClass('active');
		$(".content").addClass('inactive');
	});
	$("#submit-button").click(function () {
		if (!manager.validateForm()) {
			return;
		}
		$.ajax({
			type: "POST",
			url: "/api/feed",
			headers: {
				"Client": "Fest-Manager/dash"
			},
			data: {
				subject: $('#field-subject').val(),
				// TODO remove this later. Added for compatibility with app.
				sport: $('#field-subject').val(),
				text: $('#field-text').val(),
				team1: $('#field-team1').val(),
				team2: $('#field-team2').val(),
			}
		}).done(function (data, textStatus, req) {
			if (data == "Success") {
				manager.route('/portals/feed');
			}
		}).fail(function (err) {
			swal({
				title: "Score Update Failed",
				text: "Something went wrong. Please try again.",
				type: "error",
				confirmButtonText: "OK",
				confirmButtonColor: "#202729"
			});
		});
	});
});
