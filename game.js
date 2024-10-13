const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let gameRunning = false;
let score = 0;
let level = 1;
let prizeX = 0;
let prizeY = 0;
let prizeRadius = 5;
let prizeSpeed = 1;
let prizeActive = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPrize() {
    if (prizeActive) {
        ctx.beginPath();
        ctx.arc(prizeX, prizeY, prizeRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
        ctx.closePath();
    }
}

function drawScore() {
    document.getElementById('score').textContent = `Отбито мячей: ${score}`;
}

function drawLevel() {
    document.getElementById('level').textContent = `Уровень: ${level}`;
}

function spawnPrize() {
    prizeX = Math.random() * (canvas.width - prizeRadius * 2) + prizeRadius;
    prizeY = 0;
    prizeActive = true;
}

function checkPrizeCollision() {
    if (prizeActive && prizeY + prizeRadius > canvas.height - paddleHeight && prizeX > paddleX && prizeX < paddleX + paddleWidth) {
        prizeActive = false;
        score += 5; // Приз дает дополнительные очки
        if (score >= level * 10) {
            levelUp();
        }
    }
}

function levelUp() {
    level++;
    dx *= 1.2; // Увеличиваем скорость мяча
    dy *= 1.2;
    prizeSpeed *= 1.2; // Увеличиваем скорость призов
    drawLevel();
}

function draw() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawPrize();
    drawScore();
    drawLevel();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            score++;
            if (score >= level * 10) {
                levelUp();
            }
        } else {
            alert("Игра окончена");
            document.location.reload();
        }
    }

    x += dx;
    y += dy;

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    if (prizeActive) {
        prizeY += prizeSpeed;
        if (prizeY > canvas.height) {
            prizeActive = false;
        }
    } else {
        if (Math.random() < 0.01) {
            spawnPrize();
        }
    }

    checkPrizeCollision();

    requestAnimationFrame(draw);
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        draw();
    }
}

function pauseGame() {
    gameRunning = false;
}