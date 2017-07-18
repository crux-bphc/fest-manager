$('document').ready(function () {
	// TODO: Handle events page sorting and filtering here.

	var implementSearch = function(){
		$('input#field-search').bind('keyup change', function(e) {
			val = $('input#field-search').val();
			$('div.event-container').each(function (index) {
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

	implementSearch();
})
