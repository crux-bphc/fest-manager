var globalEventID = Date.now();
var currentEditable;
var description;
(function() {
    portal = $("#_portal");

    description = new SimpleMDE({
        element: $("#field-description")[0],
        toolbar: false,
        status: false
    });
    portal.find('.controls .icon-check').click(function() {
        submit_item();
        closeEditor();
    });
})();

function closeEditor() {
    portal.find(".edit_item").addClass('collapsed');
    $(".latent").removeClass("active");
    $(".icon-add").removeClass("disabled");
}

function formEditor(data) {
    if (data) {
        if (data[0].about)
            description.value(data[0].about);
        else
            description.value("");
        if (data[0].name)
            $('#field-title').val(data[0].name);
        else
            $('#field-title').val("");
        if (data[0].tagline)
            $('#field-tagline').val(data[0].tagline);
        else
            $('#field-tagline').val("");
        if (data[0].category)
            $('#field-category').val(data[0].category);
        else
            $('#field-category').val("");
        if (data[0].type)
            $('#field-type').val(data[0].type);
        else
            $('#field-type').val("");
        if (data[0].venue)
            $('#field-venue').val(data[0].venue);
        else
            $('#field-venue').val("");
        if (data[0].startTime)
            $('#field-starttime').val(data[0].startTime);
        else
            $('#field-starttime').val("");
        if (data[0].endTime)
            $('#field-endtime').val(data[0].endTime);
        else
            $('#field-endtime').val("");
        if (data[0].price)
            $('#field-price').val(data[0].price);
        else
            $('#field-price').val("");
        if (data[0].contact)
            $('#field-contact').val(data[0].contact);
        else
            $('#field-contact').val("");
        if (data[0].route)
            $('#field-route').val(data[0].route);
        else
            $('#field-route').val("");
        if (data[0].teamSize != null)
            $('#field-teamSize').val(data[0].teamSize);
        else
            $('#field-teamSize').val("");
        if (data[0].thumbnail) {
            $('#image-editor-0').parent().addClass('filled');
            $('#image-editor-0').attr('value',data[0].thumbnail);
            $('#cropit-preview-0').css({'background-image':'url("'+data[0].thumbnail+'")'});
        }
        else {
            $('#image-editor-0').attr('value',"");
            $('#cropit-preview-0').css({'background-image':'none'});
            $('#image-editor-0').parent().removeClass('filled');
        }
        if (data[0].hero){
            $('#image-editor-1').attr('value',data[0].hero);
            $('#image-editor-1').parent().addClass('filled');
            $('#cropit-preview-1').css({'background-image': 'url("' + data[0].hero + '")'});
        }
        else {
            $('#image-editor-1').attr('value',"");
            $('#image-editor-1').parent().removeClass('filled');
            $('#cropit-preview-1').css({'background-image':'none'});
        }
    } else {
        description.value("");
        $('#field-title').val("");
        $('#field-tagline').val("");
        $('#field-category').val("");
        $('#field-type').val("");
        $('#field-venue').val("");
        $('#field-starttime').val("");
        $('#field-endtime').val("");
        $('#field-price').val("");
        $('#field-contact').val("");
        $('#field-route').val("");
        $('#field-teamSize').val("");
        $('#image-editor-0').parent().removeClass("filled");
        $('#image-editor-0').attr('value',"");
        $('#cropit-preview-0').css("background-image","none");
        $('#image-editor-1').parent().removeClass("filled");
        $('#image-editor-1').attr('value',"");
        $('#cropit-preview-1').css("background-image","none");
        currentEditable = null;
    }
    $('.edit_item').removeClass('collapsed');
    $('.latent').addClass('active');
    $(".icon-add").addClass("disabled");
}

function edit_item(id) {
    $.ajax({
        method: 'GET',
        url: '/api/events/' + id,
        beforeSend: function(request) {
            request.setRequestHeader("Client", "Fest-Manager/dash");
        }
    }).done(function(data) {
        formEditor(data);
        $('.main .face').scrollTop(0);
    });
    currentEditable = id;
}

function submit_item() {
    var url, method, body = {};
    if(currentEditable) {
        url = manager.getLocation() + "/edit"
        body._id = currentEditable;
    }
    else {
        url = manager.getLocation() + "/add"
    }
    if($('#image-editor-0').attr("value") != "")
        body.thumbnail = $('#image-editor-0').attr("value");
    if($('#image-editor-1').attr("value") != "")
        body.hero = $('#image-editor-1').attr("value");
    body.about = description.value();
    body.name = $('#field-title').val();
    body.tagline = $('#field-tagline').val();
    body.category = $('#field-category').val();
    body.startTime = $('#field-starttime').val();
    body.endTime = $('#field-endtime').val();
    body.type = $('#field-type').val();
    body.venue = $('#field-venue').val();
    body.contact = $('#field-contact').val();
    body.route = $('#field-route').val();
    body.price = $("#field-price").val() == "" ? 0 : Number.parseInt($('#field-price').val());
    body.teamSize = $("#field-teamSize").val() == "" ? 1 : Number.parseInt($('#field-teamSize').val());
    $.ajax({
        method: "POST",
        url: url,
        data: body,
        beforeSend: function(request) {
            request.setRequestHeader("Client", "Fest-Manager/dash");
        }
    }).done(function(data, textStatus, request) {
        // manager.refresh();
    })
}