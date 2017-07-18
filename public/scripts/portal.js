(function () {
	var portal = $("#_portal");


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
