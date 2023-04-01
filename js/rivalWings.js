const rivalWings = {
	entries: [],
	createFor: [
		["100%", 1, 0],
		["75%", 0.75, 0.25],
		["50%", 0.5, 0.5],
		["25%", 0.25, 0.75],
		["10%", 0.1, 0.9],
		["5%", 0.05, 0.95],
		["0%", 0, 1]
	],
	hasInit: false,
};

rivalWings.init = function () {
	if (rivalWings.hasInit) return;

	const table = document.getElementById("rivalwingsData");

	for (const element of rivalWings.createFor) {
		const tr = document.createElement("tr");
		const td1 = document.createElement("td");
		const td2 = document.createElement("td");
		const td3 = document.createElement("td");
		const td4 = document.createElement("td");
		const td5 = document.createElement("td");

		tr.classList.add("dataset")

		td1.innerText = element[0];
		td2.innerText = "0";
		td3.innerText = "0";
		td4.innerText = "0 minutes";
		td5.innerText = "0 minutes";

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);

		rivalWings.entries.push([
			element, tr
		]);

		table.appendChild(tr);
	}

	rivalWings.hasInit = true;
	this.update();
}

rivalWings.update = function () {
	const { xpToTargetRank } = main.getExpNeeded();

	for (const entry of rivalWings.entries) {
		const [, victoryMultiplier, defeatMultiplier] = entry[0];
		const tr = entry[1];

		const td2 = tr.children[1];
		const td3 = tr.children[2];
		const td4 = tr.children[3];
		const td5 = tr.children[4];

		const victoryMatches = (xpToTargetRank * victoryMultiplier) / 1250;
		const defeatMatches = (xpToTargetRank * defeatMultiplier) / 750;

		const totalMatches = Math.ceil(victoryMatches + defeatMatches);

		const matchTime = Math.ceil(totalMatches * 15);
		const queueTime = Math.ceil(totalMatches * 3);
		const totalTime = matchTime + queueTime;

		td2.innerText = "~" + totalMatches;
		td3.innerText = "~" + util.numberToReadableDuration(matchTime);
		td4.innerText = "~" + util.numberToReadableDuration(queueTime);
		td5.innerText = "~" + util.numberToReadableDuration(totalTime);
	}
}

window.rivalWings = rivalWings;