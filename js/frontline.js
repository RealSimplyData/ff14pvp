const frontline = {
	entries: [],
	createFor: [
		["100%", 1, 0],
		["80%", 0.8, 0.1],
		["60%", 0.6, 0.2],
		["40%", 0.4, 0.3],
		["20%", 0.2, 0.4],
		["0%", 0, 0.5],
	],
	hasInit: false,
};

frontline.get1stPlaceMatches = function () {
	return util.getInputValue("frontlineFirstPlace", "number", 0);
}

frontline.get2ndPlaceMatches = function () {
	return util.getInputValue("frontlineSecondPlace", "number", 0);
}

frontline.get3rdPlaceMatches = function () {
	return util.getInputValue("frontlineThirdPlace", "number", 0);
}

frontline.add1stPlaceWin = function () {
	document.getElementById("frontlineFirstPlace").value = frontline.get1stPlaceMatches() + 1;
	main.addExp(1500);
}

frontline.add2ndPlaceWin = function () {
	document.getElementById("frontlineSecondPlace").value = frontline.get2ndPlaceMatches() + 1;
	main.addExp(1000);
}

frontline.add3rdPlaceWin = function () {
	document.getElementById("frontlineThirdPlace").value = frontline.get3rdPlaceMatches() + 1;
	main.addExp(500);
}

frontline.init = function () {
	if (frontline.hasInit) return;

	// load values from localStorage
	document.getElementById("frontlineFirstPlace").value = util.getLocalStorage("input/frontline/firstPlace", "number", 0);
	document.getElementById("frontlineSecondPlace").value = util.getLocalStorage("input/frontline/secondPlace", "number", 0);
	document.getElementById("frontlineThirdPlace").value = util.getLocalStorage("input/frontline/thirdPlace", "number", 0);

	// bind input event to process update
	document.getElementById("frontlineFirstPlace").addEventListener("input", frontline.processUpdate);
	document.getElementById("frontlineSecondPlace").addEventListener("input", frontline.processUpdate);
	document.getElementById("frontlineThirdPlace").addEventListener("input", frontline.processUpdate);

	const table = document.getElementById("frontlineData");

	for (const element of frontline.createFor) {
		const tr = document.createElement("tr");
		const td1 = document.createElement("td");
		const td2 = document.createElement("td");
		const td3 = document.createElement("td");
		const td4 = document.createElement("td");
		const td5 = document.createElement("td");

		tr.classList.add("dataset", "default-dataset");

		td1.innerHTML = element[0];
		td2.innerText = "-";
		td3.innerText = "-";
		td4.innerText = "-";
		td5.innerText = "-";

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);

		frontline.entries.push([
			element, tr, "default-dataset"
		]);

		table.appendChild(tr);
	}

	// create one entry of custom-dataset
	{
		const tr = document.createElement("tr");
		const td1 = document.createElement("td");
		const td2 = document.createElement("td");
		const td3 = document.createElement("td");
		const td4 = document.createElement("td");
		const td5 = document.createElement("td");

		tr.classList.add("dataset", "custom-dataset")

		td1.innerHTML = "Your Win Rate";
		td2.innerText = "-";
		td3.innerText = "-";
		td4.innerText = "-";
		td5.innerText = "-";

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);

		frontline.entries.push([
			null, tr, "custom-dataset"
		]);

		table.appendChild(tr);
	}

	frontline.hasInit = true;
	frontline.processUpdate();
	frontline.update();
}

frontline.__internal_createText = function (first, second, third, prefix = "", suffix = "") {
	return '<span class="place first">' + prefix + first + suffix + '</span> / <span class="place second">' + prefix + second + suffix + '</span> / <span class="place third">' + prefix + third + suffix + '</span>';
}

frontline.processUpdate = function () {
	// check if the inputs are valid and within limits
	const firstPlaceMatches = frontline.get1stPlaceMatches();
	const secondPlaceMatches = frontline.get2ndPlaceMatches();
	const thirdPlaceMatches = frontline.get3rdPlaceMatches();

	localStorage.setItem("input/frontline/firstPlace", firstPlaceMatches);
	localStorage.setItem("input/frontline/secondPlace", secondPlaceMatches);
	localStorage.setItem("input/frontline/thirdPlace", thirdPlaceMatches);

	// set values to 0 if they're below 0
	if (firstPlaceMatches < 0) document.getElementById("frontlineFirstPlace").value = 0;
	if (secondPlaceMatches < 0) document.getElementById("frontlineSecondPlace").value = 0;
	if (thirdPlaceMatches < 0) document.getElementById("frontlineThirdPlace").value = 0;

	// if all inputs are 0, apply 'hide-custom-dataset' class to the table, otherwise apply 'hide-default-dataset' class
	if (firstPlaceMatches === 0 && secondPlaceMatches === 0 && thirdPlaceMatches === 0) {
		document.getElementById("frontlineDataTable").classList.add("hide-custom-dataset");
		document.getElementById("frontlineDataTable").classList.remove("hide-default-dataset");
	} else {
		document.getElementById("frontlineDataTable").classList.remove("hide-custom-dataset");
		document.getElementById("frontlineDataTable").classList.add("hide-default-dataset");
	}

	frontline.update();
}

frontline.whatDataSet = function () {
	const firstPlaceMatches = frontline.get1stPlaceMatches();
	const secondPlaceMatches = frontline.get2ndPlaceMatches();
	const thirdPlaceMatches = frontline.get3rdPlaceMatches();

	if (firstPlaceMatches === 0 && secondPlaceMatches === 0 && thirdPlaceMatches === 0) {
		return "default";
	} else {
		return "custom";
	}
}

frontline.update = function () {
	const { xpToTargetRank } = main.getExpNeeded();
	const whatDataSet = frontline.whatDataSet();

	if (whatDataSet === "default") {
		for (const entry of frontline.entries) {
			if (entry[2] !== "default-dataset") continue;
			const [, targetMultiplier, otherMultiplier] = entry[0];
			const tr = entry[1];

			const td2 = tr.children[1];
			const td3 = tr.children[2];
			const td4 = tr.children[3];
			const td5 = tr.children[4];

			const firstPlaceMatches = Math.ceil((xpToTargetRank * targetMultiplier) / 1500 + (xpToTargetRank * otherMultiplier) / 1250 + (xpToTargetRank * otherMultiplier) / 1000);
			const secondPlaceMatches = Math.ceil((xpToTargetRank * otherMultiplier) / 1500 + (xpToTargetRank * targetMultiplier) / 1250 + (xpToTargetRank * otherMultiplier) / 1000);
			const thirdPlaceMatches = Math.ceil((xpToTargetRank * otherMultiplier) / 1500 + (xpToTargetRank * otherMultiplier) / 1250 + (xpToTargetRank * targetMultiplier) / 1000);

			const firstPlaceMatchTime = Math.ceil(firstPlaceMatches * 5);
			const secondPlaceMatchTime = Math.ceil(secondPlaceMatches * 5);
			const thirdPlaceMatchTime = Math.ceil(thirdPlaceMatches * 5);
			const firstPlaceQueueTime = Math.ceil(firstPlaceMatches * 3);
			const secondPlaceQueueTime = Math.ceil(secondPlaceMatches * 3);
			const thirdPlaceQueueTime = Math.ceil(thirdPlaceMatches * 3);
			const firstPlaceTotalTime = firstPlaceMatchTime + firstPlaceQueueTime;
			const secondPlaceTotalTime = secondPlaceMatchTime + secondPlaceQueueTime;
			const thirdPlaceTotalTime = thirdPlaceMatchTime + thirdPlaceQueueTime;

			td2.innerHTML = frontline.__internal_createText(firstPlaceMatches, secondPlaceMatches, thirdPlaceMatches, "~");
			td3.innerHTML = frontline.__internal_createText(util.numberToReadableDuration(firstPlaceMatchTime, true), util.numberToReadableDuration(secondPlaceMatchTime, true), util.numberToReadableDuration(thirdPlaceMatchTime, true), "~");
			td4.innerHTML = frontline.__internal_createText(util.numberToReadableDuration(firstPlaceQueueTime, true), util.numberToReadableDuration(secondPlaceQueueTime, true), util.numberToReadableDuration(thirdPlaceQueueTime, true), "~");
			td5.innerHTML = frontline.__internal_createText(util.numberToReadableDuration(firstPlaceTotalTime, true), util.numberToReadableDuration(secondPlaceTotalTime, true), util.numberToReadableDuration(thirdPlaceTotalTime, true), "~");
		}
	} else if (whatDataSet === "custom") {
		const entry = frontline.entries.find(entry => entry[2] === "custom-dataset");
		if (!entry) return;

		const firstPlaceMatchesInput = frontline.get1stPlaceMatches();
		const secondPlaceMatchesInput = frontline.get2ndPlaceMatches();
		const thirdPlaceMatchesInput = frontline.get3rdPlaceMatches();
		const totalMatchesInput = firstPlaceMatchesInput + secondPlaceMatchesInput + thirdPlaceMatchesInput;

		const firstPlaceMultiplier = frontline.get1stPlaceMatches() / totalMatchesInput;
		const secondPlaceMultiplier = frontline.get2ndPlaceMatches() / totalMatchesInput;
		const thirdPlaceMultiplier = frontline.get3rdPlaceMatches() / totalMatchesInput;
		const tr = entry[1];

		const td1 = tr.children[0];
		const td2 = tr.children[1];
		const td3 = tr.children[2];
		const td4 = tr.children[3];
		const td5 = tr.children[4];

		const firstPlaceMatches = Math.ceil((xpToTargetRank * firstPlaceMultiplier) / 1500);
		const secondPlaceMatches = Math.ceil((xpToTargetRank * secondPlaceMultiplier) / 1250);
		const thirdPlaceMatches = Math.ceil((xpToTargetRank * thirdPlaceMultiplier) / 1000);

		const firstPlaceMatchTime = Math.ceil(firstPlaceMatches * 5);
		const secondPlaceMatchTime = Math.ceil(secondPlaceMatches * 5);
		const thirdPlaceMatchTime = Math.ceil(thirdPlaceMatches * 5);
		const firstPlaceQueueTime = Math.ceil(firstPlaceMatches * 3);
		const secondPlaceQueueTime = Math.ceil(secondPlaceMatches * 3);
		const thirdPlaceQueueTime = Math.ceil(thirdPlaceMatches * 3);
		const firstPlaceTotalTime = firstPlaceMatchTime + firstPlaceQueueTime;
		const secondPlaceTotalTime = secondPlaceMatchTime + secondPlaceQueueTime;
		const thirdPlaceTotalTime = thirdPlaceMatchTime + thirdPlaceQueueTime;

		td1.innerHTML = frontline.__internal_createText(util.floatToPercent(firstPlaceMultiplier, 1), util.floatToPercent(secondPlaceMultiplier, 1), util.floatToPercent(thirdPlaceMultiplier, 1), "");
		td2.innerHTML = frontline.__internal_createText(firstPlaceMatches, secondPlaceMatches, thirdPlaceMatches, "~");
		td3.innerHTML = frontline.__internal_createText(util.numberToReadableDuration(firstPlaceMatchTime, true), util.numberToReadableDuration(secondPlaceMatchTime, true), util.numberToReadableDuration(thirdPlaceMatchTime, true), "~");
		td4.innerHTML = frontline.__internal_createText(util.numberToReadableDuration(firstPlaceQueueTime, true), util.numberToReadableDuration(secondPlaceQueueTime, true), util.numberToReadableDuration(thirdPlaceQueueTime, true), "~");
		td5.innerHTML = frontline.__internal_createText(util.numberToReadableDuration(firstPlaceTotalTime, true), util.numberToReadableDuration(secondPlaceTotalTime, true), util.numberToReadableDuration(thirdPlaceTotalTime, true), "~");
	}
}

window.frontline = frontline;