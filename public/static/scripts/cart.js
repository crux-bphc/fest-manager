var Cart = function () {
	var state = {
		total: 0,
	};

	const remove = function (id, event) {
		$.ajax({
			method: "POST",
			url: "/api/events/deletefromcart",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Client", "Fest-Manager/dash");
			},
			data: {
				id: id
			},
			success: function (res) {
				if (res.status == 200) {
					swal({
						title: "Successful",
						text: "Event removed from cart !",
						type: "success",
						confirmButtonText: "OK",
						confirmButtonColor: "#202729"
					});
					manager.refresh();
				} else {
					swal({
						title: "Failed !",
						text: res.msg,
						type: "error",
						confirmButtonText: "OK",
						confirmButtonColor: "#202729"
					});
				}
			}
		});
	};

	var onchange = function () {
		$.ajax({
			method: 'POST',
			url: '/api/users/cart',
			async: true,
			data: {
				accomm: $('#availAccomm').is(':checked'),
				amount: $('#availAccomm').is(':checked') ? $('#field-choice').val().split('\u20b9')[1] : 0,
			},
			headers: {
				"Client": "Fest-Manager/dash"
			},
			dataType: 'json',
		}).done(function (data) {
			$('#cart-subtotal').html(data.subtotal);
			if (data.additional) {
				$('#cart-additional').css('display', 'block');
			} else {
				$('#cart-additional').css('display', 'none');
			}
			$('#cart-total').html(data.total);
		});
	};

	$('.cart > input, .cart > select').change(onchange);

	// Dummmy Submit Button
	$('.payment .button').click(function () {
		$.ajax({
			type: 'POST',
			url: '/transaction', // Fix gateway address here.
			dataType: 'json',
			contentType: 'json',
			data: state,
			headers: {
				Client: 'Fest-Manager/dash',
			},
			async: true,
		}).done(function (response) {
			manager.route('/dashboard');
		});
	});

	const init = function () {
		onchange();
		console.log("Fired Onchange On Load.");
	};

	return {
		init: init,
		remove: remove,
	};
}();
