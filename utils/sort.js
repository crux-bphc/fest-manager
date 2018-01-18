module.exports = (arr, param) => {
	// TODO convert numbers stored in strings to numbers before comparision.
	arr.sort((a, b) => {
		if (a[param] < b[param]) return -1;
		if (a[param] > b[param]) return 1;
		return 0;
	});
	return arr;
};
