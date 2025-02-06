const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.25;
const FLAP = -4.5;
const SPAWN_RATE = 90;  // Frequency of new pipes
const PIPE_WIDTH = 50;
const PIPE_SPACING = 200;

let bird = {
  x: 50,
  y: canvas.height / 2,
  width: 20,
  height: 20,
  velocity: 0
};

let pipes = [];
let score = 0;
let gameOver = false;

document.addEventListener("keydown", flap);

function flap() {
  if (gameOver) {
    resetGame();
    return;
  }
  bird.velocity = FLAP;
}

function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
}

function drawBird() {
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - SPAWN_RATE) {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - PIPE_SPACING));
    pipes.push({
      x: canvas.width,
      top: pipeHeight,
      bottom: canvas.height - pipeHeight - PIPE_SPACING
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2;

    if (pipe.x + PIPE_WIDTH < 0) {
      pipes.splice(index, 1);
      score++;
    }

    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top); // top pipe
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, PIPE_WIDTH, pipe.bottom); // bottom pipe

    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + PIPE_WIDTH &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
  });
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 100, canvas.height / 2 - 20);
    ctx.fillText("Press any key to restart", 60, canvas.height / 2 + 20);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  requestAnimationFrame(gameLoop);
}

gameLoop();
