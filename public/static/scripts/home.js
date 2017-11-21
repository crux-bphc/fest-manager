var countDownDate = new Date("Jan 25, 2018 00:00:00").getTime();

	// Update the count down every 1 second
var x = setInterval(function() {

  	// Get todays date and time
	var now = new Date().getTime();

	// Find the distance between now an the count down date
	var distance = countDownDate - now;

	// Time calculations for days, hours, minutes and seconds
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Display the result in the element with id="cnt*"
	document.getElementById("cntDay").innerHTML = ("0" + days).slice(-2) + "D";
	document.getElementById("cntHrs").innerHTML = ("0" + hours).slice(-2) + "H";
	document.getElementById("cntMin").innerHTML = ("0" + minutes).slice(-2) + "M";
	document.getElementById("cntSec").innerHTML = ("0" + seconds).slice(-2) + "S";

	// If the count down is finished, write some text 
	if (distance < 0) {
	clearInterval(x);
	document.getElementById("container").innerHTML = "EXPIRED";
	}
}, 1000);