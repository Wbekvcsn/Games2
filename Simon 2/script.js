



const colors = ["W", "S", "A", "Q"];


let gameSequence = [];

let userSequence = [];


let level = 0;

let bestScore = localStorage.getItem("simonBest") || 0;

let gameStarted = false;

let acceptingInput = false;

let strictMode = false;

let soundEnabled = true;



const buttons = document.querySelectorAll(".color-button");

const startBtn = document.getElementById("startBtn");

const strictBtn = document.getElementById("strictBtn");

const soundBtn = document.getElementById("soundBtn");

const difficulty = document.getElementById("difficulty");

const levelDisplay = document.getElementById("level");

const bestDisplay = document.getElementById("best");

const message = document.getElementById("message");

const subMessage = document.getElementById("sub-message");



bestDisplay.textContent = bestScore;



const audioContext = new (
    window.AudioContext ||
    window.webkitAudioContext
)();


const frequencies = {

    W: 329.63,

    S: 261.63,

    A: 220.00,

    Q: 164.81

};


function playSound(color) {

    if (!soundEnabled) {
        return;
    }

    const oscillator = audioContext.createOscillator();

    const gainNode = audioContext.createGain();


    oscillator.frequency.value = frequencies[color];

    oscillator.type = "sine";


    gainNode.gain.setValueAtTime(
        0.25,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
    );


    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.3
    );
}



function flashButton(color) {

    const button = document.getElementById(color);

    if (!button) {
        return;
    }


    button.classList.add("flash");

    playSound(color);


    setTimeout(() => {

        button.classList.remove("flash");

    }, 400);
}

startBtn.addEventListener("click", startGame);


function startGame() {

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }


    gameSequence = [];

    userSequence = [];

    level = 0;

    gameStarted = true;

    acceptingInput = false;


    levelDisplay.textContent = "0";


    message.textContent = "Watch";

    subMessage.textContent = "Remember the sequence";


    startBtn.textContent = "Restart";


    nextLevel();
}



function nextLevel() {

    userSequence = [];

    level++;


    levelDisplay.textContent = level;


    message.textContent = "Watch!";

    subMessage.textContent = "Follow the pattern";


    
    const randomIndex =
        Math.floor(Math.random() * colors.length);


    const randomColor = colors[randomIndex];


    gameSequence.push(randomColor);


    acceptingInput = false;


    playSequence();
}



function playSequence() {

    let delay = 700;


  
    if (difficulty.value === "easy") {
        delay = 900;
    }

    if (difficulty.value === "hard") {
        delay = 450;
    }


    gameSequence.forEach((color, index) => {

        setTimeout(() => {

            flashButton(color);

        }, index * delay);

    });


    setTimeout(() => {

        acceptingInput = true;

        message.textContent = "Your Turn";

        subMessage.textContent = "Repeat the pattern";

    }, gameSequence.length * delay + 200);
}



buttons.forEach(button => {

    button.addEventListener("click", () => {

        if (!gameStarted || !acceptingInput) {
            return;
        }


        const color = button.id;


        playerInput(color);

    });

});



function playerInput(color) {

    userSequence.push(color);


   
    const button = document.getElementById(color);

    button.classList.add("pressed");

    playSound(color);


    setTimeout(() => {

        button.classList.remove("pressed");

    }, 150);


    const currentIndex =
        userSequence.length - 1;


   
    if (
        userSequence[currentIndex] !==
        gameSequence[currentIndex]
    ) {

        wrongAnswer();

        return;
    }


    
    if (
        userSequence.length ===
        gameSequence.length
    ) {

        acceptingInput = false;


        message.textContent = "Correct!";

        subMessage.textContent = "Get ready";


        setTimeout(() => {

            nextLevel();

        }, 900);

    }

}


function wrongAnswer() {

    acceptingInput = false;


    message.textContent = "Wrong!";

    subMessage.textContent =
        "Press Start to try again";


    document.body.classList.add("game-over");


    setTimeout(() => {

        document.body.classList.remove("game-over");

    }, 400);


    
    if (strictMode) {

        gameSequence = [];

        userSequence = [];

        level = 0;

        levelDisplay.textContent = "0";


        gameStarted = false;

        startBtn.textContent = "Start";


        return;
    }


    userSequence = [];


    setTimeout(() => {

        message.textContent = "Try Again";

        subMessage.textContent =
            "Watch the sequence";

        playSequence();

    }, 1000);
}



strictBtn.addEventListener("click", () => {

    strictMode = !strictMode;


    if (strictMode) {

        strictBtn.textContent =
            "Strict: on";

        strictBtn.classList.add("active");

    } else {

        strictBtn.textContent =
            "Strict: off";

        strictBtn.classList.remove("active");

    }

});

soundBtn.addEventListener("click", () => {

    soundEnabled = !soundEnabled;


    if (soundEnabled) {

        soundBtn.textContent =
            "Sound: on";

        soundBtn.classList.add("active");

    } else {

        soundBtn.textContent =
            "Sound: off";

        soundBtn.classList.remove("active");

    }

});



document.addEventListener("keydown", event => {

    const key = event.key.toUpperCase();


  
    if (
        !gameStarted &&
        (key === "ENTER" || event.code === "Space")
    ) {

        startGame();

        return;
    }


  
    if (
        colors.includes(key) &&
        gameStarted &&
        acceptingInput
    ) {

        playerInput(key);

    }

});



function updateBestScore() {

    if (level > bestScore) {

        bestScore = level;


        bestDisplay.textContent =
            bestScore;


        localStorage.setItem(
            "simonBest",
            bestScore
        );

    }

}