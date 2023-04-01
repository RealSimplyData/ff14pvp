const util = {};

// Converts a number (132) to a string (2 hours 12 minutes); Does not show hours if 0; Also show days if > 24 hours; use short = true to show 1d 2h 12m instead of 2 hours 12 minutes
util.numberToReadableDuration = function (number, short = false) {
	const days = Math.floor(number / 1440);
	const hours = Math.floor((number % 1440) / 60);
	const minutes = Math.floor(number % 60);
	let str = "";
	if (days > 0) {
		str += `${days}${short ? "d" : " day"}${days == 1 || short ? "" : "s"} `;
	}
	if (hours > 0) {
		str += `${hours}${short ? "h" : " hour"}${hours == 1 || short ? "" : "s"} `;
	}
	if (minutes > 0 || (hours == 0 && days == 0)) {
		str += `${minutes}${short ? "m" : " minute"}${minutes == 1 || short ? "" : "s"} `;
	}
	return str.trim();
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

// turns a 0-1 float into a 0-100% string, accepts a floating point value (50.12572 becomes 50.13% if floatingPoint = 2)
util.floatToPercent = function (float, floatingPoint = 0) {
	return `${(float * 100).toFixed(floatingPoint)}%`;
}

// get the value of an input element, parameters are the id of the element, the type to cast to, and the default value if the value is undefined or fails to parse
util.getInputValue = function (id, cast = "string", defaultValue = undefined) {
	const value = document.getElementById(id).value;
	if (value == undefined) {
		return defaultValue;
	}
	let castValue = value;

	switch (cast) {
		case "string":
			castValue = value;
			break;
		case "number":
			castValue = parseInt(value);
			break;
		case "boolean":
			castValue = value == "true";
			break;
		default:
			castValue = value;
			break;
	}

	if (castValue == undefined || (cast == "number" && isNaN(castValue))) {
		return defaultValue;
	}

	return castValue;
}