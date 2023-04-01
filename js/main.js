const main = {
	showCrystallineConflict: util.getLocalStorage("show/crystallineConflict", "boolean", true),
	showRivalWings: util.getLocalStorage("show/rivalWings", "boolean", true),
	showFrontline: util.getLocalStorage("show/frontline", "boolean", true),
};

main.getRank = function () {
	const raw = document.getElementById("rank").value;
	const parsed = parseInt(raw);
	if (parsed == undefined || isNaN(parsed)) {
		return [1, raw];
	}
	return [parsed, raw];
}

main.getExp = function () {
	const raw = document.getElementById("exp").value;
	const parsed = parseInt(raw);
	if (parsed == undefined || isNaN(parsed)) {
		return [0, raw];
	}
	return [parsed, raw];
}

main.getTargetRank = function () {
	const raw = document.getElementById("targetRank").value;
	const parsed = parseInt(raw);
	if (parsed == undefined || isNaN(parsed)) {
		return [25, raw];
	}
	return [parsed, raw];
}

main.getExpNeeded = function () {
	const [currentRank] = this.getRank();
	const [currentExp] = this.getExp();
	const [targetRank] = this.getTargetRank();

	const xpToNextRank = data.ranks[currentRank + 1] - currentExp;
	const xpToRank25 = data.ranks.slice(currentRank).reduce((p, a) => p + a, 0) - currentExp;

	// get xp to target rank, anything greater than 25 is 10k xp per rank
	const xpToTargetRank = targetRank > 25 ? (targetRank - 25) * 10000 + xpToRank25 : data.ranks.slice(currentRank, targetRank).reduce((p, a) => p + a, 0) - currentExp;

	return {
		xpToNextRank,
		xpToRank25,
		xpToTargetRank
	}
}

main.addExp = function (exp) {
	const [currentRank] = this.getRank();
	const [currentExp] = this.getExp();

	const newExp = currentExp + exp;
	const newRank = currentRank + Math.floor(newExp / data.ranks[currentRank + 1]);

	document.getElementById("rank").value = newRank;
	document.getElementById("exp").value = newExp % data.ranks[currentRank + 1];

	this.processUpdate();
}

main.toggleVisibility = function (id) {
	const element = document.getElementById("view-" + id);
	const state = element.style.display == "none";
	element.style.display = state ? "block" : "none";

	localStorage.setItem("show/" + id, state);
}

main.reset = function () {
	if (this.resetCount == undefined) {
		this.resetCount = 0;
	}
	this.resetCount++;

	if (this.resetCount >= 3) {
		document.getElementById("rank").value = 0;
		document.getElementById("exp").value = 0;
		this.resetCount = 0;

		document.getElementById("resetButton").innerHTML = "Reset (0/3)";

		this.processUpdate();
	} else {
		document.getElementById("resetButton").innerHTML = "Reset (" + this.resetCount + "/3)";
	}
}

main.init = function () {
	document.getElementById("view-crystallineConflict").style.display = this.showCrystallineConflict ? "block" : "none";
	document.getElementById("view-rivalWings").style.display = this.showRivalWings ? "block" : "none";
	document.getElementById("view-frontline").style.display = this.showFrontline ? "block" : "none";

	document.getElementById("rank").value = localStorage.getItem("input/rank") || 0;
	document.getElementById("exp").value = localStorage.getItem("input/exp") || 0;
	document.getElementById("targetRank").value = localStorage.getItem("input/targetRank") || 25;

	document.getElementById("rank").addEventListener("input", this.processUpdate);
	document.getElementById("exp").addEventListener("input", this.processUpdate);
	document.getElementById("targetRank").addEventListener("input", this.processUpdate);

	this.processUpdate();
	crystallineConflict.init();
	rivalWings.init();
}

main.processUpdate = function () {
	// check if the inputs are valid and within limits
	const [currentRank, rawRank] = main.getRank();
	const [currentExp, rawExp] = main.getExp();
	const [targetRank, rawTargetRank] = main.getTargetRank();

	if (rawRank.trim() == "") {
		// do nothing
	} else if (currentRank != rawRank) {
		document.getElementById("rank").value = currentRank;
	} else if (currentRank < 1) {
		document.getElementById("rank").value = Math.max(1, currentRank);
	}

	if (rawExp.trim() == "") {
		// do nothing
	} else if (currentExp != rawExp) {
		document.getElementById("exp").value = currentExp;
	} else if (currentExp < 0 || currentExp > 10000) {
		document.getElementById("exp").value = Math.max(0, Math.min(10000, currentExp));
	}

	if (rawTargetRank.trim() == "") {
		// do nothing
	} else if (targetRank != rawTargetRank) {
		document.getElementById("targetRank").value = targetRank;
	} else if (targetRank < 1) {
		document.getElementById("targetRank").value = Math.max(1, targetRank);
	}

	localStorage.setItem("input/rank", currentRank);
	localStorage.setItem("input/exp", currentExp);
	localStorage.setItem("input/targetRank", targetRank);

	crystallineConflict.update();
	rivalWings.update();
}

main.init();