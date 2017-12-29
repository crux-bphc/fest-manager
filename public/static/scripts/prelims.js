(function(){
    $('#submit').click(function () {
        if (!manager.validateForm()) {
            return;
        }
        var data = {};
        $('form input').each(function(i, item){
            data[$(item).attr('id').replace('field-','')] = $(item).val();
        });
        console.log(data);
        $.ajax({
            url: $('form').attr('route'),
            method: 'POST',
            data: data,
        }).done(function(response){
            console.log(response);
        });
    });
})();