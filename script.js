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

squares.forEach((square) => {
  square.addEventListener("click", () => {
    if (canPlay && square.innerHTML === "") {
      square.classList.add("flip");
      playSound(spin);
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
      if (jogador1) {
        playSound(x);
      }
      if (!jogador1) {
        playSound(o);
      }
      blinkSquares(combination);
      setTimeout(() => {
        result.innerHTML = `<h1>Player ${squareA} wins!</h1>`;
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
    if (blinkCount === 6) {
      clearInterval(interval);
    }
  }, 180);
}

function resetGame() {
  playSound(spin);
  squares.forEach((square) => {
    square.classList.remove("flip", "blink");
    square.innerHTML = "";
    result.innerHTML = "";
  });
  jogador1 = true;
  canPlay = true;
}

function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

playSound(background);
