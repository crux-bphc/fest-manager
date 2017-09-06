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
	state = {
		subtotal: 0,
		additional: 0,
		body: {},
		events: [],
		exposed: true,
		total: 0
	}
	var disableExposure = function() {
		state.exposed = false;
	}
	var setSubtotal = function(amount) {
		if(state.exposed)
			state.subtotal = parseInt(amount);
		else
			console.log("This was an invalid attempt to access the state.");
	}

	//Additional Behaviour

	$('#availAccomm').on('change', function() {
		if($(this).is(':checked')) {
			state.additional = parseInt($('#field-type').val().split('\u20b9')[1]);
			state.total = state.subtotal + state.additional;
		}
		else {
			state.additional = 0;
			state.total = state.subtotal;
		}
		$('#checkoutTotal').html(state.total);
	});
	$('.payment select').on('change', function(){
		if($('#availAccomm').is(':checked')) {
			state.additional = parseInt($(this).val().split('\u20b9')[1]);
			state.total = state.subtotal + state.additional;
		}
		else state.total = state.subtotal;
		$('#checkoutTotal').html(state.total);
	});

	// Submit Button Dummmy
	$('.payment .button').click(function() {
		$.ajax({
			type: 'POST',
			url: '/transaction',	// Fix gateway address here.
			dataType: 'json',
			contentType: 'json',
			data: state.body,
			async: true,
		}).done(function(response){
			manager.route('/dashboard');
		});
	});

	// Export functions to self-destructing script
	return {
		setSubtotal: setSubtotal,
		disableExposure: disableExposure
	}
}();