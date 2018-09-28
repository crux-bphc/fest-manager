$(document).ready(function() {
    $('ul > li.list-inline-item').on('click', function(e) {
        $(this).children('a')[0].click();
    });
});