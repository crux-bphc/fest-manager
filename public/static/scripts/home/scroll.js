$(document).ready(()=>{
  // Start Animation onScroll for tickets
  console.log('workinggg.');
  var elems = ['.container2 .top', '.bottom', '.yr', '.nm', '.tickets'];

  // var $elem = $(e);
  var inview1 = new Waypoint.Inview({
    element: $('.yr')[0],

    enter: function() {
      console.log('in enter');
      elems.forEach(function(e){
        // console.log("enter");
        $(e).addClass('start');
      })
    }
    // exited: function() {
    //   // console.log("exit");
    //   elems.forEach(function(e){
    //     $(e).removeClass('start');
    //   })
    // }
  })
  console.log(inview1)
  // Start Animation onScroll for aboutus
  var inview2 = new Waypoint.Inview({
    element: $('.para3')[0],

    enter: function() {
      elems.forEach(function(e){
        // console.log("enter");
        $('#building').addClass('start');
        $('#background').addClass('start');
        $('#Content-flex').addClass('start');
      })
    },
    exited: function() {
      // console.log("exit");
      elems.forEach(function(e){
        $('#building').removeClass('start');
        $('#background').removeClass('start');
        $('#Content-flex').removeClass('start');
      })
    }

  })
})
