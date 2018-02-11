//Snowscape
(function () {
	var snowscape = document.getElementById("snowscape");
	var ctx = snowscape.getContext('2d');
	var WIDTH, HEIGHT, TIME = 0,
		POPULATION = 150;
	var SNOW = [];
	var resize = function () {
		snowscape.width = window.innerWidth;
		snowscape.height = window.innerHeight;
	}
	resize();

	var Snowflake = function () {
		var flake;
		if (Math.random() < 0.5)
			flake = {
				alpha: Math.random() * 0.5 + 0.1,
				x: Math.random() * window.innerWidth,
				y: 0,
				z: Math.random() * Math.random() * 50 + 10,
			};
		else
			flake = {
				alpha: Math.random() * 0.5 + 0.1,
				x: window.innerWidth,
				y: Math.random() * window.innerHeight,
				z: Math.random() * Math.random() * 50 + 10,
			};
		return flake;
	}
	for (i = 0; i < POPULATION; i++) {
		SNOW.push(Snowflake());
	}
	var update = function () {
		TIME++;
		for (i = 0; i < POPULATION; i++) {
			SNOW[i].x -= 50 / SNOW[i].z;
			SNOW[i].y += 50 / SNOW[i].z;
			if (SNOW[i].x < 0 || SNOW[i].y > window.innerHeight)
				SNOW[i] = Snowflake();
			draw(i);
		}
	}
	var draw = function (i) {
		ctx.fillStyle = (Math.random()<0.25?"rgb(176,135,83)":"rgb(255,255,255)");
		ctx.globalAlpha = SNOW[i].alpha;
		ctx.beginPath();
		ctx.arc(SNOW[i].x, SNOW[i].y, 30 / SNOW[i].z, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
	}

	var animate = function () {
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		update();
		requestAnimationFrame(animate);
	}
	// animate();
	window.onresize = resize();
})();

(function(){
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
	},1000);
})();
