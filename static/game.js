const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;

function resizeCanvas() {

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// ---------------- GAME VARIABLES ----------------

let running = false;

let score = 0;

let player = {
    x: 200,
    y: 200,
    size: 22,
    speed: 4
};

let keys = {};

let completed = [];


// ---------------- KEYBOARD ----------------

window.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

});

window.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});


// ---------------- START ----------------

document.getElementById("startButton").onclick = function() {

    running = true;

    document.getElementById("gameMessage").style.display = "none";

    gameLoop();

};


// ---------------- SCORE ----------------

function addScore(points) {

    score += points;

    document.getElementById("score").innerText = score;

}


// ---------------- PLAYER ----------------

function movePlayer() {

    if (keys["w"]) {
        player.y -= player.speed;
    }

    if (keys["s"]) {
        player.y += player.speed;
    }

    if (keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["d"]) {
        player.x += player.speed;
    }

    player.x = Math.max(
        30,
        Math.min(width - 30, player.x)
    );

    player.y = Math.max(
        100,
        Math.min(height - 40, player.y)
    );

}


// ---------------- BACKGROUND ----------------

function drawBackground() {

    let gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );

    gradient.addColorStop(0, "#071421");
    gradient.addColorStop(0.5, "#182a2d");
    gradient.addColorStop(1, "#342416");

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

}


// ---------------- GROUND ----------------

function drawGround() {

    ctx.fillStyle = "#493624";

    ctx.fillRect(
        0,
        height * 0.65,
        width,
        height * 0.35
    );

    for (
        let x = 0;
        x < width;
        x += 80
    ) {

        ctx.strokeStyle =
            "rgba(255,255,255,0.05)";

        ctx.beginPath();

        ctx.moveTo(x, height * 0.65);

        ctx.lineTo(
            x + 40,
            height
        );

        ctx.stroke();

    }

}


// ---------------- PLAYER ----------------

function drawPlayer() {

    // shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.4)";

    ctx.beginPath();

    ctx.ellipse(
        player.x,
        player.y + 18,
        25,
        9,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // body

    ctx.fillStyle = "#315d72";

    ctx.fillRect(
        player.x - 12,
        player.y - 5,
        24,
        30
    );


    // head

    ctx.fillStyle = "#b87850";

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y - 16,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // hair

    ctx.fillStyle = "#211710";

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y - 20,
        12,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

}


// ---------------- LOST SEAL ----------------

const lostObjects = [

    {
        x: 260,
        y: 300,
        name: "Ancient Workshop",
        emoji: "🏛️",
        points: 10
    },

    {
        x: 550,
        y: 400,
        name: "Clay Pottery",
        emoji: "🏺",
        points: 10
    },

    {
        x: 800,
        y: 300,
        name: "Carved Stone",
        emoji: "🪨",
        points: 10
    },

    {
        x: 1000,
        y: 450,
        name: "Mysterious Seal",
        emoji: "🔱",
        points: 30
    }

];


function drawLostSeal() {

    drawBackground();

    drawGround();


    // ancient buildings

    for (
        let x = 80;
        x < width;
        x += 250
    ) {

        ctx.fillStyle = "#79583d";

        ctx.fillRect(
            x,
            200,
            150,
            150
        );

        ctx.fillStyle = "#35271d";

        ctx.fillRect(
            x + 45,
            280,
            45,
            70
        );

    }


    lostObjects.forEach(function(object, index) {

        ctx.font = "42px Arial";

        ctx.fillText(
            object.emoji,
            object.x - 20,
            object.y
        );

        ctx.font = "14px Arial";

        ctx.fillStyle = "white";

        ctx.fillText(
            object.name,
            object.x - 45,
            object.y + 30
        );

    });


    drawPlayer();


    if (keys["e"]) {

        lostObjects.forEach(
            function(object, index) {

                let distance =
                    Math.hypot(
                        player.x - object.x,
                        player.y - object.y
                    );

                if (
                    distance < 80 &&
                    !completed.includes(index)
                ) {

                    completed.push(index);

                    addScore(
                        object.points
                    );

                    showMessage(
                        object.name +
                        " discovered! +" +
                        object.points +
                        " PlayPoints"
                    );

                }

            }
        );

    }


    if (completed.length === lostObjects.length) {

        finishGame();

    }

}


// ---------------- KING'S MESSENGER ----------------

let kingStage = 0;

let kingChoices = [
    {
        title: "Forest Route",
        description: "Short but difficult terrain.",
        points: 30
    },

    {
        title: "River Route",
        description: "Longer route with water crossings.",
        points: 20
    },

    {
        title: "Royal Road",
        description: "Longer, but guarded and safer.",
        points: 50
    }
];


function drawKingsMessenger() {

    drawBackground();

    drawGround();


    ctx.fillStyle = "#d7b56d";

    ctx.font = "30px Arial";

    ctx.fillText(
        "👑 ROYAL CAPITAL",
        width / 2 - 140,
        180
    );


    ctx.font = "20px Arial";

    ctx.fillStyle = "white";

    ctx.fillText(
        "The King has entrusted you with an important message.",
        width / 2 - 300,
        230
    );


    ctx.fillText(
        "Choose your route:",
        width / 2 - 100,
        280
    );


    kingChoices.forEach(
        function(choice, index) {

            let y = 330 + index * 100;

            ctx.fillStyle =
                "rgba(255,255,255,0.12)";

            ctx.fillRect(
                width / 2 - 300,
                y,
                600,
                75
            );

            ctx.strokeStyle =
                "#d8ad5b";

            ctx.strokeRect(
                width / 2 - 300,
                y,
                600,
                75
            );

            ctx.fillStyle = "white";

            ctx.font = "22px Arial";

            ctx.fillText(
                (index + 1) +
                ". " +
                choice.title,
                width / 2 - 275,
                y + 30
            );

            ctx.font = "15px Arial";

            ctx.fillText(
                choice.description,
                width / 2 - 275,
                y + 55
            );

        }
    );

}


canvas.addEventListener("click", function(event) {

    if (!running) {
        return;
    }

    if (GAME_ID !== "kings-messenger") {
        return;
    }

    let y = event.clientY;

    let selected =
        Math.floor((y - 330) / 100);

    if (
        selected >= 0 &&
        selected < kingChoices.length
    ) {

        let choice =
            kingChoices[selected];

        addScore(choice.points);

        showMessage(
            "You selected the " +
            choice.title +
            "! +" +
            choice.points +
            " PlayPoints"
        );

        setTimeout(
            finishGame,
            1800
        );

    }

});


// ---------------- PANCHATANTRA ----------------

let panchStage = 0;

let panchChoices = [

    {
        title: "Help the traveller",
        text: "The traveller may reward your kindness.",
        points: 40
    },

    {
        title: "Ignore the traveller",
        text: "You continue safely, but lose an opportunity.",
        points: 20
    },

    {
        title: "Ask for more information",
        text: "Wisdom begins with understanding.",
        points: 50
    }

];


function drawPanchatantra() {

    drawBackground();

    drawGround();


    ctx.font = "70px Arial";

    ctx.fillText(
        "🦊",
        width / 2 - 40,
        190
    );


    ctx.fillStyle = "#f4d28a";

    ctx.font = "30px Arial";

    ctx.fillText(
        "The Clever Choice",
        width / 2 - 150,
        250
    );


    ctx.fillStyle = "white";

    ctx.font = "18px Arial";

    ctx.fillText(
        "A traveller arrives at the forest crossroads.",
        width / 2 - 230,
        290
    );

    ctx.fillText(
        "What should the clever one do?",
        width / 2 - 180,
        320
    );


    panchChoices.forEach(
        function(choice, index) {

            let y = 360 + index * 90;

            ctx.fillStyle =
                "rgba(255,255,255,0.12)";

            ctx.fillRect(
                width / 2 - 300,
                y,
                600,
                65
            );

            ctx.strokeStyle =
                "#cda85c";

            ctx.strokeRect(
                width / 2 - 300,
                y,
                600,
                65
            );

            ctx.fillStyle = "white";

            ctx.font = "20px Arial";

            ctx.fillText(
                (index + 1) +
                ". " +
                choice.title,
                width / 2 - 275,
                y + 28
            );

            ctx.font = "14px Arial";

            ctx.fillText(
                choice.text,
                width / 2 - 275,
                y + 50
            );

        }
    );

}


canvas.addEventListener("click", function(event) {

    if (!running) {
        return;
    }

    if (GAME_ID !== "panchatantra") {
        return;
    }

    let y = event.clientY;

    let selected =
        Math.floor((y - 360) / 90);

    if (
        selected >= 0 &&
        selected < panchChoices.length
    ) {

        let choice =
            panchChoices[selected];

        addScore(choice.points);

        showMessage(
            choice.title +
            " — " +
            choice.text +
            " +" +
            choice.points +
            " PlayPoints"
        );

        setTimeout(
            finishGame,
            2200
        );

    }

});


// ---------------- MESSAGE ----------------

function showMessage(text) {

    const message =
        document.getElementById(
            "gameMessage"
        );

    message.style.display = "block";

    message.innerHTML =

        "<h2>⭐ " +
        text +
        "</h2>";

}


// ---------------- FINISH ----------------

let finished = false;

function finishGame() {

    if (finished) {
        return;
    }

    finished = true;

    running = false;

    document.getElementById(
        "finalPoints"
    ).value = score;

    const message =
        document.getElementById(
            "gameMessage"
        );

    message.style.display = "block";

    message.innerHTML = `

        <h1>🎉 ADVENTURE COMPLETE!</h1>

        <h2>
            ⭐ ${score} PlayPoints
        </h2>

        <p>
            Your adventure has been recorded.
        </p>

        <button onclick="
            document.getElementById('scoreForm').submit();
        ">
            🏆 VIEW LEADERBOARD
        </button>

        <br><br>

        <button onclick="
            window.location.href='/library';
        ">
            🎮 GAME LIBRARY
        </button>

    `;

}


// ---------------- MAIN LOOP ----------------

function gameLoop() {

    if (!running) {
        return;
    }


    if (GAME_ID === "lost-seal") {

        movePlayer();

        drawLostSeal();

    }


    if (GAME_ID === "kings-messenger") {

        drawKingsMessenger();

    }


    if (GAME_ID === "panchatantra") {

        drawPanchatantra();

    }


    requestAnimationFrame(
        gameLoop
    );

}
