(function () {
	var portal = $("#_portal");

    var description = new SimpleMDE({
        element: $("#field-description")[0],
        toolbar: false,
        status: false
    });

	portal.find('.controls .icon-add').click(function () {
        portal.find(".edit_item").removeClass('collapsed');
        $(".latent").addClass("active");
        $(".icon-add").addClass("disabled");
    })

    portal.find('.controls .icon-close').click(function() {
        portal.find(".edit_item").addClass('collapsed');
        $(".latent").removeClass("active");
        $(".icon-add").removeClass("disabled");
    })

})();
