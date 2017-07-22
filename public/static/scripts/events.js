$('document').ready(function () {
	// TODO: Handle events page sorting and filtering here.

	var implementSearch = function(){
		$('input#field-search').bind('keyup change', function(e) {
			val = $('input#field-search').val().toLowerCase();
			var matched = 0;
			$('div.event-container').each(function (index) {
				var elem = this;
				$(elem).addClass('hidden');
				var fields = [];
				fields.push($(elem).find('span.tag').text().toLowerCase());
				fields.push($(elem).find('h3.name').text().toLowerCase());
				fields.push($(elem).find('span.tagline').text().toLowerCase());
				fields.forEach(function (field, index) {
					if (field.indexOf(val) != -1) {
						$(elem).removeClass('hidden');
						matched += 1;
					}
				});
			});
		});
	};

	$('.section.tags a').click(function() {
		$(this).addClass("active").siblings().removeClass("active");
	});

	document.body.onhashchange = function() {
		if(window.location.hash.length > 1) {
			var selector = 'div.event-container.' + window.location.hash.substring(1);
			$('div.event-container').addClass("disabled");
			$(selector).removeClass('disabled');
		}
		else {
			$('div.event-container').removeClass("disabled");
		}
	}

	implementSearch();
})

function add_to_cart(id) {

	$.ajax({
		method: "POST",
		url: "/api/events/addtocart",
		beforeSend: function(xhr){
			xhr.setRequestHeader("Client", "Fest-Manager/dash");
		},
		data: {
			id: id
		},
		success: function(res){
			if(res.status == 200)
			{
				if(typeof res.teamID !== 'undefined')
				{
					swal({
						title: "Successful",
						text: "Event added to cart ! Your team ID is " + res.teamID,
						type: "success",
						confirmButtonText: "OK",
						confirmButtonColor: "#202729"
					});
				}
				else
				{
				swal({
						title: "Successful",
						text: "Event added to cart !",
						type: "success",
						confirmButtonText: "OK",
						confirmButtonColor: "#202729"
					});}
			}
			else
			{
				swal({
					title: "Failed !",
					text: res.msg,
					type: "error",
					confirmButtonText: "OK",
					confirmButtonColor: "#202729"
				});
			}
		}
	});
};

function join_team(id){

	swal({
	  title: "Join Team",
	  text: "Enter the team id to proceed",
	  type: "input",
	  showCancelButton: true,
	  closeOnConfirm: false,
	  animation: "slide-from-top",
	  inputPlaceholder: "Team ID",
	  confirmButtonColor: "#202729",
	  confirmButtonText: "Join",
	  showLoaderOnConfirm: true
	},
	function(inputValue){
	  if (inputValue === false) return false;

	  if (inputValue === "") {
	    swal.showInputError("You need to write something!");
	    return false
	  }

	  if(inputValue.length != 24) {
	    swal.showInputError("Enter a valid 24 character team ID");
	    return false
	  }

	  $.ajax({
		method: "POST",
		url: "/api/events/jointeam",
		beforeSend: function(xhr){
			xhr.setRequestHeader("Client", "Fest-Manager/dash");
		},
		data: {
			id: inputValue
		},
		success: function(res){
			if(res.status == 200)
			{
				swal({
					title: "Successful",
					text: "You joined the team",
					type: "success",
					confirmButtonText: "OK",
					confirmButtonColor: "#202729"
				});
			}
			else
			{
				swal({
					title: "Failed !",
					text: res.msg,
					type: "error",
					confirmButtonText: "OK",
					confirmButtonColor: "#202729"
				});
			}
		}
	});
});
};