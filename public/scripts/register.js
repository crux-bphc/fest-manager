// AJAX call for autocomplete 
$(document).ready(function () {
	$("#institute-search-box").keyup(function () {
		$.ajax({
			type: "GET",
			url: "/api/typeahead/institutes/" + $(this).val(),
			headers: {
				"Client": "Fest-Manager/dash"
			},
			beforeSend: function () {
				$("#institute-search-box").css("background", "#cff");
			},
			success: function (data) {
				console.log(data);
				$("#institute-search-box").css("background", "#fff");
				for (i = 0; i < 10; i++) {
					$("#institute-list option").eq(i).attr("value", data[i] || "");
				}
			}
		});
	});
});
