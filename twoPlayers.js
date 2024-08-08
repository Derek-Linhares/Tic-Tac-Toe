function StartTwoPlayers() {
  gameStart();
  playSound(background);
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
}
