function imgCropInit(data) {
    var editor = '#image-editor-' + data.id;
    $.uploadPreview({
        input_field: "#" + data.input,
        preview_box: "#" + data.preview,
        success_callback: function() {
            $(editor).parent().addClass("filled");
        },
        uploadFile: function(result) {
            $.ajax({
                url: "/upload/base64img",
                method: "POST",
                data: {
                    file_name: "hero-9163131232",
                    data: result
                },
                success: function(response) {
                    $(editor).find('.status').addClass("success");
                }
            });
        }
    })

}