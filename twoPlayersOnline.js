// Certifique-se de que as variáveis e funções (gamesRef, squares, container, title, result,
// restart, scoreO, scoreX, scoreDraw, spin, gameStart(), etc.) estejam definidas e inicializadas.

let currentGameRef;
let gameId;
let playerName;
let previousBoard = Array(9).fill("");

const gameIdDisplay = document.getElementById("onlineContainer");

const waitingMsg = document.getElementById("waitingMsg"); // Elemento para mensagem do guest

function playSound(sound) {
  // Sua implementação para reproduzir o som
  sound.play();
}

function generateGameId() {
  return Math.random().toString(36).substr(2, 5);
}

function createOnlineGame() {
  gameId = generateGameId();
  currentGameRef = gamesRef.child(gameId);
  playerName = `Player1_${Date.now()}`;

  // Estado inicial com placar e lastRestart
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

    // Exibe o resultado quando o jogo terminar
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

    // Controle de restart
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

    // Se houve um reset, limpa o board do guest
    if (gameState.restartId && playerName === gameState.players.player2) {
      resetGuestBoard();
    }

    // Atualiza o tabuleiro e anima somente as novas jogadas
    gameState.board.forEach((symbol, index) => {
      if (previousBoard[index] !== symbol) {
        squares[index].innerHTML = symbol;

        // Apenas anima se for uma nova jogada (não deve animar as jogadas já feitas)
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

    // Atualiza previousBoard para refletir o estado atual
    previousBoard = [...gameState.board];

    // Atualiza o placar
    if (gameState.score) {
      scoreO.innerText = gameState.score.O;
      scoreX.innerText = gameState.score.X;
      scoreDraw.innerText = gameState.score.draws;
    }

    // Define se é a vez do jogador local
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

      // Verifica vitória ou empate e atualiza o placar
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
    [6, 7, 8], // Linhas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Colunas
    [0, 4, 8],
    [2, 4, 6], // Diagonais
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Eventos de clique para cada célula do tabuleiro
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

// Apenas o host pode reiniciar: quando clicado, atualiza o estado do jogo para ambos
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
        restartId: Date.now(), // 🔥 Importante para o guest detectar o reinício
      };

      currentGameRef.set(newState);
      result.innerHTML = "";

      squares.forEach((square) => {
        square.classList.remove("flip");
        square.innerHTML = "";
      });

      // 🔥 Força o guest a atualizar corretamente após o reset
      setTimeout(() => {
        resetGuestBoard();
      }, 500);
    }, 500);
  });
}

function StartTwoPlayersOnline(isHost) {
  gameStart(); // Função que prepara a interface e reseta o tabuleiro
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

// Apenas o host terá o botão funcional; o guest só verá a mensagem de aguardo.
restart.addEventListener("click", restartGame);
