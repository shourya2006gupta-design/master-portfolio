
function startGame() {
    document.getElementById('start').style.display = 'none';
}

// player constant 
const player = document.getElementById('player');
let x = 100;
let y = 0;

// moving constant
let velocityY = 0;
let moveLeft = false;
let moveRight = false;
let jumping = false;

// game
let score = 0;
let gameCompleted = false;
let lastSpaceTime = 0;
let canDoubleJump = false;
const DOUBLE_PRESS_DELAY = 500;
let obtainedcoin = null;

const htmlquiz = [
    {
        question: "What does HTML stand for?",
        answers: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Home Tool Markup Language",
            "Hyper Transfer Markup Language"
        ],
        correct: "Hyper Text Markup Language"
    },
    {
        question: "Which tag is used for the largest heading?",
        answers: ["<h6>", "<head>", "<h1>", "<heading>"],
        correct: "<h1>"
    },
    {
        question: "Which tag is used to insert an image?",
        answers: ["<img>", "<image>", "<src>", "<pic>"],
        correct: "<img>"
    },
];
const cssquiz = [
    {
        question: "What does CSS stand for?",
        answers: [
            "Cascading Style Sheets",
            "Creative Style System",
            "Computer Style Sheet",
            "Colorful Style Syntax"
        ],
        correct: "Cascading Style Sheets"
    },
    {
        question: "Which property changes text color in CSS?",
        answers: ["font-color", "text-color", "color", "style-color"],
        correct: "color"
    },
    {
        question: "How do you select an element with id 'box' in CSS?",
        answers: [".box", "#box", "*box", "box"],
        correct: "#box"
    }
];
const jsquiz = [
    {
        question: "Which keyword is used to create a function?",
        answers: ["function", "func", "def", "create"],
        correct: "function"
    },
    {
        question: "Which function is used to print something in browser console?",
        answers: ["print()", "log()", "console.log()", "echo()"],
        correct: "console.log()"
    },

    {
        question: "Which method is used to find length of a string?",
        answers: ["size()", "length()", "len", "length"],
        correct: "length"
    }
];


let currentQuestion = 0;
let quiz = []
const question = document.getElementById("questions");
const answers = document.getElementById("answers");
const correction = document.getElementById("correction");
const hacked = document.getElementById("hacked");
const quizgame = document.getElementById("quizgame");
let quizgameactive = false;

// gameplay 
document.addEventListener('keydown', e => {
    if (quizgameactive) return;
    if ((e.key === 'ArrowRight' || e.key === 'd')) {
        moveRight = true;
    }
    if ((e.key === 'ArrowLeft' || e.key === 'a')) {
        moveLeft = true;
    }
    if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && !jumping) {
        velocityY = -20;
        jumping = true;
        canDoubleJump = true;
    }
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        const now = Date.now();
        if (now - lastSpaceTime < DOUBLE_PRESS_DELAY && canDoubleJump) {
            velocityY = -20;
            jumping = true;
            canDoubleJump = false;
        }
        lastSpaceTime = now

    }
});

document.addEventListener('keyup', e => {

    if (e.key === 'ArrowRight' || e.key === 'd') {
        moveRight = false;

    }

    if (e.key === 'ArrowLeft' || e.key === 'a') {
        moveLeft = false;
    }
});

const rleg = document.getElementById('rleg');
const lleg = document.getElementById('lleg');


// game loop
function gameLoop() {
    if (!gameCompleted) {
        if (moveRight) {
            x += 15;
            player.style.transform = 'scaleX(1)';
            rleg.classList.add('walk1');
            lleg.classList.add('walk');
        }

        if (moveLeft) {
            x -= 15;
            player.style.transform = 'scaleX(-1)';
            rleg.classList.add('walk1');
            lleg.classList.add('walk');
        }


        if (!moveLeft && !moveRight) {
            rleg.classList.remove('walk1');
            lleg.classList.remove('walk');
        }

        if (x < 0) x = 0;
        velocityY += 1;
        y += velocityY;
        if (y > 0) {
            y = 0;
            velocityY = 0;
            jumping = false;
        }
        player.style.left = x + 'px';
        player.style.top = (window.innerHeight - 333 + y) + 'px';
        window.scrollTo(x - 300, 0);




        document.querySelectorAll('.enemy').forEach(enemy => {
            if (quizgameactive) return;

            let ex = enemy.getBoundingClientRect().left; // ✅ reads actual visual position after translateX
            let ew = enemy.offsetWidth;
            let eh = enemy.offsetHeight;
            let ey = enemy.getBoundingClientRect().top;
            let px = player.getBoundingClientRect().left;
            let py = player.getBoundingClientRect().top;

            if (
                px < ex + ew &&
                px + 50 > ex &&
                py < ey + eh &&
                py + 158 > ey
            ) {
                gameCompleted = true;
                hacked.style.display = 'flex';
            }
        });


        document.querySelectorAll('.coin').forEach(coin => {

            if (coin.style.display !== 'none') {
                let cx = coin.offsetLeft;
                let cy = coin.offsetTop;

                if (
                    x + 50 > cx &&
                    x < cx + 61 &&
                    player.offsetTop < cy + 60 &&
                    player.offsetTop + 158 > cy
                ) {    document.getElementById('enemybox').classList.add('paused');

                    if (coin.id === 'htmlcoin' && quizgameactive === false) {
                        rleg.classList.remove('walk1');
                        lleg.classList.remove('walk');
                        moveLeft = false;
                        moveRight = false;
                        quizgameactive = true
                        obtainedcoin = coin;
                        coin.classList.add("coincollect13");
                        setTimeout(() => {
                            quizgame.style.display = 'flex';
                            loadQuestion();
                        }, 2000);
                        quiz = htmlquiz;

                    }

                    if (coin.id === 'csscoin' && quizgameactive === false) {
                        rleg.classList.remove('walk1');
                        lleg.classList.remove('walk');
                        moveLeft = false;
                        moveRight = false;
                        quizgameactive = true
                        obtainedcoin = coin;
                        coin.classList.add("coincollect2");
                        setTimeout(() => {
                            quizgame.style.display = 'flex';
                            loadQuestion();
                        }, 2000);
                        quiz = cssquiz;

                    }

                    if (coin.id === 'jscoin' && quizgameactive === false) {
                        rleg.classList.remove('walk1');
                        lleg.classList.remove('walk');
                        moveLeft = false;
                        moveRight = false;
                        quizgameactive = true
                        coin.classList.add("coincollect13");
                        obtainedcoin = coin;
                        setTimeout(() => {
                            quizgame.style.display = 'flex';
                            loadQuestion();
                        }, 2000);
                        quiz = jsquiz;
                    }
                    if (coin.id === 'cointest' && quizgameactive === false) {
                        coin.style.display = 'none';
                        score += 1;
                        document.getElementById('coins').innerText = "COINS :" + score;
                    }
                }

            }

        }
        )
    }
    const flag = document.getElementById('flag');
    const flagPosition = flag.offsetLeft;
    if (
        x >= flagPosition - 100 &&
        score >= 0 &&
        !gameCompleted
    ) {
        gameCompleted = true;
        moveLeft = true;
        moveRight = true;
        document.getElementById('contactPopup').style.display = 'flex';
    }


    requestAnimationFrame(gameLoop);
}

gameLoop();

function loadQuestion() {
    // quizgameactive = true;
    moveLeft = false;
    moveRight = false;

    const q = quiz[currentQuestion];
    question.innerText = q.question;
    answers.innerHTML = "";

    q.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.classList.add("qbtn");
        button.onclick = () => checkAnswer(answer);
        answers.appendChild(button);
    });
}
function checkAnswer(answer) {
    // quizgameactive = true;
    if (answer === quiz[currentQuestion].correct) {
        correction.innerText = "✅ Correct!";
    }
    else {
        hacked.style.display = 'flex';
        gameCompleted = true;
        return;
    }

    setTimeout(() => {
        correction.innerText = "";
        correction.className = "";
    }, 1000);

    currentQuestion += 1;
    if (currentQuestion < quiz.length) {
        loadQuestion();
    }
    else {
        showResult();
    }
}

function showResult() {
    document.getElementById('enemybox').classList.remove('paused');
    quizgameactive = false;
    question.innerHTML = "";
    answers.innerHTML = "";
    obtainedcoin.style.display = 'none';
    quizgame.style.display = 'none';
    currentQuestion = 0
    quiz = []
    score += 1;
    document.getElementById('coins').innerText = "COINS :" + score;

}


function closePopup() {
    document.getElementById('contactPopup').style.display = 'none';
    document.getElementById('thank').style.display = 'flex';
    gameCompleted = true
}
