(function () {
	window.setInterval(function () {
		var countDownDate = new Date("Mar 23, 2018 00:00:00").getTime();
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
		$(".countdown .days").html(("0" + days).slice(-2));
		$(".countdown .seconds").html(("0" + seconds).slice(-2));
		$(".countdown .minutes").html(("0" + minutes).slice(-2));
		$(".countdown .hours").html(("0" + hours).slice(-2));
	}, 1000);
})();

// Fetch porn from reddit
(function () {
	let index = ~~(Math.random() * slideshow.length);
	let switcher = function () {
		index = (index + 1) % slideshow.length;
		$('.background > .tray')
			.css({
				'background-image': 'url(' + slideshow[index].image + ')'
			})
			.removeClass('tray').addClass('face')
			.siblings().removeClass('face').addClass('tray');
	};
	switcher();
	setInterval(switcher, 8000);
})();
