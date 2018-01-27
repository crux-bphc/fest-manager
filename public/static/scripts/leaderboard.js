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
			type: "PUT",
			url: "/api/scores/leaderboard/add",
			headers: {
				"Client": "Fest-Manager/dash"
			},
			data: {
				name: $('#field-name').val(),
				sport: $('#field-sport').val() || "",
				rank: $('#field-rank').val() || "",
			}
		}).done(function (data, textStatus, req) {
			if (data.status || data == "Success") {
				manager.route('/portals/scores');
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
