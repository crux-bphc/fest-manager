var map, currentPosition, infoWindow;
function initialize() {
  var bphcloc = {lat: 17.5435, lng: 78.575 }; 
  map = new google.maps.Map(document.getElementById('map'), {
    center: bphcloc,
    zoom: 17
  });
  // var bitsmarker = new google.maps.Marker({
  // 	position: bphcloc,
  // 	map: map,
  // 	title: 'BITS Hyderabad',
  // 	label: 'B'
  // })

}
