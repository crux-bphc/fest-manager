var Cart = function () {
	var state = {
		total: 0,
		subtotal: 0,
		additionals: [],
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

	const setAdditionals = function () {
		if ($('#enableAccomm').is(':checked')) {
			state.additionals = [{
				label: "Accommodation",
				details: {
					days: [],
					type: 1,
				},
				pending: true,
			}];

			// Collect accommodation type
			state.additionals[0].details.type = parseInt($('[name="accommtype"]:checked').val());

			// Collect no. of days
			for (i = 27; i < 30; i++) {
				if ($('#accomm_on_' + i).is(':checked')) {
					state.additionals[0].details.days.push(i);
				}
			}
			if (!state.additionals[0].details.days.length) state.additionals = [];
		} else
			state.additionals = [];
	};

	const onchange = function (e, init = false) {
		setAdditionals();
		$.ajax({
			method: 'POST',
			url: '/api/users/cart',
			async: true,
			data: {
				init: init,
				additionals: state.additionals,
			},
			headers: {
				"Client": "Fest-Manager/dash"
			},
			dataType: 'json',
		}).done(function (response) {
			state.total = response.total;
			state.subtotal = response.subtotal;
			$('#cart [name="subtotal"]').html(response.subtotal);
			$('.body .payment .additionals').html("");
			if (response.user.additionals) {
				let additionals = "<div class=\"price additional\" data-label=\"$addition.label\"><i>&#x20b9;</i><span class=\"amount\" name=\"$addition.label\">$addition.price</span></div>";
				response.user.additionals.forEach(function (addition) {
					if (addition.pending) {
						$('.body .payment .additionals').append(additionals.replace(/\$addition.label/g, addition.label).replace(/\$addition.price/g, addition.price));
					}
				});
			} else {
				$('#cart .additional').css('display', 'block');
			}
			$('#cart [name="total"]').html(response.total);
		});
	};

	$('.section.body .additionals input').change(onchange);

	// Dummmy Submit Button
	$('.payment .button').click(function () {
		manager.route('dashboard/checkout');
	});

	const init = function () {
		onchange(undefined, true);
	};

	return {
		init: init,
		remove: remove,
		setAdditionals: setAdditionals,
	};
}();
