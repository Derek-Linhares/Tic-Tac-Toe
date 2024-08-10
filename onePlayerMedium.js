function startVsCPUMedium() {
  cpu = true;
  playerOne.innerText = "Human";
  playerTwo.innerText = "Computer";
  gameStart();
  squares.forEach((square) => {
    square.addEventListener("click", () => {
      if (canPlay && square.innerHTML === "" && playerTurn) {
        moved = true;
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
}
