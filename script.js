const squares = document.querySelectorAll(".square");
const background = document.getElementById("backgroundMusic");
const spin = document.getElementById("spinSound");
const x = document.getElementById("playerX");
const o = document.getElementById("playerO");
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

squares.forEach((square) => {
  square.addEventListener("click", () => {
    if (canPlay && square.innerHTML === "") {
      square.classList.add("flip");
      playSound(spin);
      moved = true;
      square.innerHTML = jogador1 ? "O" : "X";
      jogador1 = !jogador1;
      checkWinner();
    }
  });
});

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
        if (jogador1) {
          playSound(x);
        }
        if (!jogador1) {
          playSound(o);
        }
        result.innerHTML = `<h1>Player ${squareA} Wins!</h1>`;
        if (squareA == "O") {
          scoreO.innerText = oVictories += 1;
        }
        if (squareA == "X") {
          scoreX.innerText = xVictories += 1;
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
}

function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
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
