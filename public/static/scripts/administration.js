(function () {
	var portal = {
		user: null,
		setData: function (data) {
			$("#field-institute").val(data.institute);
			$("#field-name").val(data.name);
			$("#field-phone").val(data.phone);
			$("#field-email").val(data.email);
			$("#_portal .list input[type='checkbox']").prop('checked', false);
			$("#_portal .list .event").removeClass('registered');
			if (data.events)
				data.events.forEach(function (event) {
					$("#" + event).prop('checked', true);
					$("#" + event + " + .event").addClass('registered');
				});
		},
		findOrCreate: function (email) {
			$.ajax({
				type: "POST",
				url: "/api/users/check",
				data: {
					email: email,
				},
				headers: {
					"Client": "Fest-Manager/dash"
				}
			}).done(function (data) {
				portal.setData(data);
				portal.user = data;
				portal.events.push(portal.user.events);
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
			portal.user.events = portal.events.get();
			$.ajax({
				type: "PUT",
				url: "/api/users/force",
				headers: {
					"Client": "Fest-Manager/dash"
				},
				data: {
					user: portal.user
				}
			}).done(function (data, textStatus, req) {
				swal({
					title: "Update Successful",
					type: "success",
					confirmButtonText: "OK",
					confirmButtonColor: "#202729"
				});
				$('#_portal').removeClass('saving');
			}).fail(function (err) {
				swal({
					title: "Update Failed",
					text: "Something went wrong. Please try again.",
					type: "error",
					confirmButtonText: "OK",
					confirmButtonColor: "#202729"
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
			portal.events = {
				list: {}
			}; // implementing a set with Object
			portal.events.push = function (arr) {
				portal.events.list = {};
				arr.forEach(function (item) {
					portal.events.list[item] = true;
				});
			};
			portal.events.get = function () {
				var arr = [];
				for (var key in portal.events.list) {
					arr.push(key);
				}
				return arr;
			};

			$('#field-key').on('keydown', function (e) {
				if (e.keyCode == 13 || e.which == 13 || e.keyCode == 9 || e.which == 9)
					portal.findOrCreate($(this).val());
			});
			$('#details input').on('change', function () {
				if (portal.user) {
					portal.user[this.id.replace("field-", "")] = $(this).val();
				}
			});
			$('#tickets input').on('change', function () {
				if (portal.user) {
					if ($(this).is(':checked'))
						portal.events.list[this.id] = true;
					else
					if (portal.events.list[this.id])
						delete portal.events.list[this.id];
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
})();
