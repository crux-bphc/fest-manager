let london = (function (){
    console.log('in home js');
    var currentPage = 0;
    let maxLength = 4;
    
    let showNextPage = ()=>{
        //console.log('insShowNextPage',getTargetHeight(currentPage));
        if(currentPage < maxLength)
            currentPage++;
        $('.scroll-wrapper').css('transform', 'translateY('+ -currentPage * window.innerHeight +'px)');
    };

    let showPreviousPage = ()=>{
        //console.log('inShowPreviousPage',getTargetHeight(currentPage));
        if(currentPage > 0)
            currentPage--;
        $('.scroll-wrapper').css('transform', 'translateY('+  -currentPage * window.innerHeight +'px)');
    };
    $(window).keydown(function(e) {
        console.log('window-event');
        
        if(e.which === 40) {
            console.log('event'+currentPage);
            if(currentPage == 0)
            {   
                $('#page-2 .places .top').addClass('start');
                $('#page-2 .places .bottom').addClass('start');
                $('#page-2 .places .yr').addClass('start');
                $('#page-2 .places .nm').addClass('start');
                $('#page-2 .places .tickets').addClass('start');
            }
            if(currentPage == 1) {
                $('#page-3 #background').addClass('start');
                $('#page-3 #background #building').addClass('start');
                $('#page-3 #background #content-flex').addClass('start');
            }
            showNextPage();
        }
        if(e.which === 38) {
            console.log('event-up-key');
            showPreviousPage();
        }  
    });
    // catching-scroll
    $('#page-2').bind('inview', function (event, visible, topOrBottomOrBoth) {
        console.log('catch-scroll');
        if (visible == true) {
            $('#page-2 .places .top').addClass('start');
            $('#page-2 .places .bottom').addClass('start');
            $('#page-2 .places .yr').addClass('start');
            $('#page-2 .places .nm').addClass('start');
            $('#page-2 .places .tickets').addClass('start');
          // element is now visible in the viewport
          if (topOrBottomOrBoth == 'top') {
            $('#page-2 .places .top').addClass('start');
            $('#page-2 .places .bottom').addClass('start');
            $('#page-2 .places .yr').addClass('start');
            $('#page-2 .places .nm').addClass('start');
            $('#page-2 .places .tickets').addClass('start');
            // top part of element is visible
          } else if (topOrBottomOrBoth == 'bottom') {
            // bottom part of element is visible
          } else {
            // whole part of element is visible
          }
        } else {
          // element has gone out of viewport
        }
      });


})();
