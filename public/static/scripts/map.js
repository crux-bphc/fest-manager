var map, currentPosition, infoWindow;
function initialize() {
  var bphcloc = {lat: 17.5418622, lng: 78.5747197 }; 
  map = new google.maps.Map(document.getElementById('map'), {
    center: bphcloc,
    zoom: 7
  });
  var bitsmarker = new google.maps.Marker({
  	position: bphcloc,
  	map: map,
  	title: 'BITS Hyderabad',
  	label: 'B'
  })


  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log(pos);
          map.setCenter(pos);
          currentPosition = new google.maps.Marker({
            position: pos,
            map: map,
            title:"You are Here!",
            animation: google.maps.Animation.DROP
          });
      }, function() {
        handleLocationError(true, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map.getCenter());
    }


}

function handleLocationError(browserHasGeolocation, pos) {
    infoWindow = new google.maps.InfoWindow;
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
