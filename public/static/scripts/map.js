function initialize() {
  var bphcloc = {lat: 17.5448948, lng: 78.5715885 }; 
  map = new google.maps.Map(document.getElementById('map'), {
    center: bphcloc,
    zoom: 7
  });
}