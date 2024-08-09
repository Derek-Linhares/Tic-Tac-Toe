function startVsCPU() {
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
    let moveMade = false;

    // 50% de chance de tentar bloquear ou ganhar
    if (Math.random() < 0.5) {
      moveMade = makeBestMove("X") || makeBestMove("O");
    }

    // Se não fez a jogada, joga no centro, canto ou aleatório
    if (!moveMade) {
      const centerSquare = document.getElementById("4");
      if (centerSquare.innerHTML === "") {
        centerSquare.classList.add("flip");
        playSound(spin);
        centerSquare.innerHTML = "X";
        moveMade = true;
      }
    }

    if (!moveMade) {
      const cornerIndexes = [0, 2, 6, 8];
      const cornerSquares = cornerIndexes
        .map((index) => document.getElementById(index.toString()))
        .filter((square) => square.innerHTML === "");

      if (cornerSquares.length > 0) {
        const randomCorner =
          cornerSquares[Math.floor(Math.random() * cornerSquares.length)];
        randomCorner.classList.add("flip");
        playSound(spin);
        randomCorner.innerHTML = "X";
        moveMade = true;
      }
    }

    if (!moveMade) {
      const randomIndex = Math.floor(Math.random() * emptySquares.length);
      const cpuSquare = emptySquares[randomIndex];
      cpuSquare.classList.add("flip");
      playSound(spin);
      cpuSquare.innerHTML = "X";
    }

    checkWinner();
    playerTurn = true;
  }
}
