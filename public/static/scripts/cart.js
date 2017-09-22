var Cart = function() {
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

	const onchange = function(init = false) {
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
		}).done(function(response) {
			state.total = response.total;
			state.subtotal = response.subtotal;

			$('#cart [name="subtotal"]').html(response.subtotal);
			if (response.user.additionals) {
				response.user.additionals.forEach(function(addition) {
					if(addition.pending)
						$('#cart .additional[name="' + addition.label + '"]').css('display', 'block');
					else
						$('#cart .additional[name="' + addition.label + '"]').css('display', 'none');
				});
			} else {
				$('#cart .additional').css('display', 'block');
			}
			$('#cart [name="total"]').html(response.total);
		});
	};

	$('.cart > input, .cart > select').change(onchange);

	// Dummmy Submit Button
	$('.payment .button').click(function() {
		manager.route('dashboard/checkout');
	});

	const init = function(){
		onchange(true);
	}

	return {
		init: init,
		remove: remove,
	};
}();
