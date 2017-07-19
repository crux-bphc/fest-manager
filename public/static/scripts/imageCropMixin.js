function imgCropInit(data)
{
    $("#cropit-preview-" + data.id).css("width", data.width);
    $("#cropit-preview-" + data.id).css("height", data.height);

    $('#image-editor-' + data.id).cropit({
      exportZoom: 1.25,
      imageBackground: true,
      imageBackgroundBorderWidth: 20,
    });

    $('#rotate-cw-' + data.id).click(function() {
      $('#image-editor-' + data.id).cropit('rotateCW');
    });
    $('#rotate-ccw-' + data.id).click(function() {
      $('#image-editor-' + data.id).cropit('rotateCCW');
    });

    $('#export-img-' + data.id).click(function() {
      var imageData = $('#image-editor-' + data.id).cropit('export');
      $.ajax({
        url: "/upload/base64img",
        method: "POST",
        data: {
          file_name: data.file_name,
          data: imageData
        },
        success: function(response){
          $("#imgCrop-response-" + data.id).html("Upload Status : " + response.status);
        }
      });
    });
}