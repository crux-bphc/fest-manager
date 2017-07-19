function imgCropInit(data) {
    var editor = '#image-editor-' + data.id;
    $.uploadPreview({
        input_field: "#" + data.input,
        preview_box: "#" + data.preview,
        success_callback: function() {
            $(editor).parent().addClass("filled");
        },
        uploadFile: function(result) {
            console.log("Uploading", (data.id ? "hero-" : "thumb-") + globalEventID);
            $.ajax({
                url: "/upload/base64img",
                method: "POST",
                data: {
                    file_name: (data.id ? "hero-" : "thumb-") + globalEventID,
                    data: result
                }
            }).done(function(response) {
                $(editor).find('.status i').attr('class','').addClass('icon-check');
                $(editor).find('.status').attr('title','Upload succeeded');
                $(editor).find('.status').addClass("success");
            }).fail(function(jqxhr, textStatus, err) {
                $(editor).find('.status').attr('title','Upload failed');
                $(editor).find('.status i').attr('class','').addClass('icon-close');
                $(editor).find('.status').addClass("success");
            });
        }
    });
}