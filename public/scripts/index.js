var manager = function () {
	let client;
	client = Object.assign($('.window'), {
		header: $('.window > .navbar'),
		main: $('.window > .remnant > .main'),
		navigation: $('.window > .remnant > .sidebar'),
		state: {
			location: "",
			navbar: {},
			sidebar: {
				menu: {},
			},
			user: {},
			submenu: {},
			title: "",
		}
	});
	let anchor = function(e) {
		client.route($(this).attr("_route"));
	};
	let outerAnchor = function (e) {
		window.location.assign($(this).attr("href"));
	};
	client.route = function (route, status = true) {
		$('.window > .remnant').removeClass('shift_to_expose_menu');
		if (route[0] != '/')
			route = '/' + route;
		route = '/components' + route;
		if (route == this.state.location) return;
		client.addClass('loading');
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
			this.setState(data.state);
			var tray = this.main.find('.tray');
			tray.html(data.html);
			tray.ready(function () {
				tray.removeClass('tray').addClass('face').siblings().removeClass('face').addClass('tray');
				window.setTimeout(function () {
					$('.main .tray').html('');
				}, 500);
				client.removeClass('loading');
			});
			this.navigation.generateSubMenu(data.state);
			this.main.initialize();
			this.main.stageEventHandlers();
			this.main.focus();
		}.bind(this));
	};

	client.setState = function (state) {
		const diff = DeepDiff(state, this.state);
		// console.log(diff);
		this.state = state;
		if(diff.length)
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

	client.navigation.generateSubMenu = function (state) {
		var holder = $('.section.secondary');
		if (!state.submenu.length > 0) {
			holder.removeClass('active');
			return;
		}
		holder.addClass('active');
		holder.find('label').text(state.title.text);
		holder.find('label').attr('_route', state.title.route)
		holder.find('ul').empty();
		state.submenu.forEach(function (menuitem) {
			var htmlstring = '<li';
			if (menuitem.route) {
				htmlstring += ' _route="' + menuitem.route + '"';
			}
			htmlstring += '>' + '<i></i>';
			if (menuitem.label) {
				htmlstring += '<span>' + menuitem.label + '</span>';
			}
			htmlstring += "</li>";
			holder.find('ul').append(htmlstring);
		});
		client.navigation.find(".secondary").initialize();
	}

	client.stageEventHandlers = function () {
		this.initialize();
		this.main.stageEventHandlers();
		this.header.stageEventHandlers();
	}

	client.main.stageEventHandlers = function () {
		$(".shift_to_expose_menu > .main").on('click', function () {
			$(".window > .remnant").removeClass("shift_to_expose_menu");
		});
	}
	client.navigation.stageEventHandlers = function () {
		$(this).find('[href]').click(outerAnchor);
		$(this).find('[_route]').click(anchor);
	};
	client.header.stageEventHandlers = function () {
		$('#menu').click(function () {
			$(".window > .remnant").toggleClass("shift_to_expose_menu");
			if ($(".window > .remnant").hasClass("shift_to_expose_menu")) {
				$(".sidebar").focus();
				client.main.stageEventHandlers();
			}
			$(".navbar .icon-close").click(function () {
				window.history.back();
			});
		})
	}

	window.addEventListener('popstate', function (e) {
		client.route(e.state, false);
	});

	$.prototype.initialize = function () {
		$(this).find('[href]').click(outerAnchor);
		$(this).find('[_route]').click(anchor);
	};

	document.body.onload = function () {
		client.stageEventHandlers();
		client.route($('.window').attr('route'));
	};

	// if ('serviceWorker' in navigator) {
	// 	window.addEventListener('load', function () {
	// 		navigator.serviceWorker.register('/sw.js').then(function (registration) {
	// 			console.log('ServiceWorker registration successful with scope: ', registration.scope);
	// 		}, function (err) {
	// 			// registration failed :(
	// 			console.log('ServiceWorker registration failed: ', err);
	// 		});
	// 	});
	// }

	return {
		route: client.route.bind(client),
	}
}();
