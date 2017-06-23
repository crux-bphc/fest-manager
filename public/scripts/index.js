'use strict';

(function () {
  let client = Object.assign($('.window'), {
    activeRoute: '/',
    header: $('.window > .topbar'),
    main: $('.window > .remnant > .main'),
    navigation: $('.window > .remnant > .sidebar')
  });
  client.route = function (route, status = true) {
    client.addClass('loading');
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
      $(this).addClass('active').siblings().removeClass('active');
    })
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
    console.log("Hey");
    client.initialize();
    client.navigation.stageEventHandlers();
    client.header.stageEventHandlers();
    client.route($('.window').attr('route'));
  }
})();
