$(document).ready(function () {
    $(".loading-wrapper").fadeOut();
    updateDate();
    setInterval(updateDate, 1000 * 60);

    // $('#learn-more').on('click', function () {
    //     console.log("Scrolling");
    //     $("#about-us").smoothScroll();
    // })



})

$(window).load(function() {
    $(".loading-wrapper").fadeOut();
    console.log("Loaded");
    // page is fully loaded, including all frames, objects and images , not working ( why ? );
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


