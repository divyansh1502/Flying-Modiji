const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImg = new Image();
birdImg.src = "bird.png";

const pipeImg = new Image();
pipeImg.src = "rahul.webp";

const jumpSound = new Audio("maka.mp3");
const gameOverSound = new Audio("gameover.mp3");
const bgMusic = new Audio("music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.9;

let bird = {
  x: 70,
  y: 150,
  width: 30,
  height: 30,
  gravity: 0.15,
  lift: -4,
  velocity: 0
};

let pipes = [];
let score = 0;
let gameOver = false;
let frame = 0;
let gap = 140;
let gameSpeed = 1.2;

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(pipeImg, pipe.x, pipe.y, pipe.width, pipe.height);
    ctx.drawImage(
      pipeImg,
      pipe.x,
      pipe.y + pipe.height + gap,
      pipe.width,
      canvas.height - pipe.height - gap
    );
  });
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "20px sans-serif";
  ctx.fillText("Total Vote Chori: " + score, 10, 30);
}

function update() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height >= canvas.height) endGame();

  if (frame % 140 === 0) {
    let pipeHeight = Math.random() * (canvas.height / 2);
    pipes.push({
      x: canvas.width,
      y: 0,
      width: 70,
      height: pipeHeight
    });
  }

  pipes.forEach(pipe => (pipe.x -= gameSpeed));

  if (pipes.length && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
    score++;
  }

  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.height || bird.y + bird.height > pipe.height + gap)
    ) {
      endGame();
    }
  });

  frame++;
}

function endGame() {
  gameOver = true;
  bgMusic.pause();
  gameOverSound.play();
  document.getElementById("gameOver").style.display = "block";
  document.getElementById("finalScore").textContent = score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

// ✅ Works on both PC & mobile:
function jump() {
  if (!gameOver) {
    bird.velocity = bird.lift;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

// Keyboard (PC)
document.addEventListener("keydown", jump);

// Touch & Click (Mobile + PC)
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // stop scrolling on mobile
  jump();
});
canvas.addEventListener("mousedown", jump);

document.getElementById("restartBtn")?.addEventListener("click", restartGame);

function restartGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  document.getElementById("gameOver").style.display = "none";
  bgMusic.currentTime = 0;
  bgMusic.play();
  gameLoop();
}

window.onload = () => {
  bgMusic.play();
  gameLoop();
};
