var dustlist = ['.dust-one', '.dust-two', '.dust-three'];

dustlist.forEach(l=>{
  var $dust = $(l);
  var X = parseInt($dust.css('left'),10);
  var Y = parseInt($dust.css('top'),10);

  $(window).on('resize', ()=>{
    X = parseInt($dust.css('left'),10);
    Y = parseInt($dust.css('top'),10);
  })

  // console.log(X + " " + Y);
  $('.container1').mousemove(e=>{
    // console.log(e.pageX + " " + e.pageY);
    switch(l){
      case '.dust-one':$dust.css({'left':X + (X-e.pageX)/200, 'top':Y + (Y - e.pageY)/200});break;
      case '.dust-two':$dust.css({'left':X + (e.pageX-X)/300, 'top':Y + (e.pageY-Y)/300});break;
      case '.dust-three':$dust.css({'left':X + (e.pageX-X)/80, 'top':Y + (e.pageY-Y)/80});break;
    }
  })

})
