const npcChoiceDisplay = document.getElementById("npc-choice");
const userChoiceDisplay = document.getElementById("user-choice");
const resultDisplay = document.getElementById("result");
const possibleChoices = document.querySelectorAll(".choose");
const playForm = document.querySelector("#form");
const curtainContainer = document.querySelector(".container-curtain");
const gameContainer = document.querySelector(".container-game");
const curtainWrapper = document.querySelector(".wrapper-curtain");
const userPointsOutDisplay = document.querySelector("#user-points");
const npcPointsOutDisplay = document.querySelector("#npc-points");
const mainDisplay = document.querySelector("main");
const form = document.getElementById("form");
const hightScore = document.getElementById("outputHighscore");
const numInputsArray = document.querySelectorAll(".numInputs");
const numInput = document.querySelector("#rounds");
const resetBtn = document.querySelector("#reset");
const newGameBtn = document.querySelector("#newGame");
const dialog = document.querySelector("dialog");

let userChoice,
	npcChoice,
	result,
	maxRounds,
	rounds = 1,
	userPoints = 0,
	npcPoints = 0,
	timer = 0,
	userStartMoving = true,
	npcStartMoving = true,
	resultsArray = [
		["Max-Rounds", "Rounds", "User Wins", "Npc Wins", "Restart?"],
	],
	didURestart = false,
	restarting,
	weRestart = false,
	fightInterval,
	requestKeyFrame,
	requestFightFrame,
	explosionFrame;

//loop animation
let loop = 0,
	userStartX = 1,
	npcStartX = 1,
	modulo = 100,
	movespeed = 0.015;

//get maxRounds
playForm.addEventListener("submit", (e) => {
	e.preventDefault();
	newGameBtn.classList.add("remove");
	maxRounds = numInput.value;

	if (String(maxRounds).length < 2) {
		document.querySelector("#outputMaxRound").innerHTML = `0${maxRounds}`;
	} else {
		document.querySelector("#outputMaxRound").innerHTML = maxRounds;
	}
	form.classList.add("remove");
	window.requestAnimationFrame(moveOut);
});

//input number btns
numInputsArray.forEach((input) => {
	input.addEventListener("click", (e) => {
		e.preventDefault();
		input.classList.add("rotate");
		if (input.id === "inputDown") {
			numInput.value--;
		} else {
			numInput.value++;
		}
		setTimeout(() => {
			input.classList.remove("rotate");
		}, 1000);
	});
});

possibleChoices.forEach((choice) =>
	choice.addEventListener("click", (e) => {
		//clearTimeout(restarting);

		if (String(rounds).length < 2) {
			document.querySelector("#outputRound").innerHTML = `0${rounds}`;
		} else {
			document.querySelector("#outputRound").innerHTML = `${rounds}`;
		}
		if (String(rounds).length < 2) {
			document.querySelector("#outputRound").innerHTML = `0${rounds}`;
		} else {
			document.querySelector("#outputRound").innerHTML = `${rounds}`;
		}
		userChoice = e.target.id;
		npcChoiceGenerator();
		getRoundWinner(false);
		userStartX = 1;
		npcStartX = 1;
		requestFightFrame = cancelAnimationFrame(requestFightFrame);
		if (requestFightFrame === undefined) {
			requestKeyFrame = cancelAnimationFrame(requestKeyFrame);
			requestFightFrame = requestAnimationFrame(() => letsFight());
		}

		//console.log(maxRounds);
		if (rounds >= maxRounds) {
			//console.log(maxRounds);
			if (weRestart === false || maxRounds == 1) {
				setTimeout(() => {
					getRoundWinner(true);
					dialog.showModal();
					getGameWinner();
				}, 2000);
			}
			//console.log(maxRounds);
			weRestart = true;
			return;
		}
		weRestart = false;
		rounds++;
		getRoundWinner(true);

		//clearInterval(gameInterval);
	})
);

//for table generation
function getResults() {
	let firstResult = resultsArray.shift(); //get tr names
	resultsArray.pop(); //remove last arrayEle

	if (didURestart === true) {
		didURestart = "X";
	} else if (didURestart === false) {
		didURestart = "";
	}
	resultsArray.unshift([
		`${maxRounds}`,
		`${rounds}`,
		`${userPoints}`,
		`${npcPoints}`,
		`${didURestart}`,
	]);
	resultsArray.unshift(firstResult); //take tr names back
}

function npcChoiceGenerator() {
	const rndNumber = Math.floor(Math.random() * possibleChoices.length);

	if (rndNumber === 0) {
		npcChoice = "rock";
		npcImgId = "rock";
	}
	if (rndNumber === 1) {
		npcChoice = "scissor";
		npcImgId = "scissor";
	}
	if (rndNumber === 2) {
		npcChoice = "paper";
		npcImgId = "paper";
	}
	npcChoiceDisplay.innerHTML = npcChoice;
}

function getRoundWinner(addPoints) {
	if (npcChoice === userChoice) {
		result = "its a draw";
	} else if (
		(npcChoice === "rock" && userChoice === "paper") ||
		(npcChoice === "paper" && userChoice === "scissor") ||
		(npcChoice === "scissor" && userChoice === "rock")
	) {
		if (addPoints) userPoints++;
		if (String(userPoints).length < 2) {
			userPointsOutDisplay.innerHTML = "0" + userPoints;
		} else {
			userPointsOutDisplay.innerHTML = userPoints;
		}
		result = "you win this round!";
	} else {
		if (addPoints) npcPoints++;
		if (String(npcPoints).length < 2) {
			npcPointsOutDisplay.innerHTML = "0" + npcPoints;
		} else {
			npcPointsOutDisplay.innerHTML = npcPoints;
		}
		result = "you lose this round!";
	}

	resultDisplay.innerHTML = result;
}

//fight animation
function letsFight() {
	requestKeyFrame = cancelAnimationFrame(requestKeyFrame);
	const imgObjUser = new Image();
	const imgObjNpc = new Image();
	if (loop !== null) {
		loop++;
		if (loop % modulo > modulo / 2) {
			imgObjUser.src = heroImageSrcArray1[userImgId];
			imgObjNpc.src = heroImageSrcArray1[npcImgId];
		} else {
			imgObjUser.src = heroImageSrcArray2[userImgId];
			imgObjNpc.src = heroImageSrcArray2[npcImgId];
		}
	} else {
		return;
	}

	if (userStartMoving === true) {
		userStartX += movespeed;
	}
	if (npcStartMoving === true) {
		npcStartX += movespeed;
	}
	if (userStartX >= 2 && npcStartX >= 2) {
		userStartMoving = false;
		npcStartMoving = false;
		modulo = 100;
	} else {
		userStartMoving = true;
		npcStartMoving = true;
		modulo = 50;
	}

	if (userStartMoving === false && npcStartMoving === false) {
		explosionFrame = requestAnimationFrame(() => drawExplosion());
		setTimeout(() => {
			userStartX = 1;
			npcStartX = 1;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			requestFightFrame = cancelAnimationFrame(requestFightFrame);
			explosionFrame = cancelAnimationFrame(explosionFrame);
			requestFightFrame = requestAnimationFrame(() => letsFight());
		}, 1500);
		return;
	} else {
		number = 0;
		hue = 0;
		alpha = 1;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawPaper(imgObjUser, 5, userStartX);

		if (npcImgId !== "question") {
			ctx.translate(canvas.width, 0);
			ctx.scale(-1, 1);
			drawPaper(imgObjNpc, 5, npcStartX);
		} else {
			npcStartX = 1;
			npcStartMoving = false;
			ctx.setTransform(1, 0, 0, 1, 0, 0);

			drawPaper(imgObjNpc, 1.42, npcStartX);
		}
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	requestFightFrame = cancelAnimationFrame(requestFightFrame);
	requestFightFrame = requestAnimationFrame(() => letsFight());
}

let number = 0,
	scale = 50,
	hue = 0,
	alpha = 1;

function drawExplosion() {
	let angle = number * (rounds + 1),
		radius = scale * Math.sqrt(number),
		posiX = radius * Math.sin(angle) + canvas.width / 2,
		posiY = radius * Math.cos(angle) + canvas.height / 2;

	ctx.fillStyle = "hsla(" + hue + ", 100%, 50%," + alpha + ")";
	ctx.strokeStyle = "transparent";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(posiX, posiY, 80, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	number++;
	hue += 3;
	alpha -= 0.05;

	explosionFrame = requestAnimationFrame(() => drawExplosion());
}

// write the winner into modal
const outputResult = document.querySelector("#outputResult");
function getGameWinner(newGame = false) {
	outputResult.innerHTML = "";
	newGameBtn.classList.remove("remove");

	let resultText;
	if (npcPoints === userPoints) {
		resultText = "Dont worry, just a draw";
	} else if (npcPoints >= userPoints) {
		resultText = "Damn it, you lost.";
	} else {
		resultText = "I knew, you gonna win this.";
	}
	if (newGame === true) {
		resultText = "Loading...";
		newGameBtn.classList.add("remove");
	}
	for (let i = 0; i < resultText.length; i++) {
		let span = document.createElement("span");
		span.setAttribute("style", `--i: ${i}`);
		span.innerHTML = resultText.charAt(i);
		outputResult.appendChild(span);
	}
}
//setup new Game button
newGameBtn.addEventListener("click", (e) => {
	e.preventDefault();
	getGameWinner(true);
	dialog.close();
	restart();
});

//setup resetbutton
resetBtn.addEventListener("click", (e) => {
	e.preventDefault();
	didURestart = true;
	restart();
});

function restart() {
	getResults();
	didURestart = false;
	rounds = 1;
	userPoints = 0;
	npcPoints = 0;
	timer = 0;
	mainDisplay.style.background = "black";
	userPointsOutDisplay.innerHTML = "00";
	npcPointsOutDisplay.innerHTML = "00";
	npcChoiceDisplay.innerHTML = "";
	userChoiceDisplay.innerHTML = "";
	resultDisplay.innerHTML = "";
	document.querySelector("#outputRound").innerHTML = `0${rounds}`;

	window.requestAnimationFrame(moveIn);
}

//animations curtain
let moveCounter = 0;

function lightMain() {
	timer += 0.5;
	mainDisplay.style.background = `radial-gradient(circle, rgba(255, 253, 138, 0.601) ${timer}%, rgba(252, 255, 95, 0.601) ${
		timer + 5
	}%, rgba(255, 252, 45, 0.601) ${timer + 10}%, black ${
		timer + 50
	}%, black 100%)`;
}

function moveOut() {
	moveCounter += 10;
	for (const child of curtainWrapper.children) {
		if (child.classList.value === "curtain-right") {
			child.style.transform = `translateX(${moveCounter}px)`;
		} else {
			child.style.transform = `translateX(-${moveCounter}px)`;
		}
	}

	if (moveCounter < curtainWrapper.offsetWidth / 2) {
		window.requestAnimationFrame(moveOut);
		window.requestAnimationFrame(lightMain);
	} else if (moveCounter >= curtainWrapper.offsetWidth / 2) {
		curtainContainer.classList.add("remove");
		gameContainer.classList.remove("remove");
	}
}

function moveIn() {
	moveCounter -= 10;
	if (moveCounter > 0) {
		window.requestAnimationFrame(moveIn);
		curtainContainer.classList.remove("remove");
		gameContainer.classList.add("remove");
	} else {
		form.classList.remove("remove");
		document.querySelector("tbody").remove();
		drawTable();
	}
	for (const child of curtainWrapper.children) {
		if (child.classList.value === "curtain-right") {
			child.style.transform = `translateX(${moveCounter}px)`;
		} else {
			child.style.transform = `translateX(-${moveCounter}px)`;
		}
	}
}

function drawTable() {
	let tbdy = document.createElement("tbody");

	if (resultsArray.length <= 5) {
		let diff = 6 - resultsArray.length;
		for (let i = 0; i < diff; i++) {
			resultsArray.push(["?", "?", "", "", ""]);
		}
	}
	resultsArray.forEach((results) => {
		let tr = document.createElement("tr");
		results.forEach((result) => {
			let td = document.createElement("td");
			if (result === true) {
				result = "X";
			} else if (result === false) {
				result = "";
			}
			td.innerHTML = result;
			tr.appendChild(td);
		});
		tbdy.appendChild(tr);
	});
	hightScore.appendChild(tbdy);
}
drawTable();

//draw Background stars/stones/bushes
const gameContainerScoreBoard = document.querySelector(".container-scoreboard");

const scoreBoardSize =
	gameContainerScoreBoard.offsetWidth * gameContainerScoreBoard.offsetHeight;

const starSection = scoreBoardSize / 4000;

//rndGenrator
function getRndNum(min, max) {
	return min + Math.random() * (max + 1 - min);
}
//create stars
for (i = 0; i < starSection; i++) {
	let xPos = getRndNum(0, 100);
	let yPos = getRndNum(0, 100);
	let opacity = getRndNum(0.5, 1);
	let size = getRndNum(1, 2);
	let color = "#ffffff";
	let shadow = Math.floor(getRndNum(0, 1));
	const star = document.createElement("div");
	star.style.position = "absolute";
	star.style.left = xPos + "%";
	star.style.top = yPos + "%";
	star.style.opacity = opacity;
	star.style.width = size + "px";
	star.style.height = size + "px";
	star.style.backgroundColor = color;
	if (shadow === 1) {
		star.style.boxShadow = "0px 0px 10px 2px " + "#ffffff";
	}
	gameContainerScoreBoard.appendChild(star);
}

//create stone
const gameContainerArena = document.querySelector(".container-arena");
const arenaSize =
	gameContainerArena.offsetWidth * gameContainerArena.offsetHeight;
const stoneSection = arenaSize / 3000;

for (i = 0; i < stoneSection; i++) {
	let xPos = getRndNum(0, 100);
	let yPos = getRndNum(0, 100);
	let opacity = getRndNum(0.5, 1);
	let size = getRndNum(1, 8);

	let firstColor = "#b9b3ae";
	let secondColor = "#9F9087";

	const stone = document.createElement("div");
	stone.style.position = "absolute";
	stone.style.left = xPos + "%";
	stone.style.top = yPos + "%";
	stone.style.opacity = opacity;
	stone.style.width = size + "px";
	stone.style.height = size + "px";
	stone.style.background = `linear-gradient(180deg, ${firstColor} 10%, ${secondColor})`;
	if (size > 5) {
		stone.style.borderRadius = "50% 50% 0 0";
	} else {
		stone.style.borderRadius = "50%";
	}
	gameContainerArena.appendChild(stone);
}
//create bushes
const gameContainerBushes = document.querySelector(".bushes");
const bushesSize =
	gameContainerBushes.offsetWidth * gameContainerBushes.offsetHeight;
const bushesSection = bushesSize / 40;

for (i = 0; i < bushesSection; i++) {
	let xPos = getRndNum(0, 100);
	let yPos = getRndNum(0, 100);
	let size = getRndNum(1, 8);
	let deg = getRndNum(-45, 45);

	const bushContainer = document.createElement("div");
	const bush = new Image();
	bush.src = "./assets/img/bush1.png";
	bush.alt = "bush";
	bush.style.transform = `rotate(${deg}deg)`;
	bushContainer.appendChild(bush);

	bushContainer.style.position = "absolute";
	bushContainer.style.left = xPos + "%";
	bushContainer.style.top = -yPos / 4 + "px";
	//bush.style.opacity = opacity;
	bushContainer.style.width = "50px";
	bushContainer.style.height = "50px";
	bushContainer.style.transform = `scale(1.0${size})`;
	bushContainer.classList.add("shake");
	gameContainerBushes.appendChild(bushContainer);
}
//swap heros
const possibleChoicesHover = document.querySelectorAll(
	".character-selection .img-wrapper"
);
const heroDisplay = document.querySelector("#spawn-user");
const npcDisplay = document.querySelector("#spawn-npc");

const heroImageSrcArray1 = {
	rock: "./assets/img/rock1.png",
	paper: "./assets/img/paper1.png",
	scissor: "./assets/img/scissor1.png",
	question: "./assets/img/questionmark1.png",
};
const heroImageSrcArray2 = {
	rock: "./assets/img/rock2.png",
	paper: "./assets/img/paper2.png",
	scissor: "./assets/img/scissor2.png",
	question: "./assets/img/questionmark2.png",
};

let userImgId = "question";
let npcImgId = "question";
possibleChoicesHover.forEach((choice) =>
	["mouseover", "mouseout"].forEach((evt) =>
		choice.addEventListener(evt, (e) => {
			let children = choice.children;

			if (e.type === "mouseover") {
				userImgId = children[0].id;
				userStartX = 0.3;
				userChoiceDisplay.innerHTML = userImgId;
				requestFightFrame = cancelAnimationFrame(requestFightFrame);
			} else if (e.type === "mouseout") {
				userImgId = "question";
				npcImgId = "question";
				userStartX = 1;
				npcStartX = 1;
				userChoiceDisplay.innerHTML = "";
				npcChoiceDisplay.innerHTML = "";
				resultDisplay.innerHTML = "vs";
				requestKeyFrame = cancelAnimationFrame(requestKeyFrame);
				if (requestKeyFrame === undefined) {
					requestKeyFrame = requestAnimationFrame(() => loopKeyFrame());
				}
				requestFightFrame = cancelAnimationFrame(requestFightFrame);
			} else {
				alert("Something went wrong, please reload");
				return;
			}
		})
	)
);

function loopKeyFrame() {
	//console.log("loop");

	requestFightFrame = cancelAnimationFrame(requestFightFrame);

	const imgObjUser = new Image();
	const imgObjNpc = new Image();
	if (loop !== null) {
		loop++;
		if (loop % modulo > modulo / 2) {
			imgObjUser.src = heroImageSrcArray1[userImgId];
			imgObjNpc.src = heroImageSrcArray1[npcImgId];
		} else {
			imgObjUser.src = heroImageSrcArray2[userImgId];
			imgObjNpc.src = heroImageSrcArray2[npcImgId];
		}
	} else {
		return;
	}
	if (userStartMoving === true) {
		userStartX += movespeed;
	}
	if (userStartX >= 1) {
		userStartMoving = false;
		modulo = 100;
	} else {
		userStartMoving = true;
		modulo = 50;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPaper(imgObjUser, 5, userStartX);

	if (npcImgId !== "question") {
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);
		drawPaper(imgObjNpc, 5, npcStartX);
	} else {
		drawPaper(imgObjNpc, 1.42, npcStartX);
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	requestKeyFrame = requestAnimationFrame(() => loopKeyFrame());
}

//draw our arena
const canvas = document.getElementById("arena");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx = canvas.getContext("2d");
//loopKeyFrame();

function drawPaper(imgObj, x, y) {
	ctx.drawImage(
		imgObj,
		(canvas.width / x) * y,
		canvas.height / 2 - 64,
		128,
		128
	);
}

requestKeyFrame = requestAnimationFrame(() => loopKeyFrame());
