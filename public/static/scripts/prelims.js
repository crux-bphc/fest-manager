(function () {
	$('#submit').click(function () {
		$(this).html("Submitting...");
		$(this).css("cursor", "none");
		$(this).attr("disabled", "disabled");
		if (!manager.validateForm()) {
			return;
		}
		var data = {};
		$('form input').each(function (i, item) {
			data[$(item).attr('id').replace('field-', '')] = $(item).val();
		});
		$.ajax({
			url: $('form').attr('route'),
			method: 'POST',
			data: data,
		}).done(function (response) {
			swal("Response recorded!");
			$('#submit').html("Submit");
			$('#submit').css("cursor", "pointer");
			$('#submit').removeAttr("disabled");
			$('form input').val('');
		}).fail(function (err) {
			swal("Some error occurred. Try again.");
			$('#submit').html("Submit");
			$('#submit').css("cursor", "pointer");
			$('#submit').removeAttr("disabled");
		});
	});
})();
