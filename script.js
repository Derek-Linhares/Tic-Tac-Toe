const squares = document.querySelectorAll(".square");
const background = document.getElementById("backgroundMusic");
const spin = document.getElementById("spinSound");
const x = document.getElementById("playerX");
const o = document.getElementById("playerO");
const cpuWins = document.getElementById("cpuWins");
const playerWins = document.getElementById("humanWins");
const draw = document.getElementById("draw");
let jogador1 = true;
let canPlay = true;
let result = document.getElementById("result");
background.volume = 0.3;
let playingTheme = false;
let moved = false;
let scoreX = document.getElementById("scoreX");
let scoreDraw = document.getElementById("scoreDraw");
let scoreO = document.getElementById("scoreO");
let oVictories = 0;
let xVictories = 0;
let draws = 0;
scoreO.innerText = oVictories;
scoreDraw.innerText = draws;
scoreX.innerText = xVictories;
let restart = document.getElementById("restart");
const titleScreen = document.getElementById("welcome");
const musicBtn = document.getElementById("note");
const title = document.getElementById("title");
const container = document.getElementById("container");
const score = document.getElementById("score");
let playerOne = document.getElementById("playerOne");
let playerTwo = document.getElementById("playerTwo");
let cpu = false;

function gameStart() {
  titleScreen.style.visibility = "hidden";
  musicBtn.style.visibility = "visible";
  container.style.visibility = "visible";
  title.style.visibility = "visible";
  score.style.visibility = "visible";
  playSound(background);
  playingTheme = true;
}

function toggleMusic() {
  if (playingTheme) {
    background.pause();
    background.currentTime = 0;
    playingTheme = false;
  } else {
    playSound(background);
    playingTheme = true;
  }
}

function resetGame() {
  if (moved) {
    setTimeout(() => {
      playSound(spin);
    }, 185);
  }
  squares.forEach((square) => {
    setTimeout(() => {
      square.classList.remove("flip", "blink");
    }, 185);
    square.innerHTML = "";
    result.innerHTML = "";
    restart.style.visibility = "hidden";
  });
  jogador1 = true;
  canPlay = true;
  moved = false;
  playerTurn = true;
}

function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

function blinkSquares(combination) {
  let blinkCount = 0;
  const interval = setInterval(() => {
    combination.forEach((index) => {
      const square = document.getElementById(index.toString());
      square.classList.toggle("blink");
    });
    blinkCount++;
    if (blinkCount === 7) {
      clearInterval(interval);
    }
  }, 180);
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    const squareA = document.getElementById(a.toString()).innerHTML;
    const squareB = document.getElementById(b.toString()).innerHTML;
    const squareC = document.getElementById(c.toString()).innerHTML;

    if (squareA !== "" && squareA === squareB && squareA === squareC) {
      canPlay = false;

      blinkSquares(combination);
      setTimeout(() => {
        if (squareA === "O" && cpu == false) {
          scoreO.innerText = oVictories += 1;
          result.innerHTML = `<h1>Player ${squareA} Wins!</h1>`;
          playSound(squareA === "O" ? o : x);
        } else if (squareA === "X" && cpu == false) {
          scoreX.innerText = xVictories += 1;
          result.innerHTML = `<h1>Player ${squareA} Wins!</h1>`;
          playSound(squareA === "O" ? o : x);
        } else if (squareA === "O" && cpu == true) {
          scoreO.innerText = oVictories += 1;
          result.innerHTML = `<h1>Human Player Wins</h1>`;
          playSound(playerWins);
        } else if (squareA === "X" && cpu == true) {
          scoreX.innerText = xVictories += 1;
          result.innerHTML = `<h1>CPU Player Wins!</h1>`;
          playSound(cpuWins);
        }
        restart.style.visibility = "visible";
      }, 100 * 3 * 2 + 10);
      return;
    }
  }
  const allFilled = Array.from(squares).every(
    (square) => square.innerHTML !== ""
  );
  if (allFilled && canPlay === true) {
    playSound(draw);
    setTimeout(() => {
      result.innerHTML = `<h1>Draw Game</h1>`;
      scoreDraw.innerText = draws += 1;
      restart.style.visibility = "visible";
    }, 200);
  }
}
