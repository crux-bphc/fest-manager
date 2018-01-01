(function(){
    $('#submit').click(function () {
        if (!manager.validateForm()) {
            return;
        }
        var data = {};
        $('form input').each(function(i, item){
            data[$(item).attr('id').replace('field-','')] = $(item).val();
        });
        $.ajax({
            url: $('form').attr('route'),
            method: 'POST',
            data: data,
        }).done(function(response){
            swal("Response recorded!");
            $('form input').val('');
        }).fail(function(err){
            swal("Some error occurred. Try again.");
        });
    });
})();