var manager = function () {
	let client;
	client = Object.assign($('.window'), {
		header: $('.window > .topbar'),
		main: $('.window > .remnant > .main'),
		navigation: $('.window > .remnant > .sidebar'),
		state: {
			location: "/components/dashboard",
			navbar: {},
			sidebar: {
				menu: {},
			},
			user: {},
		}
	});
	client.route = function (route, status = true) {
		client.addClass('loading');
		if (route[0] != '/')
			route = '/' + route;
		route = '/components' + route;
		$.ajax({
			type: 'GET',
			url: route,
			dataType: 'json',
			async: true,
			contentType: 'text/plain',
			beforeSend: function (request) {
				request.setRequestHeader("Client", "Fest-Manager/dash");
			}
		}).done(function (data, textStatus, req) {
			var url = data.state.location.replace('/components', '');
			if (status)
				window.history.pushState(url, "", url);
			this.activeRoute = route;
			var tray = this.main.find('.tray');
			tray.html(data.html);
			tray.ready(function () {
				tray.removeClass('tray').addClass('face').siblings().removeClass('face').addClass('tray');
				window.setTimeout(function () {
					$('.main .tray').html('');
				}, 500);
				client.removeClass('loading');
			});
			this.setState(data.state);
			this.main.initialize();
			this.main.stageEventHandlers();
		}.bind(this));
	};

	client.setState = function (state) {
		const diff = DeepDiff(state, this.state);
		// console.log(diff);
		this.state = state;
		diff.forEach(function (change) {
			var trigger = change.path.join('/');
			// console.log('trigger:', trigger);
			$target = $("[_triggers*='" + trigger + "']");
			$target.each(function () {
				var arr = $(this).attr('_triggers').split(' ');
				var triggerelem = arr.find(function (elem) {
					return elem.split('=')[0] == trigger;
				});
				if (triggerelem) {
					if (change.lhs) {
						$(this).addClass(triggerelem.split('=')[1]);
					} else {
						$(this).removeClass(triggerelem.split('=')[1]);
					}
				}
			});
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

	$.prototype.initialize = function () {
		$(this).find('[href]').click(function (e) {
			window.location.assign($(this).attr("href"));
		});
		$(this).find('[_route]').click(function (e) {
			if (!$(this).hasClass('active'))
				client.route($(this).attr('_route'));
		})
	};

	document.body.onload = function () {
		client.stageEventHandlers();
		client.route($('.window').attr('route'));
	};

	if ('serviceWorker' in navigator) {
		window.addEventListener('load', function () {
			navigator.serviceWorker.register('/sw.js').then(function (registration) {				
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			}, function (err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			});
		});
	}
	return {
		route: client.route.bind(client),
	}
}();
