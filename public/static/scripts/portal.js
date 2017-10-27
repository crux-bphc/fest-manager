var globalEventID = Date.now();
var currentEditable;
var description;
(function () {
	portal = $("#_portal");

	description = new SimpleMDE({
		element: $("#field-description")[0],
		toolbar: false,
		status: false
	});
	portal.find('.controls .icon-check').click(function () {
		submit_item();
		closeEditor();
	});
})();

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
		if (data.about)
			description.value(data.about);
		else
			description.value("");
		if (data.name)
			$('#field-title').val(data.name);
		else
			$('#field-title').val("");
		if (data.tagline)
			$('#field-tagline').val(data.tagline);
		else
			$('#field-tagline').val("");
		if (data.category)
			$('#field-category').val(data.category);
		else
			$('#field-category').val("");
		if (data.type)
			$('#field-type').val(data.type);
		else
			$('#field-type').val("");
		if (data.venue)
			$('#field-venue').val(data.venue);
		else
			$('#field-venue').val("");
		if (data.startTime)
			$('#field-starttime').val(data.startTime);
		else
			$('#field-starttime').val("");
		if (data.endTime)
			$('#field-endtime').val(data.endTime);
		else
			$('#field-endtime').val("");
		if (data.price)
			$('#field-price').val(data.price);
		else
			$('#field-price').val("");
		if (data.prize)
			$('#field-prize').val(data.prize);
		else
			$('#field-prize').val("");
		if (data.route)
			$('#field-route').val(data.route);
		else
			$('#field-route').val("");
		if (data.teamSize != null)
			$('#field-teamSize').val(data.teamSize);
		else
			$('#field-teamSize').val("");
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
		$('#field-title').val("");
		$('#field-tagline').val("");
		$('#field-category').val("");
		$('#field-type').val("");
		$('#field-venue').val("");
		$('#field-starttime').val("");
		$('#field-endtime').val("");
		$('#field-price').val("");
		$('#field-prize').val("");
		$('#field-route').val("");
		$('#field-teamSize').val("");
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
	body.name = $('#field-title').val();
	body.tagline = $('#field-tagline').val();
	body.category = $('#field-category').val();
	body.startTime = $('#field-starttime').val();
	body.endTime = $('#field-endtime').val();
	body.type = $('#field-type').val();
	body.venue = $('#field-venue').val();
	body.route = $('#field-route').val();
	body.prize = $('#field-prize').val();
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
