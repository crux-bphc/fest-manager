(function () {
	let client;
	client = Object.assign($('.window'), {
		header: $('.window > .topbar'),
		main: $('.window > .remnant > .main'),
		navigation: $('.window > .remnant > .sidebar'),
		state: {
			isAuthenticated: false,
			location: "/components/dashboard",
			navbar: {},
			sidebar: {}
		}
	});
	client.route = function (route, status = true) {
		client.addClass('loading');
		console.log('routing to' + route);
		window.setTimeout(function () {
			client.removeClass('loading');
		}, 1000);
		if (route[0] != '/')
			route = '/' + route;
		route = '/components' + route;
		$.ajax({
			type: 'GET',
			url: route,
			dataType: 'json',
			contentType: 'text/plain',
			beforeSend: function (request) {
				request.setRequestHeader("Client", "Fest-Manager/dash");
			}
		}).done(function (data, textStatus, req) {
			let url = req.getResponseHeader('Location');
			if (status)
				window.history.pushState(url, "", data.state.location.replace('/components', ''));
			this.activeRoute = route;
			this.main.html(data.html);
			this.setState(data.state);
			$("[_route='" + this.main.find('.meta').attr("_routed_at") + "']").addClass('active').siblings().removeClass('active');
			this.main.initialize();
			this.main.stageEventHandlers();
		}.bind(this));
	};

	$.prototype.initialize = function () {
		$(this).find('[href]').click(function (e) {
			window.location.assign($(this).attr("href"));
		});
		$(this).find('[_route]').click(function (e) {
			client.route($(this).attr('_route'));
		})
	}

	client.setState = function (state) {
		const diff = DeepDiff(state, this.state);
		// console.log(diff);
		this.state = state;
		diff.forEach(function (change) {
			$target = $("[_trigger='" + change.path.join('/') + "']");
			if (change.lhs)
				$target.addClass($target.attr('_class_on_true'));
			else
				$target.removeClass($target.attr('_class_on_true'));
		});
	}

	client.stageEventHandlers = function () {
		this.initialize();
		this.main.stageEventHandlers();
		this.navigation.stageEventHandlers();
		this.header.stageEventHandlers();
	}

	client.main.stageEventHandlers = function () {
		$(".shift_to_expose_menu > .main").on('click', function () {
			$(".window > .remnant").removeClass("shift_to_expose_menu");
		})
	}
	client.navigation.stageEventHandlers = function () {};
	client.header.stageEventHandlers = function () {
		$('#menu').click(function () {
			$(".window > .remnant").toggleClass("shift_to_expose_menu");
			if ($(".window > .remnant").hasClass("shift_to_expose_menu")) {
				$(".sidebar").focus();
				client.main.stageEventHandlers();
			}
		})
	}

	window.addEventListener('popstate', function (e) {
		client.route(e.state, false);
	});

	document.body.onload = function () {
		client.stageEventHandlers();
		client.route($('.window').attr('route'));
	}
})();
