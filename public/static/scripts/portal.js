var globalEventID = Date.now();
var currentEditable;
var description;
var portal;
(function () {
	portal = $("#_portal");
	portal.simpleTextFields = ["name", "tagline", "category", "tickets", "type", "venue", "startTime", "endTime", "price", "prize", "route", "teamSize"];
	description = new SimpleMDE({
		element: $("#field-description")[0],
		toolbar: false,
		status: false
	});
	portal.find('.controls .icon-check').click(function () {
		$("form.container").submit();
	});
})();


$("form.container").submit(function (event) {
	if (!this.checkValidity()) {
		$(this).find(":invalid").first().focus();
		var invalid = $(this).find(":invalid");
		var text = "Fix following fields:";
		for (var i = 0; i < invalid.length; i++) {
			text = text + " " + invalid[i].id.split('-', 2)[1];
		}
		text += ".";
		swal({
			title: "Form Validation Error",
			text: text,
			type: "error",
		});
		return event.preventDefault();
	}
	submit_item();
	closeEditor();
});

var implementSearch = function () {
	$('input#field-search').bind('keyup change', function (e) {
		val = $('input#field-search').val().toLowerCase();
		var matched = 0;
		$('.item').not('.head').each(function (index) {
			var elem = this;
			$(elem).addClass('hidden');
			var fields = [];
			fields.push($(elem).find('.title').text().toLowerCase());
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

function closeEditor() {
	portal.find(".edit_item").addClass('collapsed');
	$(".latent").removeClass("active");
	$(".icon-add").removeClass("disabled");
}

function formEditor(data) {
	if (data) {
		console.log(data);
		if (data.about)
			description.value(data.about);
		else
			description.value("");
		portal.simpleTextFields.forEach(function(field) {
			if(data[field] != null)
				$('#field-' + field).val(data[field]);
			else
				$('#field-' + field).val("");
		});
		if (data.thumbnail) {
			$('#image-editor-0').parent().addClass('filled');
			$('#image-editor-0').attr('value', data.thumbnail);
			$('#cropit-preview-0').css({
				'background-image': 'url("' + data.thumbnail + '")'
			});
		} else {
			$('#image-editor-0').attr('value', "");
			$('#cropit-preview-0').css({
				'background-image': 'none'
			});
			$('#image-editor-0').parent().removeClass('filled');
		}
		if (data.hero) {
			$('#image-editor-1').attr('value', data.hero);
			$('#image-editor-1').parent().addClass('filled');
			$('#cropit-preview-1').css({
				'background-image': 'url("' + data.hero + '")'
			});
		} else {
			$('#image-editor-1').attr('value', "");
			$('#image-editor-1').parent().removeClass('filled');
			$('#cropit-preview-1').css({
				'background-image': 'none'
			});
		}
	} else {
		description.value("");
		portal.simpleTextFields.forEach(function(field) {
			$('#field-' + field).val("");
		})
		$('#image-editor-0').parent().removeClass("filled");
		$('#image-editor-0').attr('value', "");
		$('#cropit-preview-0').css("background-image", "none");
		$('#image-editor-1').parent().removeClass("filled");
		$('#image-editor-1').attr('value', "");
		$('#cropit-preview-1').css("background-image", "none");
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
		beforeSend: function (request) {
			request.setRequestHeader("Client", "Fest-Manager/dash");
		}
	}).done(function (data) {
		formEditor(data);
		$('.main .face').scrollTop(0);
	});
	currentEditable = id;
}

function submit_item() {
	var url, method, body = {};
	if (currentEditable) {
		url = manager.getLocation() + "/edit";
		body._id = currentEditable;
	} else {
		url = manager.getLocation() + "/add";
	}
	if ($('#image-editor-0').attr("value") != "")
		body.thumbnail = $('#image-editor-0').attr("value");
	if ($('#image-editor-1').attr("value") != "")
		body.hero = $('#image-editor-1').attr("value");
	body.about = description.value();
	portal.simpleTextFields.forEach(function(field) {
		body[field] = $('#field-' + field).val();
	});
	body.price = $("#field-price").val() == "" ? 0 : Number.parseInt($('#field-price').val());
	body.teamSize = $("#field-teamSize").val() == "" ? 1 : Number.parseInt($('#field-teamSize').val());
	$.ajax({
		method: "POST",
		url: url,
		data: body,
		beforeSend: function (request) {
			request.setRequestHeader("Client", "Fest-Manager/dash");
		}
	}).done(function (data, textStatus, request) {
		// manager.refresh();
	});
}
