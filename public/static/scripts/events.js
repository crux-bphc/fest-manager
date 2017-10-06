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
		$(this).addClass("active").siblings().removeClass("active");
	});

	window.onhashchange = function () {
		if(window.location.hash == "#Workshop") {
			$('.tsbutton').removeClass('hidden');
			console.log("Tsbutton");
		}
		else $('.tsbutton').addClass('hidden');
		if (window.location.hash.length > 1) {
			var selector = '.event-container.' + window.location.hash.substring(1);
			$('.event-container').addClass("disabled");
			$(selector).removeClass('disabled');
			console.log("Hash:", window.location.hash);
		} else {
			$('.event-container').removeClass("disabled");
		}
	};

	implementSearch();
});
