$(document).ready(function () {
    updateDate();
    setInterval(updateDate, 1000 * 60);

    // $('#learn-more').on('click', function () {
    //     console.log("Scrolling");
    //     $("#about-us").smoothScroll();
    // })

})

$(document).ready(function () {
    // Add smooth scrolling to all links
    $("a").on('click', function (event) {

        // Make sure this.hash has a value before overriding default behavior
        if ($(this).data("hash") !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = $(this).data("hash");
            console.log(hash);

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});

function updateDate() {
    var deadline = new Date("October 18, 2019 07:00:00").getTime();
    // var dateUpdater = setInterval(function () {
    var now = new Date().getTime();
    var t = deadline - now;
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((t % (1000 * 60)) / 1000);
    $(".atmos-hours").html(hours);
    $(".atmos-minutes").html(minutes);
    $(".atmos-days").html(days);
    console.log("Updated");
}


