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
	$('#cancel-button').click(function() {
        $(".latent").toggleClass('active');
        $("form").removeClass('active');
        $("div.content").removeClass('inactive');
    });
    $('#open-form-button').click(function() {
        $(".latent").toggleClass('active');
        $("form").addClass('active');
        $(".content").addClass('inactive');
    });
	$("#submit-button").click(function () {
        var isAmbassador = false;
        if($('#field-why').val() != "" && $('#field-why').val()) isAmbassador = true;
        console.log(isAmbassador);
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
                isAmbassador: isAmbassador
			}
		}).done(function (data, textStatus, req) {
			console.log(req);
			if (data == "Success") {
				manager.route('/dashboard');
			}
		}).fail(function(err) {
			swal({
                title: "Registration Failed",
                text: "Something went wrong. Please try again.",
                type: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#202729"
            });
		});
	})
});
