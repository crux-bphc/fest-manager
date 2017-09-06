function delete_from_cart(id, event){
	$.ajax({
		method: "POST",
		url: "/api/events/deletefromcart",
		beforeSend: function(xhr){
			xhr.setRequestHeader("Client", "Fest-Manager/dash");
		},
		data: {
			id: id
		},
		success: function(res){
			if(res.status == 200)
			{
				swal({
					title: "Successful",
					text: "Event removed from cart !",
					type: "success",
					confirmButtonText: "OK",
					confirmButtonColor: "#202729"
				});
				manager.refresh();
			}
			else
			{
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
var cart = function() {

	var state = {
		total: 0,
	}

	var onchange = function() {
		console.log("Fetching updated cart");
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
			if(data.additional) {
				$('#cart-additional').show();
			}
			else {
				$('#cart-additional').hide();
			}
			$('#cart-total').html(data.total);
		});
	};

	onchange();

	$('input, select').change(onchange);

	// Submit Button Dummmy
	$('.payment .button').click(function() {
		$.ajax({
			type: 'POST',
			url: '/transaction',	// Fix gateway address here.
			dataType: 'json',
			contentType: 'json',
			data: state,
			headers: {
				Client: 'Fest-Manager/dash',
			},
			async: true,
		}).done(function(response) {
			manager.route('/dashboard');
		});
	});
}();