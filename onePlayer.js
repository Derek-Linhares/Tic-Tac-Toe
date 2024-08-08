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
    const cpuSquares = Array.from(squares).filter(
      (square) => square.innerHTML === "X"
    );
    const emptySquares = Array.from(squares).filter(
      (square) => square.innerHTML === ""
    );
    const centerSquare = document.getElementById("4");

    if (emptySquares.length > 0) {
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

      checkWinner();
      playerTurn = true;
    }
  }
}
