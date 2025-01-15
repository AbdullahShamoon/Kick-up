const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const gameOverDisplay = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

const hitSound = document.getElementById('hit-sound');
const wallSound = document.getElementById('wall-sound');
const gameOverSound = document.getElementById('game-over-sound');

let ballX = window.innerWidth / 2;
let ballY = window.innerHeight / 3;
let ballSpeedX = 0;
let ballSpeedY = 0;
let gravity = 0.5;
let drag = 0.99;
let bouncePower = 15;
let score = 0;
let highScore = 0;
let isGameOver = false;

let cursorX = 0; // Cursor's X position
let cursorY = 0; // Cursor's Y position

// Load high score from localStorage
if (localStorage.getItem('highScore')) {
    highScore = parseInt(localStorage.getItem('highScore'), 10);
    highScoreDisplay.textContent = `High Score: ${highScore}`;
}

// Set ball's initial position
function setBallPosition() {
    ball.style.left = `${ballX - ball.offsetWidth / 2}px`;
    ball.style.top = `${ballY - ball.offsetHeight / 3}px`;
}

// Update the ball position and check for collisions
function updateBall() {
    if (isGameOver) return;

    // Apply gravity and drag
    ballSpeedY += gravity;
    ballSpeedX *= drag;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball hits the wall
    if (ballX - ball.offsetWidth / 2 <= 10 || ballX + ball.offsetWidth / 2 >= window.innerWidth - 10) {
        ballSpeedX = -ballSpeedX; // Reverse direction
        wallSound.play();
    }

    // Ball hits the ground
    if (ballY + ball.offsetHeight / 2 >= window.innerHeight - 30) {
        gameOverSound.play();
        endGame();
    }

    // Prevent ball from going above the screen
    // if (ballY - ball.offsetHeight / 2 <= 0) {
    //     ballSpeedY = Math.abs(ballSpeedY);
    // }

    // Check collision with the cursor
    checkCollision();

    setBallPosition();
    requestAnimationFrame(updateBall);
}

// Check if the cursor is inside the ball
function checkCollision() {
    const ballRect = ball.getBoundingClientRect();
    const ballCenterX = ballRect.left + ballRect.width / 2;
    const ballCenterY = ballRect.top + ballRect.height / 2;

    // Calculate the distance between the cursor and the ball center
    const deltaX = cursorX - ballCenterX;
    const deltaY = cursorY - ballCenterY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    // If the cursor is inside the ball
    if (distance <= ballRect.width / 2) {
        // Normalize the direction vector
        const normalizedDeltaX = deltaX / distance;
        const normalizedDeltaY = deltaY / distance;

        // Apply bounce
        ballSpeedX = -normalizedDeltaX * bouncePower;
        ballSpeedY = -normalizedDeltaY * bouncePower;

        // Increase score
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;

        hitSound.play();
    }
}

// End the game
function endGame() {
    isGameOver = true;

    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }

    gameOverDisplay.classList.remove('hidden'); // Show the game-over screen
}

// Restart the game
function restartGame() {
    console.log("Restart game triggered");

    ballX = window.innerWidth / 2;
    ballY = window.innerHeight / 3;
    ballSpeedX = 0;
    ballSpeedY = 0;

    score = 0;
    isGameOver = false;

    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.classList.add('hidden'); // Hide the game-over screen
    setBallPosition();
    updateBall();
}

// Track the mouse position
window.addEventListener('mousemove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
});

// Restart button
restartBtn.addEventListener('click', restartGame);

// Initialize the game
setBallPosition();
updateBall();
