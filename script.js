const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const gameOverDisplay = document.getElementById('game-over');
const highScoreDisplayBoard = document.getElementById('high-score-display-board');
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

    // // Ball hits the wall
    // if (ballX - ball.offsetWidth / 2 <= 10 || ballX + ball.offsetWidth / 2 >= window.innerWidth - 10) {
    //     ballSpeedX = -ballSpeedX; // Reverse direction
    //     wallSound.play();
    // }

    // Ball hits the left wall
    if (ballX - ball.offsetWidth / 2 <= 10) {
        ballSpeedX = -ballSpeedX; // Reverse direction
        ballX = 10 + ball.offsetWidth / 2; // Prevent ball from going beyond the left wall
        wallSound.play();
    }

    // Ball hits the right wall
    if (ballX + ball.offsetWidth / 2 >= window.innerWidth - 10) {
        ballSpeedX = -ballSpeedX; // Reverse direction
        ballX = window.innerWidth - 10 - ball.offsetWidth / 2; // Prevent ball from going beyond the right wall
        wallSound.play();
    }


    // Ball hits the ground
    if (ballY + ball.offsetHeight / 2 >= window.innerHeight - 30) {
        // gameOverSound.play();
        // endGame();

        // Calculate sound volume based on speed

        // Check if the bounce speed is above a threshold
        const bounceThreshold = 5; // Minimum speed to play the sound
        if (Math.abs(ballSpeedY) > bounceThreshold) {
            // Calculate sound volume based on speed
            const maxSpeed = 40; // Adjust based on your game's max ball speed
            const normalizedSpeed = Math.min(Math.abs(ballSpeedY), maxSpeed) / maxSpeed;
            const volume = Math.max(0, normalizedSpeed); // Ensure a minimum volume of 0.2

            // Set the sound volume and play
            gameOverSound.volume = volume;
            gameOverSound.play();
        } else {
            // Mute the sound if the speed is below the threshold
            gameOverSound.pause();
            gameOverSound.currentTime = 0; // Reset the sound effect
        }

        // Bounce the ball when it hits the ground
        ballSpeedY = -(Math.abs(ballSpeedY) - 3); // Reverse and slightly reduce the speed
        ballSpeedX = ballSpeedX; // Maintain horizontal speed

        // Prevent ball from going below the screen
        ballY = window.innerHeight - 30 - ball.offsetHeight / 2;

        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.textContent = `High Score: ${highScore}`;
            highScoreDisplayBoard.textContent = `🎉🤩🥳 New High Score: ${highScore}`;
            highScoreDisplayBoard.classList.remove('hidden');

            setTimeout(() => {
                highScoreDisplayBoard.classList.add('hidden');
            }, 2000);
        }
        // Reset score
        score = 0;

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

    // Ball position
    const ballRect = ball.getBoundingClientRect();
    const ballCenterX = ballRect.left + ballRect.width / 2;
    const ballCenterY = ballRect.top + ballRect.height / 2;

    // Calculate the angle between the cursor and the ball center
    const deltaX = ballCenterX - cursorX;
    const deltaY = ballCenterY - cursorY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert radians to degrees 

    // Change the cursor with shuttlecock image
    gsap.to(".cursor", {
        x: cursorX - 10,
        y: cursorY,
        rotation: angle + 90, // Add 90 degrees to make the cursor point correctly
        duration: 0,
    })


});

// Restart button
restartBtn.addEventListener('click', restartGame);

// Initialize the game
setBallPosition();
updateBall();

// Hide the cursor
document.body.style.cursor = 'none';





const menuToggle = document.getElementById('menu-toggle');
const menuContent = document.getElementById('menu-content');

// Initialize GSAP timeline for menu
const menuAnimation = gsap.timeline({ paused: true, reversed: true });
menuAnimation.to('#menu-content', {
    height: 'auto',
    opacity: 1,
    duration: 0.3,
    ease: 'power2.inOut',
});

// Toggle menu visibility with GSAP
menuToggle.addEventListener('click', () => {
    console.log("Menu toggle triggered");
    if (menuAnimation.reversed()) {
        menuAnimation.play();
    } else {
        menuAnimation.reverse();
    }
});

// Cursor style selection
const cursorOptions = document.querySelectorAll('.cursor-option');
cursorOptions.forEach(button => {
    button.addEventListener('click', () => {
        const cursorImage = button.getAttribute('data-cursor');
        gsap.to('.cursor', {
            backgroundImage: `url('${cursorImage}')`,
            duration: 0.3,
            ease: 'power1.inOut',
        });
    });
});

// Background selection
const backgroundOptions = document.querySelectorAll('.background-option');
backgroundOptions.forEach(button => {
    button.addEventListener('click', () => {
        const bgImage = button.getAttribute('data-bg');
        gsap.to('body', {
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: 'cover',
            duration: 0.5,
            ease: 'power2.inOut',
        });
    });
});

// Difficulty level selection
const difficultyOptions = document.querySelectorAll('.difficulty-option');
difficultyOptions.forEach(button => {
    button.addEventListener('click', () => {
        const difficulty = button.getAttribute('data-difficulty');
        let newGravity, newBouncePower;

        // Update difficulty settings with GSAP feedback
        switch (difficulty) {
            case 'veryeasy':
                newGravity = 0.1;
                newBouncePower = 8;
                break;
            case 'easy':
                newGravity = 0.3;
                newBouncePower = 10;
                break;
            case 'medium':
                newGravity = 0.5;
                newBouncePower = 15;
                break;
            case 'hard':
                newGravity = 0.8;
                newBouncePower = 20;
                break;
            case 'extreme':
                newGravity = 1.2;
                newBouncePower = 20;
                break;
        }

        gsap.to(window, {
            onStart: () => alert(`Difficulty set to ${difficulty.toUpperCase()}`),
            onComplete: () => {
                gravity = newGravity;
                bouncePower = newBouncePower;
            },
            duration: 0.2,
        });
    });
});


