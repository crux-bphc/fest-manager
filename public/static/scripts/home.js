(function() {
	var countDownDate = new Date("Jan 25, 2018 00:00:00").getTime();
  	// Get todays date and time
	var now = new Date().getTime();

	// Find the distance between now an the count down date
	var distance = countDownDate - now;

	// Time calculations for days, hours, minutes and seconds
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));

	// Display the result in the element with id="cnt*"
	$(".countdown .days").html(("0" + days).slice(-2));
})();