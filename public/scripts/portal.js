(function() {
    var portal = $("#_portal");

    portal.form = function() {
        portal.find(".add_new_item").toggleClass('collapsed');
        $(this).toggleClass('active');
    }
    portal.find('.controls .icon-add').click(portal.form)
})();
