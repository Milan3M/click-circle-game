const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");
const result = document.getElementById("result");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");

let score = 0;
let timeLeft = 30;
let timer = null;
let playing = false;
let best = 0;

try {
  best = Number(localStorage.getItem("clickCircleBest")) || 0;
} catch (_) {}

bestEl.textContent = best;

function moveTarget() {
  const padding = 8;
  const maxX = Math.max(padding, gameArea.clientWidth - target.offsetWidth - padding);
  const maxY = Math.max(padding, gameArea.clientHeight - target.offsetHeight - padding);

  target.style.left = `${padding + Math.random() * (maxX - padding)}px`;
  target.style.top = `${padding + Math.random() * (maxY - padding)}px`;
}

function startGame() {
  clearInterval(timer);
  score = 0;
  timeLeft = 30;
  playing = true;

  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  result.textContent = "";
  message.style.display = "none";
  restartBtn.style.display = "none";
  target.style.display = "block";

  moveTarget();

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function hitTarget() {
  if (!playing) return;
  score++;
  scoreEl.textContent = score;
  moveTarget();
}

function endGame() {
  clearInterval(timer);
  timer = null;
  playing = false;
  target.style.display = "none";
  message.style.display = "grid";
  message.querySelector("h2").textContent = "Time's up!";

  if (score > best) {
    best = score;
    bestEl.textContent = best;
    try {
      localStorage.setItem("clickCircleBest", String(best));
    } catch (_) {}
    result.textContent = `New best score: ${score}! 🎉`;
  } else {
    result.textContent = `Your score: ${score}. Best score: ${best}.`;
  }

  startBtn.textContent = "Play Again";
  restartBtn.style.display = "inline-block";
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
target.addEventListener("click", hitTarget);

window.addEventListener("resize", () => {
  if (playing) moveTarget();
});
