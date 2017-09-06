function delete_from_cart(id, event){
	$.ajax({
		method: "POST",
		url: "/api/events/deletefromcart",
		beforeSend: function(xhr){
			xhr.setRequestHeader("Client", "Fest-Manager/dash");
		},
		data: {
			id: id
		},
		success: function(res){
			if(res.status == 200)
			{
				swal({
					title: "Successful",
					text: "Event removed from cart !",
					type: "success",
					confirmButtonText: "OK",
					confirmButtonColor: "#202729"
				});
				manager.refresh();
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