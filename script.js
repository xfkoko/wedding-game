//const BASE_PATH = "http://localhost:3000";
const BASE_PATH = "http://13.51.77.33:3000";

window.addEventListener('load', function() {
    document.getElementById('loading-screen').style.display = 'none';
});

async function postScore(score, name) {
    console.log(name + ":", score);
    const response = await fetch(BASE_PATH + "/newscore", {
        method: 'POST',
        body: JSON.stringify({
            "name": name,
            "score": score,
    }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log("Status of new score sent:", response.status);
}

async function getTopList() {
    const response = await fetch(BASE_PATH + "/top10");
    var data = await response.json();
    return data;
}

var playerName = "Sulho" + Math.floor(Math.random() * 9999);
const inputHandler = function(e) {
    playerName = e.target.value;
}

window.addEventListener('load', async function() {
    async function updateTopList() {
        var topList = await getTopList();
        for (var i in topList.top10) {
            this.document.getElementById("position" + (parseInt(i) + 1)).innerHTML = topList.top10[i].name + ": " + topList.top10[i].score
        }
    }

    await updateTopList();
    const canvas = this.document.getElementById('canvas1');
    const playerNameInput = this.document.getElementById('playername');
    const hiscores = this.document.getElementById('hiscores');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 1440;
    const CANVAS_HEIGHT = canvas.height = 720;
    playerNameInput.value = playerName;
    var docElem = this.document.documentElement;
    var topOffset = (docElem.clientHeight - canvas.clientHeight)/2;
    var leftOffset = (docElem.clientWidth - canvas.clientWidth)/2;
    playerNameInput.style.top = topOffset + canvas.clientHeight/1.52 + "px";
    playerNameInput.style.left = leftOffset + canvas.clientWidth/2.43 + "px";
    playerNameInput.style.fontSize = canvas.clientWidth/35 + "px";
    playerNameInput.addEventListener('input', inputHandler);

    hiscores.style.top = topOffset + canvas.clientHeight/7 + "px";
    hiscores.style.left = leftOffset + canvas.clientWidth/40 + "px";
    hiscores.style.fontSize = canvas.clientWidth/37 + "px";

    CANVAS_SCALE = CANVAS_WIDTH/canvas.clientWidth;

    const menus = new Image();
    menus.src = 'menus/allmenus.png';
    menus.onload = loadImageMenus;

    var canvasMainMenusTemp = document.createElement("canvas");
    canvasMainMenusTemp.width = 1694;
    canvasMainMenusTemp.height = 1514;
    var tempMainMenusContext = canvasMainMenusTemp.getContext("2d");
    const MENU_W = 542;
    const MENU_H = 417;
    const START_W = 458;
    const START_H = 89;
    const NEW_W = 313;
    const NEW_H = 128;
    const TOP10_W = 416;
    const TOP10_H = 680;
    const WRONG_W = 175;
    const WRONG_H = 267;
    const CORRECT_W = 206;
    const CORRECT_H = 241;
    let answerCorrect = false;

    function loadImageMenus(){
        tempMainMenusContext.drawImage(menus, 0, 0, 1694, 1514, 0, 0, 1694, 1514);
    }

    const questionMenu = new Image();
    questionMenu.src = "questions/allqs.png";
    const QM_W = 542;
    const QM_H = 417;
    const A_W = 187;
    const A_H = 63;
    const A_RECT = {width: A_W, height: A_H};
    let Q_multiplier = 0;
    let endPositions = [];
    let rightPosition = 0;
    questionMenu.onload = loadImageM;

    var canvasMenuTemp = document.createElement("canvas");
    canvasMenuTemp.width = 1293;
    canvasMenuTemp.height = 4171;
    var tempMenuContext = canvasMenuTemp.getContext("2d");

    function loadImageM(){
        tempMenuContext.drawImage(questionMenu, 0, 0, 1293, 4171, 0, 0, 1293, 4171);
    }

    const QAMOUNT = 9;
    var QUESTIONS = []
    for (var i = 1; i <= QAMOUNT; i++) {
        QUESTIONS.push({
            multiplier: i
        });
    }

    var questionsNotUsed = QUESTIONS.slice();
    let needPositions = true;
    let needQuestion = false;
    let questionSelected;
    let questionPhase = false;

    let showResult = false;
    let showCounter = 0;

    const arrows = new Image();
    arrows.src = "arrow_frames/arrows.png"
    arrows.onload = loadImageA;

    var canvasArrowsTemp = document.createElement("canvas");
    canvasArrowsTemp.width = 510;
    canvasArrowsTemp.height = 340;
    var tempArrowsContext = canvasArrowsTemp.getContext("2d");
    const A_SIDE = 170;
    let L_X = 0;
    let L_Y = 0;
    let R_X = 0;
    let R_Y = A_SIDE;

    function loadImageA(){
        tempArrowsContext.drawImage(arrows, 0, 0, 510, 340, 0, 0, 510, 340);
    }

    const R_ARROW_X = CANVAS_WIDTH/2 + 10;
    const R_ARROW_Y = CANVAS_HEIGHT/1.4 + 20;
    const L_ARROW_X = CANVAS_WIDTH/2 - 180;
    const L_ARROW_Y = R_ARROW_Y;
    let needNewArrow = false;
    let rPressed = false;
    let lPressed = false;
    let pressedCounter = 0;
    let correctArrow = "";

    let gameAtEnd = true;

    let speed = 0;
    const MAX_SPEED = 10;

    let speedScore = 0;

    let score = 20000;

    // { MENU, PLAYING, END} something else?
    let gameState = "MENU";

    canvas.addEventListener('click', async function(e) {
        mousePos = getMousePos(canvas, e);
        if (gameState === "PLAYING") {
            if (gameAtEnd) {
                await endScreenClick();
            }
            else if (questionTime1 === 1 || questionTime2 === 1 || questionTime3 === 1) {
                questionClick();
            }
            else gameClick();
        }
        else if (gameState === "MENU") menuClick();
        else console.log("END/OTHER CLICK");
    }, false)

    function menuClick() {
        let w = (CANVAS_WIDTH - MENU_W);
        let h = (CANVAS_HEIGHT - MENU_H);
        if(isInside(mousePos, {width: START_W, height: START_H}, w/2 + w/20, h/2 + h/1.8)) {
            gameState = "PLAYING";
            gameAtEnd = false;
            needNewArrow = true;
            playerNameInput.type = "hidden";
            hiscores.style.visibility = "hidden";
        }
        else console.log("Is NOT inside start");
    }

    async function endScreenClick() {
        let w = (CANVAS_WIDTH - MENU_W);
        let h = (CANVAS_HEIGHT - MENU_H);
        if(isInside(mousePos, {width: NEW_W, height: NEW_H}, w/1.6, h/0.725)) {
            postScore(score, playerName);
            await gameReset();
        }
        else console.log("Is NOT inside new game");
    }

    function questionClick() {
        let clicked;
        if (isInside(mousePos, A_RECT, (CANVAS_WIDTH - QM_W)/2 + 55, (CANVAS_HEIGHT - QM_H)/2 + 220)) {
            console.log("Answer1");
            clicked = 1;
        } else if (isInside(mousePos, A_RECT, (CANVAS_WIDTH - QM_W)/2 + 55, (CANVAS_HEIGHT - QM_H)/2 + 300)) {
            console.log("Answer2");
            clicked = 2;
        } else if (isInside(mousePos, A_RECT, (CANVAS_WIDTH - QM_W)/2 + 188 + 111, (CANVAS_HEIGHT - QM_H)/2 + 220)) {
            console.log("Answer3");
            clicked = 3;
        } else if (isInside(mousePos, A_RECT, (CANVAS_WIDTH - QM_W)/2 + 188 + 111, (CANVAS_HEIGHT - QM_H)/2 + 300)) {
            console.log("Answer4");
            clicked = 4;
        } else clicked = 0;
        if (clicked-1 === rightPosition) {
            console.log("Correct clicked!");
            if (questionTime1 === 1) questionTime1 = 2;
            else if (questionTime2 === 1) questionTime2 = 2;
            else if (questionTime3 === 1) questionTime3 = 2;
            needNewArrow = true;
            needPositions = true;
            questionPhase = false;
            score += 1000;
            answerCorrect = true;
            showResult = true;
        } else if (clicked > 0 ) {
            console.log("Wrong answer!");
            if (questionTime1 === 1) questionTime1 = 2;
            else if (questionTime2 === 1) questionTime2 = 2;
            else if (questionTime3 === 1) questionTime3 = 2;
            needNewArrow = true;
            needPositions = true;
            questionPhase = false;
            score -= 1000;
            answerCorrect = false;
            showResult = true;
        }
        else console.log("Click missed answer fields.");
    }
    
    function gameClick() {
        if (!needNewArrow) {
            if (correctArrow === "Right") {
                if (isInside(mousePos, {width: A_SIDE, height: A_SIDE}, R_ARROW_X, R_ARROW_Y)) {
                    //console.log("RIGHT: R_ARROW");
                    rPressed = true;
                    if (frameY === 0) {
                        frameY = 1;
                        speed = 1;
                    } else {
                        if (speed >= MAX_SPEED && staggerFrames - 1 > 0) {
                            staggerFrames--;
                            speed = 1;
                        }
                        else speed = speed + 2;
                    }
                } else {
                    //console.log("Clicked wrong place");
                    if (frameY !== 0) {
                        speed = speed - 5;
                        if (speed < 0 ) speed = 0;
                        if (staggerFrames >= 6 && speed < 1) frameY = 0;
                        else if (speed < 1) {
                            staggerFrames++;
                            speed = 7;
                        }
                    }
                }
            } else if (correctArrow === "Left") {
                if (isInside(mousePos, {width: A_SIDE, height: A_SIDE}, L_ARROW_X, L_ARROW_Y)) {
                    //console.log("RIGHT: L_ARROW");
                    lPressed = true;
                    if (frameY === 0) {
                        frameY = 1;
                        speed = 1;
                    } else {
                        if (speed >= MAX_SPEED && staggerFrames - 1 > 0) {
                            staggerFrames--;
                            speed = 1;
                        }
                        else speed = speed + 2;
                    }
                } else {
                    //console.log("Clicked wrong place");
                    if (frameY !== 0) {
                        speed = speed - 5;
                        if (speed < 0 ) speed = 0;
                        if (staggerFrames >= 6 && speed < 1) frameY = 0;
                        else if (speed < 1) {
                            staggerFrames++;
                            speed = 7;
                        }
                    }
                }
            }    
        } else console.log("No arrow in place");
        speedScore = (6-staggerFrames) * 10 + speed;
        if (speedScore >= 60) {
            console.log("WOOHOO NOW WE GOING FAST!");
        } else console.log("Speed Score: ", speedScore);
    }

    async function gameReset(){
        speed = 0;
        speedScore = 0;
        frameY = 0;
        staggerFrames = 6;
        score = 20000;
        x = 0;
        questionTime1 = 0;
        questionTime2 = 0;
        questionTime3 = 0;
        questionPhase = false;
        pressedCounter = 0;
        gameState = "MENU";
        needPositions = true;
        showResult = false;
        showCounter = 0;
        gameAtEnd = false;
        questionsNotUsed = QUESTIONS.slice();
        //playerImage.src = 'groom_frames/animations_scaled.png';
        a_positions = [0, 1, 2, 3];
        await updateTopList();
    }

    // ONLY FOR DEBUGGING
    this.window.addEventListener('keydown', function(e) {
        console.log(e.keyCode);
        if (e.keyCode === 32) {
            gameReset();
        }
        if (e.keyCode === 38) {
            speedScore = speedScore + 1;
        }
        if (e.keyCode === 40) {
            speedScore = speedScore - 1;
        }
        if (e.keyCode === 39) {
            x = -27199;
        }
    })

    const backgroundPart1 = new Image();
    backgroundPart1.src ="backgroundpart001.png";
    const backgroundPart2 = new Image();
    backgroundPart2.src ="backgroundpart002.png";
    const backgroundPart3 = new Image();
    backgroundPart3.src ="backgroundpart003.png";
    const backgroundPart4 = new Image();
    backgroundPart4.src ="backgroundpart004.png";

    const backgroundLayer1 = new Image();
    backgroundLayer1.src ="background001.png";
    backgroundLayer1.onload = loadImageBG;

    var canvasTemp = document.createElement("canvas");
    canvasTemp.width = 28806;
    canvasTemp.height = CANVAS_HEIGHT;
    var tempContext = canvasTemp.getContext("2d");

    function loadImageBG(){
        tempContext.drawImage(backgroundLayer1, 0, 0, 28806, CANVAS_HEIGHT, 0, 0, 28806, CANVAS_HEIGHT);
    }

    const playerImage = new Image();
    playerImage.src = 'groom_frames/animations_scaled.png';
    var canvasTempPlayer = document.createElement("canvas");
    canvasTempPlayer.width = 9389;
    canvasTempPlayer.height = 1083;
    var tempContextPlayer = canvasTempPlayer.getContext("2d");
    playerImage.onload = loadImagePlayer;

    function loadImagePlayer(){
        tempContextPlayer.drawImage(playerImage, 0, 0, 9389, 1083, 0, 0, 9389, 1083);              
    }

    const backgroundLayer2 = new Image();
    backgroundLayer2.src ="background002.png";
    var canvasBG2Temp = document.createElement("canvas");
    canvasBG2Temp.width = 1440;
    canvasBG2Temp.height = 720;
    var tempBG2Context = canvasBG2Temp.getContext("2d");
    backgroundLayer2.onload = loadImageBG2;

    function loadImageBG2(){
        tempBG2Context.drawImage(backgroundLayer2, 0, 0, 1440, 720, 0, 0, 1440, 720);              
    }

    const SOMETHING = 28806;
    let x = 0;
    let questionTime1 = 0;
    let questionTime2 = 0;
    let questionTime3 = 0;

    const spriteWidth = 361;
    const spriteHeight = 361;
    let frameX = 0;
    let frameY = 0;
    let gameFrame = 5;
    let staggerFrames = 6;
    let divider = 6;

    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * CANVAS_SCALE,
            y: (event.clientY - rect.top) * CANVAS_SCALE
        };
    }

    function isInside(pos, rect, x, y){
        return pos.x > x && pos.x < x+rect.width && pos.y < y+rect.height && pos.y > y;
    }
    
    function randomArrow() {
        if(Math.floor(Math.random() * 10) > 4) return "Right";
        else return "Left";
    }


    var fpsInterval, startTime, now, then, elapsed;
    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }    

    function animate() {
        requestAnimationFrame(animate);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            if (gameState === "PLAYING") gameAnimation();
            else if (gameState === "MENU") menuAnimation();
        }
    }

    function menuAnimation() {
        ctx.drawImage(tempBG2Context.canvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        let w = (CANVAS_WIDTH - MENU_W);
        let h = (CANVAS_HEIGHT - MENU_H);
        ctx.drawImage(tempMainMenusContext.canvas, 0, 0, MENU_W, MENU_H, w/2, h/2, MENU_W, MENU_H);
        ctx.drawImage(tempMainMenusContext.canvas, MENU_W + NEW_W, 0, START_W, START_H, w/2 + w/20, h/2 + h/1.8, START_W, START_H);
        ctx.drawImage(tempMainMenusContext.canvas, 0, MENU_H + MENU_H, TOP10_W, TOP10_H, w/50, h/10, TOP10_W, TOP10_H);
        if (playerNameInput.type == "hidden") {
            ctx.font = "60px MyFont";
            playerNameInput.value = playerName;
            playerNameInput.type = "text";
            hiscores.style.visibility = "visible";
        }
    }

    function gameAnimation() {
        //console.time("test")
        if (-x > 27200) {
            gameAtEnd = true;
            speed = 0;
            speedScore = 0;
            staggerFrames = 6;
            frameY = 0;
            needNewArrow = false;
        } else if (score <= 0) {
            gameAtEnd = true;
            speed = 0;
            speedScore = 0;
            staggerFrames = 6;
            frameY = 0;
            needNewArrow = false;
        } else {
            score--;
        }
        if (-x > 5760 && questionTime1 != 2) {
            questionTime1 = 1;
            if (!questionPhase) {
                needQuestion = true;
                questionPhase = true;
            }
        } else if (-x > 11520 + CANVAS_WIDTH && questionTime2 != 2) {
            questionTime2 = 1;
            if (!questionPhase) {
                needQuestion = true;
                questionPhase = true;
            }
        } else if (-x > 17280 + CANVAS_WIDTH*2  && questionTime3 != 2) {
            questionTime3 = 1;
            if (!questionPhase) {
                needQuestion = true;
                questionPhase = true;
            }
        }
        ctx.drawImage(tempContext.canvas, -x, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.font = "50px MyFont";
        //ctx.fillText("X: " + Math.round(-x), 250, 50);
        ctx.fillText("Score: " + score, 10, 50);
        if (frameY === 0) {
            divider = 26;
        } else {
            divider = 12;
        }
        let position = Math.floor(gameFrame/staggerFrames) % divider;
        frameX = spriteWidth * position;
        if (gameAtEnd) {
            L_X = 0;
            R_X = 0;
        } else {
            if(rPressed) {
                if (pressedCounter > 5) {
                    pressedCounter = 0;
                    rPressed = false;
                    needNewArrow = true;
                } else pressedCounter++;
                R_X = A_SIDE;
            } else if (lPressed) {
                if (pressedCounter > 10) {
                    pressedCounter = 0;
                    lPressed = false;
                    needNewArrow = true;
                } else pressedCounter++;
                L_X = A_SIDE;
            }
            else if (needNewArrow) {
                needNewArrow = false;
                correctArrow = randomArrow();
                if (correctArrow === "Right") {
                    R_X = 0;
                    L_X = 2*A_SIDE;
                } else {
                    R_X = 2*A_SIDE;
                    L_X = 0
                }
            }
        }
        ctx.drawImage(tempArrowsContext.canvas, R_X, R_Y, A_SIDE, A_SIDE, R_ARROW_X, R_ARROW_Y, A_SIDE, A_SIDE);
        ctx.drawImage(tempArrowsContext.canvas, L_X, L_Y, A_SIDE, A_SIDE, L_ARROW_X, L_ARROW_Y, A_SIDE, A_SIDE);
        ctx.drawImage(tempContextPlayer.canvas, frameX, frameY * spriteHeight, spriteWidth, spriteHeight, CANVAS_WIDTH/20, CANVAS_HEIGHT/2.4, spriteWidth, spriteHeight);
        if (showResult) {
            if (showCounter < 80) {
                if (answerCorrect) {
                    ctx.drawImage(tempMainMenusContext.canvas, MENU_W + NEW_W + START_W, 0, CORRECT_W, CORRECT_H, (CANVAS_WIDTH - CORRECT_W)/2, (CANVAS_HEIGHT - CORRECT_H)/2,  CORRECT_W, CORRECT_H);
                } else {
                    ctx.drawImage(tempMainMenusContext.canvas, MENU_W + NEW_W + START_W + CORRECT_W, 0, WRONG_W, WRONG_H, (CANVAS_WIDTH - WRONG_W)/2, (CANVAS_HEIGHT - WRONG_H)/2,  WRONG_W, WRONG_H);
                }
                showCounter++;
            } else {
                showResult = false;
                showCounter = 0;
            }
        }
        if (questionTime1 === 1 || questionTime2 === 1 || questionTime3 === 1) {
            if (needQuestion) {
                var questionIndex = Math.floor(Math.random() * questionsNotUsed.length);
                questionSelected = questionsNotUsed[questionIndex];
                questionsNotUsed.splice(questionIndex, 1);
                Q_multiplier = questionSelected.multiplier;
                needQuestion = false;
            }
            speed = 0;
            speedScore = 0;
            staggerFrames = 6;
            frameY = 0;
            needNewArrow = false;
            correctArrow = "";
            R_X = 2*A_SIDE;
            L_X = 2*A_SIDE;
            ctx.drawImage(tempMenuContext.canvas, 0, QM_H * Q_multiplier, QM_W, QM_H, (CANVAS_WIDTH - QM_W)/2, (CANVAS_HEIGHT - QM_H)/2, QM_W, QM_H);
            if (needPositions) {
                let positions = [0,1,2,3];
                needPositions = false;
                endPositions = [];
                for (let i = 0; i < 4; i++) {
                    let randomIndex = Math.floor(Math.random() * positions.length);
                    let randomValue = positions.splice(randomIndex, 1)[0];
                    endPositions.push(randomValue);
                    if (randomValue == 0) {rightPosition = i}
                }
            }
            ctx.drawImage(tempMenuContext.canvas, QM_W + (A_W * endPositions[0]), QM_H * Q_multiplier, A_W, A_H, (CANVAS_WIDTH - QM_W)/2 + 55, (CANVAS_HEIGHT - QM_H)/2 + 220, A_W, A_H);
            ctx.drawImage(tempMenuContext.canvas, QM_W + (A_W * endPositions[1]), QM_H * Q_multiplier, A_W, A_H, (CANVAS_WIDTH - QM_W)/2 + 55, (CANVAS_HEIGHT - QM_H)/2 + 300, A_W, A_H);
            ctx.drawImage(tempMenuContext.canvas, QM_W + (A_W * endPositions[2]), QM_H * Q_multiplier, A_W, A_H, (CANVAS_WIDTH - QM_W)/2 + 188 + 111, (CANVAS_HEIGHT - QM_H)/2 + 220, A_W, A_H);
            ctx.drawImage(tempMenuContext.canvas, QM_W + (A_W * endPositions[3]), QM_H * Q_multiplier, A_W, A_H, (CANVAS_WIDTH - QM_W)/2 + 188 + 111, (CANVAS_HEIGHT - QM_H)/2 + 300, A_W, A_H);
        } else {
            if (x < -SOMETHING) x = -speedScore/3;
            else x -= speedScore/3;
        }
        if (gameAtEnd) {
            let w = (CANVAS_WIDTH - MENU_W);
            let h = (CANVAS_HEIGHT - MENU_H);
            if (score <= 0) {
                ctx.drawImage(tempMainMenusContext.canvas, MENU_W, MENU_H, MENU_W, MENU_H, w/2, h/2, MENU_W, MENU_H);
            } else {
                ctx.drawImage(tempMainMenusContext.canvas, 0, MENU_H, MENU_W, MENU_H, w/2, h/2, MENU_W, MENU_H);
                ctx.font = "60px MyFont"
                ctx.fillText(score, CANVAS_WIDTH/2.15, CANVAS_HEIGHT/1.9);
            }
            ctx.drawImage(tempMainMenusContext.canvas, MENU_W, 0, NEW_W, NEW_H, w/1.6, h/0.725, NEW_W, NEW_H);
        }
        gameFrame++;
        //console.timeEnd("test")
    }
    startAnimating(60);
});