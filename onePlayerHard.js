function startVsCPUHard() {
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

    let bestMove;
    if (emptySquares.length === 9) {
      bestMove = 0; // Primeira jogada da CPU: canto
    } else if (emptySquares.length === 8) {
      bestMove = emptySquares.includes(document.getElementById("4"))
        ? 4 // Segunda jogada da CPU: centro, se disponível
        : 2; // Caso o centro esteja ocupado, joga em outro canto
    } else {
      bestMove = minimax(true, -Infinity, Infinity).index;
    }

    const cpuSquare = document.getElementById(bestMove);
    cpuSquare.classList.add("flip");
    playSound(spin);
    cpuSquare.innerHTML = "X";
    checkWinner();
    playerTurn = true;
  }

  function minimax(isMaximizing, alpha, beta) {
    const winner = getWinner();
    if (winner === "X") return { score: 10 };
    if (winner === "O") return { score: -10 };
    const emptySquares = Array.from(squares).filter(
      (square) => square.innerHTML === ""
    );
    if (emptySquares.length === 0) return { score: 0 };

    let bestMove;
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i].innerHTML === "") {
          squares[i].innerHTML = "X";
          const score = minimax(false, alpha, beta).score;
          squares[i].innerHTML = "";
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
          alpha = Math.max(alpha, score);
          if (beta <= alpha) break; // Poda beta
        }
      }
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i].innerHTML === "") {
          squares[i].innerHTML = "O";
          const score = minimax(true, alpha, beta).score;
          squares[i].innerHTML = "";
          if (score < bestScore) {
            bestScore = score;
            bestMove = i;
          }
          beta = Math.min(beta, score);
          if (beta <= alpha) break; // Poda alfa
        }
      }
      return { score: bestScore, index: bestMove };
    }
  }

  function getWinner() {
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
      if (
        squares[a].innerHTML &&
        squares[a].innerHTML === squares[b].innerHTML &&
        squares[a].innerHTML === squares[c].innerHTML
      ) {
        return squares[a].innerHTML;
      }
    }
    return null;
  }
}
