const crystallineConflict = {
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

crystallineConflict.init = function () {
	if (crystallineConflict.hasInit) return;

	const table = document.getElementById("crystallineConflictData");

	for (const element of crystallineConflict.createFor) {
		const tr = document.createElement("tr");
		const td1 = document.createElement("td");
		const td2 = document.createElement("td");
		const td3 = document.createElement("td");
		const td4 = document.createElement("td");
		const td5 = document.createElement("td");

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

		crystallineConflict.entries.push([
			element, tr
		]);

		table.appendChild(tr);
	}

	crystallineConflict.hasInit = true;
	this.update();
}

crystallineConflict.update = function () {
	const { xpToTargetRank } = main.getExpNeeded();

	for (const entry of crystallineConflict.entries) {
		const [, victoryMultiplier, defeatMultiplier] = entry[0];
		const tr = entry[1];

		const td2 = tr.children[1];
		const td3 = tr.children[2];
		const td4 = tr.children[3];
		const td5 = tr.children[4];

		const victoryMatches = Math.ceil((xpToTargetRank * victoryMultiplier) / 900);
		const defeatMatches = Math.ceil((xpToTargetRank * defeatMultiplier) / 700);

		const totalMatches = victoryMatches + defeatMatches;

		const matchTime = Math.ceil(totalMatches * 5);
		const queueTime = Math.ceil(totalMatches * 3);
		const totalTime = matchTime + queueTime;

		td2.innerText = "~" + totalMatches;
		td3.innerText = "~" + util.numberToReadableDuration(matchTime);
		td4.innerText = "~" + util.numberToReadableDuration(queueTime);
		td5.innerText = "~" + util.numberToReadableDuration(totalTime);
	}
}

window.crystallineConflict = crystallineConflict;