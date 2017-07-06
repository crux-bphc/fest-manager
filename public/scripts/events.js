$('document').ready(function() {
    $('.event-container').click(function() {
        $('.events-wrapper').addClass('blur');
        $(this).addClass('active');
        $('.open-event').addClass('focus');
    });
    $('.open-event > .icon-close').click(function() {
        $('.events-wrapper').removeClass('blur');
        $('.event-container.active').removeClass('active');
        $('.open-event').removeClass('focus');
    });
})
