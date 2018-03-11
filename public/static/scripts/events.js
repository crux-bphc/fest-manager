$('document').ready(function () {
	// TODO: Handle events page sorting and filtering here.

	var implementSearch = function () {
		$('input#field-search').bind('keyup change', function (e) {
			val = $('input#field-search').val().toLowerCase();
			var matched = 0;
			$('.event-container').each(function (index) {
				var elem = this;
				$(elem).addClass('hidden');
				var fields = [];
				fields.push($(elem).find('span.tag').text().toLowerCase());
				fields.push($(elem).find('h3.name').text().toLowerCase());
				fields.push($(elem).find('span.tagline').text().toLowerCase());
				fields.forEach(function (field, index) {
					if (field.indexOf(val) != -1) {
						$(elem).removeClass('hidden');
						matched += 1;
					}
				});
			});
		});
	};

	$('.section.tags a').click(function () {
		if ($(this).hasClass('active')) {
			window.location.hash = "#Competition";
			$(this).removeClass('active');
			return;
		}
		$(this).addClass("active").siblings().removeClass("active");
		window.location.hash = $(this).attr("href").split('#')[1];
	});

	window.onhashchange = function () {
		if (window.location.hash.length > 1) {

			if (window.location.hash.startsWith("#Competition")) {
				$('.tags').css({
					display: 'flex'
				}).find('a');
			} else $('.tags').css({
				display: 'none'
			});

			var filters = window.location.hash.substring(1).split('/');
			var selector = '.event-container.' + filters.join('.');
			$('.catch-filters .active').removeClass('active');
			$('.catch-filters').find('.' + filters.join(',.')).addClass('active');
			$('.event-container').addClass("disabled");
			$(selector).removeClass('disabled');

		} else {
			$('.event-container').removeClass("disabled");
		}
	};

	implementSearch();
});
