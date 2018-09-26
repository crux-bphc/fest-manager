$('.gradient').mouseenter((e)=>{
  // console.log(e.target);
  switch(e.target.id){
    case 'event-grad':
      $('#event-grad').css({'opacity':1});
      $('#event-link').addClass('hovered'); break;
    case 'competition-grad':
      $('#competition-grad').css({'opacity':1});
      $('#competition-link').addClass('hovered'); break;
    case 'talk-grad':
      $('#talk-grad').css({'opacity':1});
      $('#talk-link').addClass('hovered'); break;
  }
})

$('.gradient').mouseleave((e)=>{
  // console.log(e.target);
  switch(e.target.id){
    case 'event-grad':
      $('#event-grad').css({'opacity':0});
      $('#event-link').removeClass('hovered'); break;
    case 'competition-grad':
      $('#competition-grad').css({'opacity':0});
      $('#competition-link').removeClass('hovered'); break;
    case 'talk-grad':
      $('#talk-grad').css({'opacity':0});
      $('#talk-link').removeClass('hovered'); break;
  }
})
