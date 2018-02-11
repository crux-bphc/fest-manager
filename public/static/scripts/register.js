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
		var isAmbassador = false;
		if ($('#field-why').val() != "" && $('#field-why').val()) isAmbassador = true;
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
				referred_by: $('#field-referred_by').val() || "",
				isAmbassador: isAmbassador
			}
		}).done(function (data, textStatus, req) {
			swal({
				title: "Registered Successfully",
				type: "success",
				confirmButtonText: "OK",
			});
			if (data == "Success") {
				manager.route('/dashboard');
			}
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
});
