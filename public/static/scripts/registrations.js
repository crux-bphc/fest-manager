$('document').ready(function () {
	var portal = {
		user: null,
		setData: function (data) {
			$("#field-festID").val(data.festID);
			$("#field-institute").val(data.institute);
			$("#field-name").val(data.name);
			$("#field-phone").val(data.phone);
			$("#field-email").val(data.email);
			$("#field-referred_by").val(data.referred_by);
		},
		findOrCreate: function (email) {
			$.ajax({
				type: "POST",
				url: "/api/users/check",
				data: {
					filter: {
						email: email,
					},
					else: {
						email: email
					},
				},
				headers: {
					"Client": "Fest-Manager/dash"
				}
			}).done(function (data) {
				portal.setData(data);
				portal.user = data;
				$('.controls > li').removeClass('disabled');
			}).catch(function (err) {
				swal({
					type: 'error',
					title: 'User not found',
					msg: err
				});
				portal.reset();
			});
		},
		update: function () {
			$('#_portal').addClass('saving');
			if (!manager.validateForm() || !portal.user) {
				return;
			}
			$.ajax({
				type: "PUT",
				url: "/api/users/generate",
				headers: {
					"Client": "Fest-Manager/dash"
				},
				data: {
					user: portal.user
				}
			}).done(function (data) {
				swal({
					title: "Atmos ID - " + data.festID,
					type: "success",
					msg: (data.waive ? "Registration Free" : "Collect 150"),
					confirmButtonText: "OK",
					confirmButtonColor: "#202729"
				});
				$('#_portal').removeClass('saving');
			}).fail(function (err) {
				swal({
					title: "Update Failed",
					text: "Duplicate Fest ID. Please change and try again.",
					type: "error",
					confirmButtonText: "OK",
					confirmButtonColor: "#202729",
				});
				$('#_portal').removeClass('saving').addClass('failed');
				window.setTimeout(function () {
					$('#_portal').removeClass('failed');
				}, 1000);
			});
		},
		reset: function () {
			portal.user = null;
			portal.setData({});
			portal.events.push([]);
			$('.controls > li').addClass('disabled');
		},
		init: function () {
			var collect = function () {
				if ($('#field-key').val().indexOf('@') == -1)
					$('#field-key').val($('#field-key').val() + "@bits-atmos.org");
				portal.findOrCreate($('#field-key').val());
			};
			$('#field-key').on('keydown', function (e) {
				if (e.keyCode == 13 || e.which == 13 || e.keyCode == 9 || e.which == 9)
					collect();
			});
			$('#keysubmit').click(collect);
			$('#details input').on('change', function () {
				if (portal.user) {
					portal.user[this.id.replace("field-", "")] = $(this).val();
				}
			});
			$('#reset-button').click(function () {
				portal.reset();
				$('.controls > li').addClass('disabled');
			});
			$('#submit-button').click(portal.update);
		},
	};
	portal.init();
});
