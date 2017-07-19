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
    portal.find('.controls .icon-add').click(function() {
        formEditor();
    });
    portal.find('.controls .icon-check').click(function() {
        submit_item();
        closeEditor();
    });
    portal.find('.controls .icon-autorenew').click(function() {
        manager.refresh();
    })
    portal.find('.controls .icon-close').click(function() {
        closeEditor();
    })
})();

function closeEditor() {
    portal.find(".edit_item").addClass('collapsed');
    $(".latent").removeClass("active");
    $(".icon-add").removeClass("disabled");
}

function formEditor(data) {
    console.log(data);
    if (data) {
        if (data[0].about)
            description.value(data[0].about);
        if (data[0].name)
            $('.edit_item #field-title').val(data[0].name);
        if (data[0].tagline)
            $('.edit_item #field-tagline').val(data[0].tagline);
        if (data[0].category)
            $('.edit_item #field-category').val(data[0].category);
        if (data[0].type)
            $('.edit_item #field-type').val(data[0].type);
        if (data[0].venue)
            $('.edit_item #field-venue').val(data[0].venue);
        if (data[0].startTime)
            $('.edit_item #field-starttime').val(data[0].startTime);
        if (data[0].endTime)
            $('.edit_item #field-endtime').val(data[0].endTime);
        if (data[0].price)
            $('.edit_item #field-price').val(data[0].price);
        if (data[0].contact)
            $('.edit_item #field-contact').val(data[0].contact);
        if (data[0].thumbnail) {
            globalEventID = data[0].thumbnail.split('-')[1];
            console.log('/data/images/' + data[0].thumbnail + '.jpg');
            $('#cropit-preview-0').css({'background-image':'/data/images/' + data[0].thumbnail + '.jpg'});
        }
        if (data[0].hero)
            $('#cropit-preview-1').css({'background-image': '/data/images/' + data[0].cover + '.jpg'});
        currentEditable = data[0]._id;
    } else {
        $('.edit_item #field-description').val("");
        $('.edit_item #field-title').val("");
        $('.edit_item #field-tagline').val("");
        $('.edit_item #field-category').val("");
        $('.edit_item #field-type').val("");
        $('.edit_item #field-venue').val("");
        $('.edit_item #field-starttime').val("");
        $('.edit_item #field-endtime').val("");
        $('.edit_item #field-price').val("");
        $('.edit_item #field-contact').val("");
        globalEventID = Date.now();
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
    });
}

function submit_item() {
    var url, method, body = {};
    if(currentEditable) {
        url = manager.getLocation() + "/edit"
        body.id = currentEditable;
    }
    else {
        url = manager.getLocation() + "/add"
    }
    body.thumbnail = "thumb-" + globalEventID;
    body.hero = "hero-" + globalEventID;
    body.about = description.value();
    body.name = $('#field-title').val();
    body.tagline = $('#field-tagline').val();
    body.category = $('#field-category').val();
    body.startTime = $('#field-starttime').val();
    body.endTime = $('#field-endtime').val();
    body.type = $('#field-type').val();
    body.venue = $('#field-venue').val();
    body.contact = $('#field-contact').val();
    console.log(body);
    $.ajax({
        method: "POST",
        url: url,
        data: body,
        beforeSend: function(request) {
            request.setRequestHeader("Client", "Fest-Manager/dash");
        }
    }).done(function(data, textStatus, request) {
        manager.refresh();
    })
}