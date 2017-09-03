var RegisterButton = function() {
    var templates = {
        teamed: '<div class="latent" tabindex="1"><div class="cartButton add_to_cart"><i class="icon-add_shopping_cart"></i><span>Register</span></div><div class="cartButton join_team" onclick="RegisterButton.join(this, \'$id\')"><i class="icon-group_add"></i><span>Join Team</span></div><div class="cartButton new_team" onclick="RegisterButton.add(this, \'$id\')"><i class="icon-add_box"></i><span>New Team</span></div></div>',
        single: '<div class="cartButton add_to_cart" onclick="RegisterButton.add(this, \'$id\')"><i class="icon-add_shopping_cart"></i><span>Register</span></div>',
        subscribed: '<div class="cartButton subscribed" onclick="RegisterButton.remove(this, \'$id\')"><i class="icon-check"></i><span>Registered</span></div>'
    }

    var addToCart = function(button, id) {

        $.ajax({
            method: "POST",
            url: "/api/events/addtocart",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Client", "Fest-Manager/dash");
            },
            data: {
                id: id
            },
            success: function(res) {
                if (res.status == 200) {
                    if (typeof res.teamID !== 'undefined') {
                        swal({
                            title: "Successful",
                            text: "Event added to cart! Your team ID is " + res.teamID,
                            type: "success",
                            confirmButtonText: "OK",
                            confirmButtonColor: "#202729"
                        });
                        $('.cart-actions').html(templates.subscribed.replace('$id', id));
                    } else {
                        swal({
                            title: "Successful",
                            text: "Event added to cart !",
                            type: "success",
                            confirmButtonText: "OK",
                            confirmButtonColor: "#202729"
                        });
                    }
                    $('.cart-actions').html(templates.subscribed.replace('$id', id));
                } else {
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

    var joinTeam = function(button, id) {

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
            function(inputValue) {
                if (inputValue === false) return false;

                if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false
                }

                $.ajax({
                    method: "POST",
                    url: "/api/events/jointeam",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Client", "Fest-Manager/dash");
                    },
                    data: {
                        id: inputValue
                    },
                    success: function(res) {
                        if (res.status == 200) {
                            swal({
                                title: "Successful",
                                text: "You joined the team",
                                type: "success",
                                confirmButtonText: "OK",
                                confirmButtonColor: "#202729"
                            });
                            $('.cart-actions').html(templates.subscribed.replace('$id', id));
                        } else {
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

    var deleteFromCart = function(button, id) {

        $.ajax({
            method: "POST",
            url: "/api/events/deletefromcart",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Client", "Fest-Manager/dash");
            },
            data: {
                id: id
            },
            success: function(res) {
                if (res.status == 200) {
                    swal({
                        title: "Successful",
                        text: "Event removed from cart !",
                        type: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#202729"
                    });
                    var teamed = $('.open-event').attr('team') == "true";
                    $('.cart-actions').html(templates[(teamed ? "teamed" : "single")].replace('$id', id));
                } else {
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
    return {
        add: addToCart,
        join: joinTeam,
        remove: deleteFromCart,
    }
}();