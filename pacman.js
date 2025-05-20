// Simple Pacman clone in JavaScript using HTML5 Canvas with Ghosts
// Based on https://github.com/plemaster01/PythonPacman

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 560;
canvas.height = 620;
document.body.appendChild(canvas);

const TILE_SIZE = 20;
const ROWS = 31;
const COLS = 28;

let level = [
  "############################",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#o####.#####.##.#####.####o#",
  "#.####.#####.##.#####.####.#",
  "#..........................#",
  "#.####.##.########.##.####.#",
  "#.####.##.########.##.####.#",
  "#......##....##....##......#",
  "######.##### ## #####.######",
  "######.##### ## #####.######",
  "######.##          ##.######",
  "######.## ######## ##.######",
  "######.## ######## ##.######",
  "      .   ########   .      ",
  "######.## ######## ##.######",
  "######.## ######## ##.######",
  "######.##          ##.######",
  "######.## ######## ##.######",
  "######.## ######## ##.######",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#.####.#####.##.#####.####.#",
  "#o..##................##..o#",
  "###.##.##.########.##.##.###",
  "###.##.##.########.##.##.###",
  "#......##....##....##......#",
  "#.##########.##.##########.#",
  "#..........................#",
  "############################"
];

// Pacman
let pacman = {
  x: 13 * TILE_SIZE,
  y: 23 * TILE_SIZE,
  dx: 0,
  dy: 0,
  speed: 2
};

// Ghosts
const GHOST_COLORS = ["red", "pink", "cyan", "orange"];
let ghosts = [];
for (let i = 0; i < 4; i++) {
  ghosts.push({
    x: (13 + (i - 1.5)) * TILE_SIZE,
    y: 14 * TILE_SIZE,
    dx: TILE_SIZE,
    dy: 0,
    speed: 1,
    color: GHOST_COLORS[i]
  });
}

let keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function drawTile(x, y, type) {
  switch (type) {
    case "#":
      ctx.fillStyle = "blue";
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      break;
    case ".":
    case "o":
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, type === "." ? 2 : 5, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
}

function canMove(x, y) {
  let row = Math.floor(y / TILE_SIZE);
  let col = Math.floor(x / TILE_SIZE);
  return level[row][col] !== "#";
}

function updatePacman() {
  if (keys["ArrowUp"] && canMove(pacman.x, pacman.y - pacman.speed)) {
    pacman.dx = 0; pacman.dy = -pacman.speed;
  } else if (keys["ArrowDown"] && canMove(pacman.x, pacman.y + pacman.speed)) {
    pacman.dx = 0; pacman.dy = pacman.speed;
  } else if (keys["ArrowLeft"] && canMove(pacman.x - pacman.speed, pacman.y)) {
    pacman.dx = -pacman.speed; pacman.dy = 0;
  } else if (keys["ArrowRight"] && canMove(pacman.x + pacman.speed, pacman.y)) {
    pacman.dx = pacman.speed; pacman.dy = 0;
  }
  let nextX = pacman.x + pacman.dx;
  let nextY = pacman.y + pacman.dy;
  if (canMove(nextX, nextY)) {
    pacman.x = nextX;
    pacman.y = nextY;
    // Eat pellets
    let row = Math.floor(pacman.y / TILE_SIZE);
    let col = Math.floor(pacman.x / TILE_SIZE);
    if (level[row][col] === "." || level[row][col] === "o") {
      level[row] = level[row].substr(0, col) + " " + level[row].substr(col + 1);
    }
  }
}

function updateGhosts() {
  ghosts.forEach(ghost => {
    // Random direction choice at intersections
    if (Math.random() < 0.02) {
      const dirs = [
        {dx: ghost.speed, dy: 0},
        {dx: -ghost.speed, dy: 0},
        {dx: 0, dy: ghost.speed},
        {dx: 0, dy: -ghost.speed}
      ];
      let choice = dirs[Math.floor(Math.random() * dirs.length)];
      if (canMove(ghost.x + choice.dx, ghost.y + choice.dy)) {
        ghost.dx = choice.dx;
        ghost.dy = choice.dy;
      }
    }
    // Move ghost
    let nextX = ghost.x + ghost.dx;
    let nextY = ghost.y + ghost.dy;
    if (canMove(nextX, nextY)) {
      ghost.x = nextX;
      ghost.y = nextY;
    } else {
      // Reverse on collision with wall
      ghost.dx *= -1;
      ghost.dy *= -1;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw maze
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      drawTile(col * TILE_SIZE, row * TILE_SIZE, level[row][col]);
    }
  }
  // Draw Pacman
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(pacman.x + TILE_SIZE / 2, pacman.y + TILE_SIZE / 2, TILE_SIZE / 2 - 2, 0.25 * Math.PI, 1.75 * Math.PI);
  ctx.lineTo(pacman.x + TILE_SIZE / 2, pacman.y + TILE_SIZE / 2);
  ctx.fill();
  // Draw Ghosts
  ghosts.forEach(ghost => {
    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    ctx.arc(ghost.x + TILE_SIZE / 2, ghost.y + TILE_SIZE / 2, TILE_SIZE / 2 - 2, Math.PI, 0);
    ctx.lineTo(ghost.x + TILE_SIZE * 1.5 - 2, ghost.y + TILE_SIZE - 2);
    ctx.lineTo(ghost.x + 2, ghost.y + TILE_SIZE - 2);
    ctx.closePath();
    ctx.fill();
    // Eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ghost.x + TILE_SIZE / 2 - 4, ghost.y + TILE_SIZE / 2 - 2, 3, 0, Math.PI * 2);
    ctx.arc(ghost.x + TILE_SIZE / 2 + 4, ghost.y + TILE_SIZE / 2 - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(ghost.x + TILE_SIZE / 2 - 4 + ghost.dx, ghost.y + TILE_SIZE / 2 - 2 + ghost.dy, 1.5, 0, Math.PI * 2);
    ctx.arc(ghost.x + TILE_SIZE / 2 + 4 + ghost.dx, ghost.y + TILE_SIZE / 2 - 2 + ghost.dy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function gameLoop() {
  updatePacman();
  updateGhosts();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
