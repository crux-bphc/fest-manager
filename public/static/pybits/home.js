$('document').ready(function() {
    var options = {
        strings: [
            "Conference^1000",
            "Workshops^1000",
            "Code Sprints^1000",
        ],
        typeSpeed: 50,
        smartBackspace: true,
        loop: true,
    }
    var typed = new Typed('#typedholder', options);

    // Allow selecting only one of the event combos at a time.
    window.addEventListener('fm-add-cart', function(event){
        $('.button-wrapper').addClass('hidden');
        $('#' + event.detail).closest('.button-wrapper').removeClass('hidden');
    });
    window.addEventListener('fm-remove-cart', function(event){
        $('.button-wrapper').removeClass('hidden');
    });
});
