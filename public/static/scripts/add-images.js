$(document).ready(function() {
    $("#submit-button").on('click', function() {
        if(!$("#field-image").val()) {
            swal({
                title: "Please fill image",
                type: "error"
            });
        } else {
            $.ajax({
                    type: 'POST',
                    url: '/api/images',
                    data: {
                        album: $('#field-album-name').val(),
                        title: $('#field-title').val(),
                        subtitle: $('#field-subtitle').val() || "",
                        image: $("#field-image").val()
                    }
                }).done(function (data) {
                    swal({
                        title: "Successful",
                        type: "success",
                        confirmButtonText: "OK",
                    });
                }).fail(function (err) {
                    swal({
                        title: "Some error occurred",
                        text: JSON.stringify(err),
                        type: "error",
                        confirmButtonText: "OK",
                    });
            });
        }
    });

});