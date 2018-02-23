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

function shuffle(arra1) {
	let ctr = arra1.length;
	let temp;
	let index;

	// While there are elements in the array
	while (ctr > 0) {
		// Pick a random index
		index = Math.floor(Math.random() * ctr);
		// Decrease ctr by 1
		ctr--;
		// And swap the last element with it
		temp = arra1[ctr];
		arra1[ctr] = arra1[index];
		arra1[index] = temp;
	}
	return arra1;
}

// Fetch porn from reddit
(function () {
	let index = ~~(Math.random() * slideshow.length);
	let loadedData = [];
	let initLoad = function () {
		slideshow = shuffle(slideshow);
		var promises = [];
		const options = {
			method: 'GET',
			mode: 'no-cors'
		};
		slideshow.forEach(elem => {
			var myelem = Object.assign({}, elem);
			var promise = fetch(elem.image, options).then(data => {
				myelem.data = data;
				loadedData.push(myelem);
				console.log("Loaded:", myelem.image);
				if (loadedData.length == 3) {
					console.log("Images Loaded: 3. Starting the shit show.");
					startShow();
				}
				return Promise.resolve();
			}).catch(err => {
				console.error(err);
				return Promise.resolve();
			});
			promises.push(promise);
		});
		return Promise.all(promises);
	};
	let switcher = function () {
		let newIndex = (index + ~~(Math.random() * 10)) % loadedData.length;
		if (newIndex == index) index++;
		else index = newIndex;
		$('.background > .tray')
			.css({
				'background-image': 'url(' + loadedData[index].image + ')'
			})
			.removeClass('tray').addClass('face')
			.siblings().removeClass('face').addClass('tray');
	};
	let startShow = function () {
		switcher();
		setInterval(switcher, 8000);
	}
	initLoad().then(data => {
		console.log("Images Loaded:", loadedData.length);
	})
})();
