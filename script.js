const size = 5;
const mineCount = 5;
const game = document.getElementById("game");
const restartBtn = document.getElementById("restartBtn");

let board = [];
let gameOver = false;

function generateBoard() {
  board = [];

  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i][j] = {
        mine: false,
        revealed: false,
        element: null,
      };
    }
  }

  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
}

function countMines(r, c) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        if (board[nr][nc].mine) {
          count++;
        }
      }
    }
  }
  return count;
}

function revealCell(r, c) {
  const cell = board[r][c];
  if (cell.revealed || gameOver) return;

  cell.revealed = true;
  cell.element.classList.add("revealed");

  if (cell.mine) {
    cell.element.classList.add("mine");
    cell.element.textContent = "💣";
    endGame(false);
    return;
  }

  const count = countMines(r, c);
  if (count > 0) {
    cell.element.textContent = count;
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          revealCell(nr, nc);
        }
      }
    }
  }
}

function revealAll() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!board[i][j].revealed) {
        const cell = board[i][j];
        cell.revealed = true;
        cell.element.classList.add("revealed");

        if (cell.mine) {
          cell.element.classList.add("mine");
          cell.element.textContent = "💣";
        } else {
          const count = countMines(i, j);
          if (count > 0) cell.element.textContent = count;
        }
      }
    }
  }
}

function endGame(isWin) {
  gameOver = true;
  revealAll();
  setTimeout(() => {
    alert(isWin ? "승리했습니다!" : "지뢰를 밟았습니다! 게임 종료");
    restartBtn.style.display = "inline-block";
  }, 100);
}

function createGrid() {
  game.innerHTML = "";
  restartBtn.style.display = "none";
  gameOver = false;
  generateBoard();

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.addEventListener("click", () => revealCell(i, j));
      game.appendChild(div);
      board[i][j].element = div;
    }
  }
}

restartBtn.addEventListener("click", () => {
  createGrid();
});

createGrid();
