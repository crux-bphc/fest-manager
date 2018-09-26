let london = (function (){
    console.log('in home js');
    var currentPage = 0;
    let maxLength = 4;
    
    let showNextPage = ()=>{
        //console.log('insShowNextPage',getTargetHeight(currentPage));
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
            showNextPage();
        }
        if(e.which === 38) {
            console.log('event-up-key');
            showPreviousPage();
        }  
    });
    function mouseWheelWrapper() {
    $(window).bind("mousewheel", function(e) {
        console.log(e.originalEvent.deltaY);
         (function scroll() {
            if(e.originalEvent.wheelDelta < 0) {
                //scroll down
                showNextPage();
                console.log('Down');
            } else {
                //scroll up
                console.log('Up');
                showPreviousPage();
            }
         })();
         
         $(window).unbind("mousewheel");//unbinding to restrict one scroll to showing one page.
         setTimeout(mouseWheelWrapper, 700);
         return false;
         
      });
    }
    mouseWheelWrapper();

})();
