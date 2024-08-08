function startVsCPUHard() {
  cpu = true;
  playerOne.innerText = "Human";
  playerTwo.innerText = "Computer";
  gameStart();
  squares.forEach((square) => {
    square.addEventListener("click", () => {
      if (canPlay && square.innerHTML === "" && playerTurn) {
        square.classList.add("flip");
        playSound(spin);
        square.innerHTML = "O";
        playerTurn = false;
        checkWinner();
        if (canPlay) {
          setTimeout(cpuPlay, 500);
        }
      }
    });
  });

  function cpuPlay() {
    const emptySquares = Array.from(squares).filter(
      (square) => square.innerHTML === ""
    );

    let moveMade = makeBestMove("X");
    if (!moveMade) {
      moveMade = makeBestMove("O");
    }

    if (!moveMade) {
      const centerSquare = document.getElementById("4");
      if (emptySquares.includes(centerSquare)) {
        centerSquare.classList.add("flip");
        playSound(spin);
        centerSquare.innerHTML = "X";
      } else {
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        const cpuSquare = emptySquares[randomIndex];
        cpuSquare.classList.add("flip");
        playSound(spin);
        cpuSquare.innerHTML = "X";
      }
    }

    checkWinner();
    playerTurn = true;
  }

  function makeBestMove(player) {
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

      if (
        (squareA === player && squareB === player && squareC === "") ||
        (squareA === player && squareB === "" && squareC === player) ||
        (squareA === "" && squareB === player && squareC === player)
      ) {
        const emptyIndex = [a, b, c].find(
          (index) => document.getElementById(index.toString()).innerHTML === ""
        );
        const bestSquare = document.getElementById(emptyIndex.toString());
        bestSquare.classList.add("flip");
        playSound(spin);
        bestSquare.innerHTML = "X";
        return true;
      }
    }
    return false;
  }
}
