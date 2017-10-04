var manager = function () {
	let client;
	client = Object.assign($('.window'), {
		header: $('.window > .navbar'),
		main: $('.window > .remnant > .main'),
		navigation: $('.window > .remnant > .sidebar'),
		hash: "",
		state: {
			location: "",
			navbar: {},
			sidebar: {
				menu: {},
			},
			user: {},
			submenu: {},
			title: "",
		},
	});
	let anchor = function (e) {
		if (
			e.ctrlKey ||
			e.shiftKey ||
			e.metaKey ||
			(e.button && e.button == 1) ||
			$(this).attr('absolute')
		) return;
		e.preventDefault();
		client.route($(this).attr("href"));
	};
	client.getLocation = function () {
		return client.state.location;
	};
	client.refresh = function () {
		client.route(client.state.location, true, true);
	};
	client.route = function (route, status = true, reload = false) {
		if (!route) return;
		if (route.startsWith("http")) {
			window.open(route, '_blank');
			return;
		}
		if (route[0] != '/')
			route = '/' + route;
		if (route.indexOf('/components') == -1)
			route = '/components' + route;
		if (route == this.state.location + (client.hash ? '#' + client.hash : "") && !reload) return;
		// If not the same route, apply following logic
		if (window.innerWidth < 800)
			$('.window > .remnant').removeClass('shift_to_expose_menu');
		if (!route) return;

		if (route.indexOf('#') != -1) {
			client.hash = route.split('#')[1];
			if (route.split('#')[0] == this.state.location) {
				window.location.hash = '#' + client.hash;
				return;
			}
		} else {
			client.hash = "";
		}
		client.oldroute = this.state.location;
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
				var url = data.state.location.replace('/components', '') + (client.hash ? '#' + client.hash : "");
				if (status)
					window.history.pushState(url, "", url);
				this.activeRoute = route;
				this.setState(data.state);
				if ($('.window').hasClass('immersive')) $('.window > .remnant').removeClass("shift_to_expose_menu");
				var tray = this.main.find('.tray');
				tray.html(data.html);
				tray.ready(function () {
					if (client.hash) {
						window.location.hash = '#' + client.hash;
						window.history.replaceState(url, "", url);
					}
					window.onhashchange();
					tray.removeClass('tray').addClass('face').siblings().removeClass('face').addClass('tray');
					$('.main .face').scrollTop(0);
					$('.scrollable').enscroll({
						showOnHover: true,
						verticalTrackClass: 'enscroll-track',
						verticalHandleClass: 'enscroll-handle'
					}, function (data) {});

					window.setTimeout(function () {
						$('.main .tray').html('');
						$('.enscroll-track').each(function (i, item) {
							$(item).parent().css('height', $(item).parent().prev('.scrollable').height());
							console.log("Item:", $(item).parent().prev('.scrollable'));
							console.log("Height:", $(item).parent().prev('.scrollable').height());
						});
					}, 500);
					client.removeClass('loading');
				});
				this.navigation.setTitle(data.state);
				this.navigation.generateSubMenu(data.state);
				this.main.initialize();
				this.main.stageEventHandlers();
				this.main.focus();
			}.bind(this))
			.fail(function (error) {
				manager.route('/404', false);
			});
	};

	client.setState = function (state) {
		const diff = DeepDiff(state, this.state);
		this.state = state;
		if (diff)
			diff.forEach(function (change) {
				var trigger = change.path.join('/');
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
	};

	client.navigation.setTitle = function (state) {
		var title = "Atmos"; // TODO remove the hardcoded fest name.
		if (state.pagetitle) {
			// title = state.pagetitle + " - " + title;
			title = state.pagetitle;
		}
		document.title = title;
		$('.navbar .subtitle').addClass('hidden');
		if (state.subtitle) {
			$('.navbar .subtitle').removeClass('hidden');
			$('.navbar .subtitle .text').text(state.subtitle);
		}
	};

	client.navigation.generateSubMenu = function (state) {
		var holder = $('.section.secondary');
		if (!state.submenu.length > 0) { // jshint ignore:line
			holder.removeClass('active');
			return;
		}
		holder.addClass('active');
		holder.find('.label').text(state.title.text);
		holder.find('.label').attr('href', state.title.route);
		holder.find('ul').empty();
		state.submenu.forEach(function (menuitem) {
			var htmlstring = '<a';
			if (menuitem.route) {
				htmlstring += ' href="' + menuitem.route + '"';
			}
			htmlstring += '>' + '<i></i>';
			if (menuitem.label) {
				htmlstring += '<span>' + menuitem.label + '</span>';
			}
			htmlstring += "</a>";
			holder.find('ul').append(htmlstring);
		});
		client.navigation.find(".secondary").initialize();
	};

	client.stageEventHandlers = function () {
		this.initialize();
		this.main.stageEventHandlers();
		this.header.stageEventHandlers();
	};

	client.main.stageEventHandlers = function () {
		$(".shift_to_expose_menu > .main").on('click', function () {
			$(".window > .remnant").removeClass("shift_to_expose_menu");
		});
	};
	client.navigation.stageEventHandlers = function () {
		$(this).find('a').click(anchor);
	};
	client.header.stageEventHandlers = function () {
		$('#menu').click(function () {
			$(".window > .remnant").toggleClass("shift_to_expose_menu");
			if ($(".window > .remnant").hasClass("shift_to_expose_menu")) {
				$(".sidebar").focus();
				client.main.stageEventHandlers();
			}
		});
		$(".navbar .icon-close").click(function () {
			var routeto = client.oldroute || '/about';
			client.route(routeto);
		});
	};

	window.onhashchange = function (event) {};

	window.addEventListener('popstate', function (event) {
		if (event.state === null) {
			event.preventDefault();
			return false;
		}
		client.route(event.state, false);
	});

	$.prototype.initialize = function () {
		$(this).find('[href]').click(anchor);
	};

	document.body.onload = function () {
		client.stageEventHandlers();
		var route = $('.window').attr('route');
		if (window.location.hash) route += (window.location.hash);
		client.route(route);
	};

	// Audio analyser resources
	var audio = {};
	audio.domElement = $('audio')[0];
	audiocontext = AudioContext || webkitAudioContext;
	audio.context = new audiocontext();
	audio.analyser = audio.context.createAnalyser();
	audio.analyser.fftSize = 256;
	audio.analyser.smoothingTimeConstant = 1;
	audio.dataArray = new Uint8Array(audio.analyser.frequencyBinCount);
	audio.gainNode = audio.context.createGain();
	audio.buffer = audio.context.createMediaElementSource(audio.domElement);
	audio.init = function () {
		audio.buffer.connect(audio.gainNode);
		audio.gainNode.connect(audio.analyser);
		audio.analyser.connect(audio.context.destination);
	};
	audio.update = function () {
		audio.analyser.getByteTimeDomainData(audio.dataArray);
		var sum = 0;
		for (i = 0; i < 5; i++) {
			sum += audio.dataArray[i];
		}
		sum /= 5;
		audio.high = sum;
	};

	// if ('serviceWorker' in navigator) {
	//  window.addEventListener('load', function () {
	//      navigator.serviceWorker.register('/sw.js').then(function (registration) {
	//          console.log('ServiceWorker registration successful with scope: ', registration.scope);
	//      }, function (err) {
	//          // registration failed :(
	//          console.log('ServiceWorker registration failed: ', err);
	//      });
	//  });
	// }
	function validateForm() {
		var formValid = true;
		$('form').each(function (index) {
			$(this).find("[required]").each(function (index) {
				if ($.trim($(this).val()) == '') {
					formValid = false;
					$(this).addClass('invalid');
					$(this).focus(function () {
						$(this).removeClass('invalid');
					});
				}
			});
		});
		return formValid;
	}

	return {
		validateForm: validateForm,
		route: client.route.bind(client),
		refresh: client.refresh.bind(client),
		getState: function () {
			return client.state;
		},
		getAudio: function() {
			return audio;
		},
		getLocation: client.getLocation.bind(client)
	};
}();
