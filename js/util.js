const util = {};

// Converts a number (132) to a string (2 hours 12 minutes); Does not show hours if 0
util.numberToReadableDuration = function (number) {
	const hours = Math.floor(number / 60);
	const minutes = number % 60;

	if (hours == 0) {
		return `${minutes} minutes`;
	} else {
		return `${hours} hours ${minutes} minutes`;
	}
}

// cast is a string (string, number, boolean) that will cast the value to the specified type
util.getLocalStorage = function (key, cast = "string", defaultValue = undefined) {
	const value = localStorage.getItem(key);
	if (value == undefined) {
		return defaultValue;
	}
	switch (cast) {
		case "string":
			return value;
		case "number":
			return parseInt(value);
		case "boolean":
			return value == "true";
		default:
			return value;
	}
}