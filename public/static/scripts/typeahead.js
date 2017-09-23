var Typeahead = function () {
	var search = function (elem, name) {
		$.ajax({
			type: "GET",
			url: "/api/typeahead/" + name + '/' + $(elem).val(),
			headers: {
				"Client": "Fest-Manager/dash"
			},
			success: function (data) {
				$(elem).autocomplete({
					minLength: 0,
					source: function (request, response) {
						response(data);
					},
				});
			}
		});
	};

	return {
		search: search,
	};
}();
