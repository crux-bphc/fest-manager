var RegisterButton = function () {
	var templates = {
		teamed: '<div class="latent" tabindex="1"><div class="button add_to_cart"><i class="icon-add_shopping_cart"></i><span>Register</span></div><div class="button join_team" onclick="RegisterButton.join(this, \'$id\', isFree)"><i class="icon-group_add"></i><span>Join Team</span></div><div class="button new_team" onclick="RegisterButton.add(this, \'$id\', $isFree)"><i class="icon-add_box"></i><span>New Team</span></div></div>',
		single: '<div class="button add_to_cart" onclick="RegisterButton.add(this, \'$id\', $isFree)"><i class="icon-add_shopping_cart"></i><span>Register</span></div>',
		subscribed: '<div class="button subscribed"><i class="icon-check"></i><span>Registered</span></div>',
		pending: '<a class="button pending" href="https://townscript.com/e/pearl2018-240304"><i class="icon-ticket"></i><span>Buy Tickets</span></a>',
	};

	var failAlert = function (res) {
		swal({
			title: "Failed !",
			text: res.msg,
			type: "error",
			confirmButtonText: "OK",
			confirmButtonColor: "#202729"
		});
	};

	var addToCart = function (button, id, isFree) {

		$.ajax({
			method: "POST",
			url: "/api/events/addtocart",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Client", "Fest-Manager/dash");
			},
			data: {
				id: id
			},
		}).done(function (res) {
			if (res.status == 200) {
				if (typeof res.teamID !== 'undefined') {
					swal({
						title: "Successful",
						text: "Event added to cart! Your team ID is " + res.teamID + ". Share this ID with your team members and ask them to join this team when they register for the event.",
						type: "success",
						confirmButtonText: "OK",
						confirmButtonColor: "#202729"
					});
					$('.cart-actions').html(templates.subscribed.replace('$id', id));
				} else {
					swal({
						title: "Successful",
						text: "Event added to cart !",
						type: "success",
						confirmButtonText: "OK",
						confirmButtonColor: "#202729"
					});
				}
				$('.cart-actions').html(templates[isFree ? "subscribed" : "pending"].replace('$id', id).replace('$isFree', isFree));
			} else {
				failAlert(res);
			}
		}).fail(failAlert);
	};

	var joinTeam = function (button, id, isFree) {

		swal({
				title: "Join Team",
				text: "If someone from your team has already registered, ask them for the Team ID",
				type: "input",
				showCancelButton: true,
				closeOnConfirm: false,
				animation: "slide-from-top",
				inputPlaceholder: "Enter the Team ID",
				confirmButtonColor: "#202729",
				confirmButtonText: "Join",
				showLoaderOnConfirm: true
			},
			function (inputValue) {
				if (inputValue === false) return false;

				if (inputValue === "") {
					swal.showInputError("You need to write something!");
					return false;
				}

				$.ajax({
					method: "POST",
					url: "/api/events/jointeam",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Client", "Fest-Manager/dash");
					},
					data: {
						id: inputValue
					},
				}).done(function (res) {
					if (res.status == 200) {
						swal({
							title: "Successful",
							text: "You joined the team",
							type: "success",
							confirmButtonText: "OK",
							confirmButtonColor: "#202729"
						});
						$('.cart-actions').html(templates[isFree ? "subscribed" : "pending"].replace('$id', id).replace('$isFree', isFree));
					} else {
						failAlert(res);
					}
				}).fail(failAlert);
			});
	};

	var deleteFromCart = function (button, id, isFree) {

		$.ajax({
			method: "POST",
			url: "/api/events/deletefromcart",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Client", "Fest-Manager/dash");
			},
			data: {
				id: id
			},
		}).done(function (res) {
			if (res.status == 200) {
				swal({
					title: "Successful",
					text: "Event removed from cart !",
					type: "success",
					confirmButtonText: "OK",
					confirmButtonColor: "#202729"
				});
				var teamed = $('.open-event').attr('team') == "true";
				$('.cart-actions').html(templates[(teamed ? "teamed" : "single")].replace('$id', id).replace('$isFree', isFree));
			} else {
				failAlert(res);
			}
		}).fail(failAlert);
	};
	return {
		add: addToCart,
		join: joinTeam,
		remove: deleteFromCart,
	};
}();
