(function() {
	var count = document.getElementById('count');
	var time = function() {
		count.innerHTML = Math.ceil((Date.parse('10-27-2017') - Date.now())/(24*3600*1000));
	}
	time();
	window.setInterval(time,60000);
})();