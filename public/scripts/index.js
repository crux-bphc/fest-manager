'use strict';

(function() {
    let client = Object.assign($('.window'), {
        activeRoute: '/',
        header: $('.window > .topbar'),
        main: $('.window > .remnant > .main'),
        navigation: $('.window > .remnant > .sidebar')
    });
    client.route = function(route, status = true) {
        client.addClass('loading');
        window.setTimeout(function() {
            client.removeClass('loading');
        }, 2000);
        if (route[0] != '/')
            route = '/' + route;
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000' + route,
            dataType: 'html',
            contentType: 'application/json',
            beforeSend: function(request) {
                request.setRequestHeader("Client", "Fest-Manager/dash");
            }
        }).done(function(data, textStatus, req) {
            let url = req.getResponseHeader('Location');
            if (status)
                window.history.pushState(url, "", req.getResponseHeader('Location'));
            this.activeRoute = route;
            this.main.html(data);
            $("[_route='" + this.main.find('.meta').attr("_routed_at") + "']").addClass('active').siblings().removeClass('active');
            this.main.initialize();
            this.main.stageEventHandlers();
        }.bind(this));
    };

    $.prototype.initialize = function() {
        $(this).find('[href]').click(function(e) {
            window.location.assign($(this).attr("href"));
        });
        $(this).find('[_route]').click(function(e) {
            client.route($(this).attr('_route'));
            $(this).addClass('active').siblings().removeClass('active');
        })
    }

    client.main.stageEventHandlers = function() {}
    client.navigation.stageEventHandlers = function() {};
    client.header.stageEventHandlers = function() {
        $('#fullscreen').click(function() {
            let $icon = $(this).find('[class*="icon-"]');
            if ($icon.hasClass('icon-call_made')) {
                $icon.removeClass('icon-call_made').addClass('icon-call_received');
                $('.window').addClass('fullsize');
            } else {
                $icon.removeClass('icon-call_received').addClass('icon-call_made');
                $('.window').removeClass('fullsize');
            }
        });
    }

    window.addEventListener('popstate', function(e) {
        client.route(e.state, false);
    });

    client.initialize();
    client.navigation.stageEventHandlers();
    client.header.stageEventHandlers();
    client.route($('.window').attr('route'));

})();
