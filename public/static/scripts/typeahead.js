var Typeahead = function() {
    var search = function(elem, name) {
        console.log("Typeahead Started", elem, name);
        console.log($(elem).val());
        $.ajax({
            type: "GET",
            url: "/api/typeahead/" + name + '/' + $(elem).val(),
            headers: {
                "Client": "Fest-Manager/dash"
            },
            success: function(data) {
                // console.log(data);
                $(elem).autocomplete({
                    minLength: 0,
                    source: function(request, response) {
                        response(data);
                    },
                });
            }
        });
    };

    return {
        search: search,
    }
}();