let currentGameRef;
let gameId;
let playerName;
let previousBoard = Array(9).fill("");

const gameIdDisplay = document.getElementById("onlineContainer");

const waitingMsg = document.getElementById("waitingMsg");

function generateGameId() {
  return Math.random().toString(36).substr(2, 5);
}

function createOnlineGame() {
  gameId = generateGameId();
  currentGameRef = gamesRef.child(gameId);
  playerName = `Player1_${Date.now()}`;

  const initialGameState = {
    players: {
      player1: playerName,
      player2: null,
    },
    board: ["", "", "", "", "", "", "", "", ""],
    currentPlayer: "O",
    status: "waiting",
    winner: null,
    score: {
      O: 0,
      X: 0,
      draws: 0,
    },
    lastRestart: 0,
  };

  currentGameRef.set(initialGameState);
  setupGameListeners();
  showGameIdToHost();
}

function joinOnlineGame(joinId) {
  gameId = joinId;
  currentGameRef = gamesRef.child(gameId);
  playerName = `Player2_${Date.now()}`;

  currentGameRef
    .transaction((gameState) => {
      if (gameState && gameState.status === "waiting") {
        gameState.players.player2 = playerName;
        gameState.status = "playing";
      }
      return gameState;
    })
    .then(() => {
      setupGameListeners();
      hideJoinForm();
    });
}

function setupGameListeners() {
  currentGameRef.on("value", (snapshot) => {
    const gameState = snapshot.val();
    if (!gameState) return;

    title.innerText = `Online Game - Room ID: ${gameId}`;

    if (gameState.status === "finished") {
      result.innerHTML =
        gameState.winner === "Draw"
          ? `<h1>Draw Game</h1>`
          : gameState.winner === "O"
          ? `<h1>Host Wins</h1>`
          : `<h1>Guest Wins</h1>`;
    } else {
      result.innerHTML = "";
    }

    if (gameState.status === "finished") {
      if (playerName === gameState.players.player1) {
        restart.style.visibility = "visible";
        waitingMsg.style.display = "none";
      } else {
        restart.style.visibility = "hidden";
        waitingMsg.style.display = "block";
        waitingMsg.innerText = "Waiting for host to restart";
      }
    } else {
      restart.style.visibility = "hidden";
      waitingMsg.style.display = "none";
    }

    if (gameState.restartId && playerName === gameState.players.player2) {
      resetGuestBoard();
    }

    gameState.board.forEach((symbol, index) => {
      if (previousBoard[index] !== symbol) {
        squares[index].innerHTML = symbol;

        if (symbol !== "" && previousBoard[index] === "") {
          squares[index].classList.add("flip");
          playSound(spin);
          squares[index].addEventListener(
            "animationend",
            () => squares[index].classList.remove("flip"),
            { once: true }
          );
        }
      }
    });

    previousBoard = [...gameState.board];

    if (gameState.score) {
      scoreO.innerText = gameState.score.O;
      scoreX.innerText = gameState.score.X;
      scoreDraw.innerText = gameState.score.draws;
    }

    const isPlayer1 = playerName === gameState.players.player1;
    const isPlayerTurn =
      (isPlayer1 && gameState.currentPlayer === "O") ||
      (!isPlayer1 && gameState.currentPlayer === "X");

    canPlay =
      gameState.status === "playing" && isPlayerTurn && !gameState.winner;
  });
}

function resetGuestBoard() {
  // Limpa completamente o tabuleiro visualmente
  squares.forEach((square) => {
    square.classList.remove("flip");
    square.innerHTML = "";
  });

  // Atualiza o previousBoard com um estado vazio para a próxima rodada
  previousBoard = Array(9).fill("");

  // Aguarda um pequeno delay antes de reanimar as peças no guest
  setTimeout(() => {
    currentGameRef.once("value").then((snapshot) => {
      const gameState = snapshot.val();
      if (!gameState) return;

      // Atualiza o tabuleiro do guest após o reset
      gameState.board.forEach((symbol, index) => {
        squares[index].innerHTML = symbol;
      });

      // Atualiza o placar
      scoreO.innerText = gameState.score.O;
      scoreX.innerText = gameState.score.X;
      scoreDraw.innerText = gameState.score.draws;
    });
  }, 200);
}

function makeOnlineMove(index) {
  currentGameRef.transaction((gameState) => {
    if (
      gameState &&
      gameState.status === "playing" &&
      !gameState.winner &&
      gameState.board[index] === ""
    ) {
      gameState.board[index] = gameState.currentPlayer;
      gameState.currentPlayer = gameState.currentPlayer === "O" ? "X" : "O";

      const winner = checkOnlineWinner(gameState.board);
      if (winner) {
        gameState.winner = winner;
        gameState.status = "finished";
        if (!gameState.score) {
          gameState.score = { O: 0, X: 0, draws: 0 };
        }
        if (winner === "O") {
          playSound(o);
          gameState.score.O++;
        } else if (winner === "X") {
          playSound(x);
          gameState.score.X++;
        }
      } else if (gameState.board.every((cell) => cell !== "")) {
        gameState.status = "finished";
        gameState.winner = "Draw";
        if (!gameState.score) {
          gameState.score = { O: 0, X: 0, draws: 0 };
        }
        gameState.score.draws++;
        playSound(draw);
      }
    }
    return gameState;
  });
}

function checkOnlineWinner(board) {
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

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

squares.forEach((square, index) => {
  square.addEventListener("click", () => {
    if (canPlay && square.innerHTML === "") {
      square.classList.add("flip");
      playSound(spin);
      makeOnlineMove(index);
    }
  });
});

function showGameIdToHost() {
  gameIdDisplay.innerHTML = `
    <div id="onlineContainer">
      <h2>Game ID: ${gameId}</h2>
      <p>Share this ID with your friend!</p>
      <div id="onlineStatus">Waiting for player 2...</div>
    </div>
  `;
  container.prepend(gameIdDisplay);
}

function hideJoinForm() {
  const joinForm = document.getElementById("joinForm");
  if (joinForm) joinForm.remove();
}

function restartGame() {
  currentGameRef.once("value").then((snapshot) => {
    const gameState = snapshot.val();
    if (playerName !== gameState.players.player1) return;

    squares.forEach((square, index) => {
      if (gameState.board[index] !== "") {
        square.classList.add("flip");
      }
    });

    setTimeout(() => {
      const newState = {
        players: gameState.players,
        board: ["", "", "", "", "", "", "", "", ""],
        currentPlayer: "O",
        status: "playing",
        winner: null,
        score: gameState.score,
        restartId: Date.now(),
      };

      currentGameRef.set(newState);
      result.innerHTML = "";

      squares.forEach((square) => {
        square.classList.remove("flip");
        square.innerHTML = "";
      });

      setTimeout(() => {
        resetGuestBoard();
      }, 500);
    }, 500);
  });
}

function StartTwoPlayersOnline(isHost) {
  gameStart();
  title.innerText = "Online Multiplayer";

  if (isHost) {
    createOnlineGame();
  } else {
    const joinForm = document.createElement("div");
    joinForm.id = "joinForm";
    joinForm.innerHTML = `
      <input type="text" id="gameIdInput" placeholder="Enter Game ID">
      <button id="startButton" onclick="joinOnlineGame(document.getElementById('gameIdInput').value)">Join Game</button>
      <div id="inputContainer"></div>
    `;
    container.prepend(joinForm);
  }
}

restart.addEventListener("click", restartGame);
