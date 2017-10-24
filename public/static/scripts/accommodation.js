var portal = function () {
	var current = null;
	var addition = {
		state: {
			label: null,
			vacancy: null,
		}
	};
	addition.submit = function () {
		$.ajax({
			type: 'POST',
			url: '/api/accomm',
			data: addition.state,
			headers: {
				'Client': 'Fest-Manager/dash'
			}
		}).done(function (data) {
			swal({
				title: "Successful",
				type: "success",
				confirmButtonText: "OK",
			});
		}).fail(function (err) {
			swal({
				title: "Fuck you mofo",
				text: err,
				type: "error",
				confirmButtonText: "OK",
			});
		});
	};
	addition.reset = function () {
		$('.addition input').val("");
		$('.foldup').removeClass('active');
	};
	addition.init = function () {
		$('.addition form input').on('change', function () {
			addition.state[this.id.replace("field-", "")] = $(this).val();
		});
	};
	addition.init();

	var allotment = {
		state: {
			atmosID: null,
			room: null,
			starttime: null,
			duration: null,
			checkedout: false,
			balance: 0,
		}
	};
	allotment.submit = function (isFinal = false) {
		allotment.state.balance = allotment.calculate();
		$.ajax({
			type: 'PUT',
			url: '/api/users/update-one',
			data: {
				filter: {
					email: allotment.state.atmosID
				},
				data: {
					accommodation: {
						room: allotment.state.room,
						starttime: allotment.state.starttime,
						duration: allotment.state.duration,
						balance: allotment.state.balance,
						checkedout: isFinal,
					}
				}
			},
			headers: {
				'Client': 'Fest-Manager/dash'
			}
		}).done(function () {
			swal({
				title: 'Successful',
				type: 'success',
				confirmButtonText: 'OK',
			});
		}).fail(function () {
			swal({
				title: 'Update failed',
				type: 'error',
				confirmButtonText: 'OK',
			});
		});
	};
	allotment.setState = function (data) {
		console.log('Setting state', data);
		$('#field-name').val(data.name);
		$('#field-festID').val(data.email);
		if (data.accommodation) {
			$('#field-duration').val(data.accommodation.duration);
			$('.list input').prop('checked', false);
			if (data.accommodation.starttime && data.accommodation.starttime != "") {
				$('#field-starttime').val(data.accommodation.starttime);
			} else {
				$('#field-starttime').val(moment().format('DD/MM hh:mmA'));
			}
			if (data.accommodation.room)
				$('#' + data.accommodation.room).prop('checked', true);
			allotment.state.balance = data.accommodation.balance || 0;
		}

		allotment.state.atmosID = data.email;
		allotment.state.starttime = $('#field-starttime').val();
		allotment.state.duration = $('#field-duration').val();
		allotment.state.room = $('.allotment .list input:checked').attr("id");
		$('.latent').addClass('active');
	};
	allotment.findOrCreate = function () {
		$.ajax({
			type: 'POST',
			url: '/api/users/get-one',
			data: {
				filter: {
					email: $('#field-key').val()
				},
			},
			headers: {
				'Client': 'Fest-Manager/dash'
			},
		}).done(function (data) {
			if (data) {
				console.log('Data returned', data);
				data.accommodation = data.accommodation || {};
				if (data.accommodation.checkedout == "true" || data.accommodation.checkedout == true) {
					swal({
						title: 'User checked out',
						confirmButtonText: 'OK'
					});
					allotment.reset();
					return;
				}
				allotment.setState(data);
				current = allotment;
			} else allotment.reset();
		}).fail(function (err) {
			swal({
				title: 'No one found',
				type: 'error',
				confirmButtonText: 'OK',
			});
			allotment.reset();
		});
	};
	allotment.reset = function () {
		$('.allotment [id*= "field-"]').val("");
		$('.list input').prop('checked', false);
	};
	allotment.calculate = function () {
		var amount = allotment.state.duration == 1 ? 250 : (allotment.state.duration == 2 ? 400 : 500);
		if (!allotment.state.checkedout) amount += 100;
		$('#submit-button').removeClass('disabled');
		if (amount > allotment.state.balance) {
			$('.allotment .footer .instruct').html('Collect');
			$('.allotment .footer .price').html(Math.abs(allotment.state.balance - amount));
		} else if (amount < allotment.state.balance) {
			$('.allotment .footer .instruct').html('Refund');
			if (moment.duration(moment().diff(moment(allotment.state.starttime, 'DD/MM hh:mmA'))).asHours() > 1 && !allotment.state.checkedout) {
				$('.allotment .footer .instruct').html('Not happening, too late');
				$('#submit-button').addClass('disabled');
				return;
			}
			$('.allotment .footer .price').html(Math.abs(allotment.state.balance - amount));
		} else {
			$('.allotment .footer .instruct').html('No transaction');
			$('.allotment .footer .price').html("");
		}
		return amount;
	};
	allotment.init = function () {
		$('.allotment form input').on('change', function () {
			allotment.state[this.id.replace("field-", "")] = $(this).val();
			allotment.calculate();
		});
		$('.allotment .list input').on('change', function () {
			allotment.state.room = this.id;
			allotment.calculate();
		});
		$('#checkout').click(function () {
			allotment.state.checkedout = true;
			allotment.submit(true);
		});
	};
	allotment.init();
	$('#add-button').click(function () {
		if ($('.section.body .foldup').hasClass('active')) {
			$('.section.body .foldup').removeClass('active');
			current = null;
			$('.section.header .controls .latent').removeClass('active');
		} else {
			$('.section.body .foldup').addClass('active');
			current = addition;
			$('.controls .latent').addClass('active');
		}
	});
	$('#submit-button').click(function () {
		if (current)
			current.submit();
	});
	$('#reset-button').click(function () {
		if (current)
			current.reset();
		$('.controls .latent').removeClass('active');
	});
	$('#field-key').keydown(function (e) {
		if (e.keyCode == 13 || e.which == 13 || e.keyCode == 9 || e.which == 9) {
			allotment.findOrCreate();
			$('#field-duration').focus();
		}
	});
	$('#field-key').on('change', allotment.findOrCreate);
	$('form').on('submit', function (e) {
		e.preventDefault();
	});
};
