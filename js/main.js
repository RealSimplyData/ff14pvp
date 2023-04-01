const main = {
	showCrystallineConflict: util.getLocalStorage("show/crystallineConflict", "boolean", true),
	showRivalWings: util.getLocalStorage("show/rivalWings", "boolean", true),
	showFrontline: util.getLocalStorage("show/frontline", "boolean", true),
};

main.getRank = function () {
	const raw = document.getElementById("rank").value;
	const parsed = parseInt(raw);
	if (parsed == undefined || isNaN(parsed)) {
		return [0, raw];
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

main.getExpNeeded = function () {
	const [currentRank] = this.getRank();
	const [currentExp] = this.getExp();

	const xpToNextRank = data.ranks[currentRank + 1] - currentExp;
	const xpToRank25 = data.ranks.slice(currentRank).reduce((p, a) => p + a, 0) - currentExp;

	return {
		xpToNextRank,
		xpToRank25
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

	document.getElementById("rank").value = localStorage.getItem("rank") || 0;
	document.getElementById("exp").value = localStorage.getItem("exp") || 0;

	document.getElementById("rank").addEventListener("input", this.processUpdate);
	document.getElementById("exp").addEventListener("input", this.processUpdate);

	this.processUpdate();
	crystallineConflict.init();
	rivalWings.init();
}

main.processUpdate = function () {
	// check if the inputs are valid and within limits
	const [currentRank, rawRank] = main.getRank();
	const [currentExp, rawExp] = main.getExp();

	if (currentRank == "") {
		// do nothing
	} else if (currentRank != rawRank) {
		document.getElementById("rank").value = currentRank;
	} else if (currentRank <= 1 || currentRank > 25) {
		document.getElementById("rank").value = Math.max(0, Math.min(25, currentRank));
		return;
	}

	if (currentExp == "") {
		// do nothing
	} else if (currentExp != rawExp) {
		document.getElementById("exp").value = currentExp;
	} else if (currentExp < 0 || currentExp > 10000) {
		document.getElementById("exp").value = Math.max(0, Math.min(10000, currentExp));
		return;
	}

	localStorage.setItem("rank", currentRank);
	localStorage.setItem("exp", currentExp);

	crystallineConflict.update();
	rivalWings.update();
}

main.init();