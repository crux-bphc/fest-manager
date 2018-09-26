let london = (function (){
    console.log('in home js');
    var currentPage = 1;
    let scrollDiv = $('.hash-home');
    let getTargetHeight = (page)=>{   
        return page*window.innerHeight;
    };

    let maxLength = 5;
    
    let showNextPage = ()=>{
        console.log('insShowNextPage',getTargetHeight(currentPage));
        if(currentPage < maxLength)
            currentPage++;
        $('.scroll-wrapper').css('transform', 'translateY('+ -currentPage * window.innerHeight +'px)');
    };

    let showPreviousPage = ()=>{
        console.log('inShowPreviousPage',getTargetHeight(currentPage));
        if(currentPage > 1)
            currentPage--;
        $('.scroll-wrapper').css('transform', 'translateY('+  -currentPage * window.innerHeight +'px)');
    };
    
    $(window).keydown(function(e) {
        console.log('window-event');
        if(e.which === 40) {
            console.log('event');
            showNextPage();
            
        }
        if(e.which === 38) {
            console.log('event-up-key');
            showPreviousPage();
        }  
    });
    
    return {
        showNextPage : showNextPage,
        showPreviousPage: showPreviousPage
    };
})();
