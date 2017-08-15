var manager = function() {
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
    let outerAnchor = function(e) {
        return true;
    };
    client.getLocation = function() {
        return client.state.location;
    }
    client.refresh = function() {
        client.route(client.state.location, true, true);
    }
    client.route = function(route, status = true, reload = false) {
        if (window.innerWidth < 800)
            $('.window > .remnant').removeClass('shift_to_expose_menu');
        if (!route) return;
        if (route.startsWith("http")) {
            window.open(route, '_blank');
            return;
        }
        if (route[0] != '/')
            route = '/' + route;
        if (route.indexOf('/components') == -1)
            route = '/components' + route;
        if (route == this.state.location && !reload) return;
        client.oldroute = this.state.location;
        client.addClass('loading');
        $.ajax({
            type: 'GET',
            url: route,
            dataType: 'json',
            async: true,
            contentType: 'text/plain',
            beforeSend: function(request) {
                request.setRequestHeader("Client", "Fest-Manager/dash");
            }
        }).done(function(data, textStatus, req) {
            var url = data.state.location.replace('/components', '');
            if (status)
                window.history.pushState(url, "", url);
            this.activeRoute = route;
            this.setState(data.state);
            if ($('.window').hasClass('immersive')) $('.window > .remnant').removeClass("shift_to_expose_menu");
            var tray = this.main.find('.tray');
            tray.html(data.html);
            tray.ready(function() {
                tray.removeClass('tray').addClass('face').siblings().removeClass('face').addClass('tray');
                $('.main .face').scrollTop(0);
                $('.scrollable').enscroll({
                    showOnHover: true,
                    verticalTrackClass: 'enscroll-track',
                    verticalHandleClass: 'enscroll-handle'
                },function(data){
                	console.log("Me called!",data);
                });

                window.setTimeout(function() {
                    $('.main .tray').html('');
                    $('.enscroll-track').each(function(i, item) {
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
        }.bind(this));
    };

    client.setState = function(state) {
        const diff = DeepDiff(state, this.state);
        // console.log(diff);
        this.state = state;
        if (diff)
            diff.forEach(function(change) {
                var trigger = change.path.join('/');
                // console.log('trigger:', trigger);
                $target = $("[_triggers*='" + trigger + "']");
                $target.each(function() {
                    var arr = $(this).attr('_triggers').split(' ');
                    var triggerelem = arr.find(function(elem) {
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

    client.navigation.setTitle = function(state) {
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
    }

    client.navigation.generateSubMenu = function(state) {
        var holder = $('.section.secondary');
        if (!state.submenu.length > 0) {
            holder.removeClass('active');
            return;
        }
        holder.addClass('active');
        holder.find('label').text(state.title.text);
        holder.find('label').attr('_route', state.title.route)
        holder.find('ul').empty();
        state.submenu.forEach(function(menuitem) {
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

    client.stageEventHandlers = function() {
        this.initialize();
        this.main.stageEventHandlers();
        this.header.stageEventHandlers();
    }

    client.main.stageEventHandlers = function() {
        $(".shift_to_expose_menu > .main").on('click', function() {
            $(".window > .remnant").removeClass("shift_to_expose_menu");
        });
    }
    client.navigation.stageEventHandlers = function() {
        $(this).find('[href]').click(outerAnchor);
        $(this).find('[_route]').click(anchor);
    };
    client.header.stageEventHandlers = function() {
        $('#menu').click(function() {
            $(".window > .remnant").toggleClass("shift_to_expose_menu");
            if ($(".window > .remnant").hasClass("shift_to_expose_menu")) {
                $(".sidebar").focus();
                client.main.stageEventHandlers();
            }
        });
        $(".navbar .icon-close").click(function() {
            var routeto = client.oldroute || '/about';
            client.route(routeto);
        });
    }

    window.addEventListener('popstate', function(e) {
        client.route(e.state, false);
    });

    $.prototype.initialize = function() {
        $(this).find('[href]').click(outerAnchor);
        $(this).find('[_route]').click(anchor);
    };

    document.body.onload = function() {
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
        refresh: client.refresh.bind(client),
        getLocation: client.getLocation.bind(client)
    }
}();