'use strict';

(function() {
    let client = Object.assign($('.window'),{
        activeRoute: '/',
        header: $('.window > .topbar'),
        main: $('.window > .remnant > .main'),
        navigation: $('.window > .remnant > .sidebar'),
        _token: null 
    });
    client.route = function(route) {
        if (route[0] != '/')
            route = '/' + route;
        $.ajax({
            url: 'http://localhost:3000/inner' + route,
            dataType: 'html',
            contentType: 'application/json'
        }).done(function(data){
            this.activeRoute = 'route';
            this.main.html(data);
            this.main.stageEventHandlers();
        }.bind(this));
    };

    $.prototype.stageEventHandlers = function() {
        $(this).find('[href]').click(function(e) {
            
        });
    }

    client.main.stageEventHandlers = function() {
        $(this).find('a').click(function(e) {
            let url = $(this).attr('href');
            if (url[0] != '/')
                url = '/' + url;
            if (url.split('/')[1] != 'auth') {
                e.preventDefault();
                client.route(url);
            }
            return true;
        });

    }

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

    client.navigation.stageEventHandlers = function() {
        $(this).find('[_route]').click(function(e) {
            client.route($(this).attr('_route'));
        })
    };

    client.nav.stageEventHandlers();
    client.route($('.window').attr('route'));

})();
