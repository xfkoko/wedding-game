window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 3250;
    const CANVAS_HEIGHT = canvas.height = 1300;

    const mainMenu = new Image();
    mainMenu.src = 'menus/menu001.png';

    // Answer positions:
    //
    // 1. | 3.
    // 2. | 4.
    const questionMenu = new Image();
    const answerImage1 = new Image();
    const answerImage2 = new Image();
    const answerImage3 = new Image();
    const answerImage4 = new Image();
    const QUESTIONS= {
        Q1: {
            question: "questions/q1.png",
            answer1: "questions/q1a1.png",
            answer2: "questions/q1a2.png",
            answer3: "questions/q1a3.png",
            answer4: "questions/q1a4.png",
            correct: 3
        }
    }
    let questionSelected = QUESTIONS.Q1
    
    const startButton = new Image();
    startButton.src = 'menus/menustart001.png';

    const rightArrow = new Image();
    const leftArrow = new Image();
    const redRightArrow = new Image();
    const redLeftArrow = new Image();
    const clickedRightArrow = new Image();
    const clickedLeftArrow = new Image();
    rightArrow.src = 'arrow_frames/rightpassive.png';
    leftArrow.src = 'arrow_frames/leftpassive.png';
    redRightArrow.src = 'arrow_frames/rightactive.png';
    redLeftArrow.src = 'arrow_frames/leftactive.png';
    clickedRightArrow.src = 'arrow_frames/rightclicked.png';
    clickedLeftArrow.src = 'arrow_frames/leftclicked.png';
    const R_ARROW_X = 1675;
    const R_ARROW_Y = 880
    const L_ARROW_X = 1168;
    const L_ARROW_Y = 880;
    let needNewArrow = false;
    let rPressed = false;
    let lPressed = false;
    let pressedCounter = 0;
    let correctArrow = "";
    let rArrow = rightArrow;
    let lArrow = leftArrow;

    let speed = 0;
    const MAX_SPEED = 10;

    let speedScore = 0;

    START_SCORE = 50000;
    let score = START_SCORE;

    // { MENU, PLAYING, END} something else?
    gameState = "MENU";

    console.log(rightArrow.height);

    canvas.addEventListener('click', function(e) {
        mousePos = getMousePos(canvas, e);
        if (gameState === "PLAYING") {
            if (questionTime1 === 1 || questionTime2 === 1 || questionTime3 === 1) {
                questionClick();
            }
            else gameClick();
        }
        else if (gameState === "MENU") menuClick();
        else console.log("END/OTHER CLICK");
    })

    function menuClick() {
        if(isInside(mousePos, startButton, (CANVAS_WIDTH - mainMenu.width)/2 + 100, (CANVAS_HEIGHT - mainMenu.height)/2 + 400)) {
            gameState = "PLAYING";
            needNewArrow = true;
        }
        else console.log("Is NOT inside start");
    }

    function questionClick() {
        let clicked;
        if (isInside(mousePos, answerImage1, (CANVAS_WIDTH - questionMenu.width)/2 + 100, (CANVAS_HEIGHT - questionMenu.height)/2 + 500)) {
            console.log("Answer1");
            clicked = 1;
        } else if (isInside(mousePos, answerImage2, (CANVAS_WIDTH - questionMenu.width)/2 + 100, (CANVAS_HEIGHT - questionMenu.height)/2 + 700)) {
            console.log("Answer2");
            clicked = 2;
        } else if (isInside(mousePos, answerImage3, (CANVAS_WIDTH - questionMenu.width)/2 + 750, (CANVAS_HEIGHT - questionMenu.height)/2 + 500)) {
            console.log("Answer3");
            clicked = 3;
        } else if (isInside(mousePos, answerImage4, (CANVAS_WIDTH - questionMenu.width)/2 + 750, (CANVAS_HEIGHT - questionMenu.height)/2 + 700)) {
            console.log("Answer4");
            clicked = 4;
        } else clicked = 0;
        if (clicked === questionSelected.correct) {
            console.log("Correct clicked!");
            if (questionTime1 === 1) questionTime1 = 2;
            else if (questionTime2 === 1) questionTime2 = 2;
            else if (questionTime3 === 1) questionTime3 = 2;
            needNewArrow = true;
        } else if (clicked > 0 ) console.log("Wrong answer!");
        else console.log("Click missed answer fields.");
    }
    
    function gameClick() {
        if (!needNewArrow) {
            if (correctArrow === "Right") {
                if (isInside(mousePos, rightArrow, R_ARROW_X, R_ARROW_Y)) {
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
                if (isInside(mousePos, leftArrow, L_ARROW_X, L_ARROW_Y)) {
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

    // ONLY FOR DEBUGGING
    this.window.addEventListener('keydown', function(e) {
        console.log(e.keyCode);
        if (e.keyCode === 32) {
            speed = 0;
            speedScore = 0;
            frameY = 0;
            staggerFrames = 6;
            score = 50000;
            x = 0;
            questionTime1 = 0;
            questionTime2 = 0;
            questionTime3 = 0;
            gameState = "MENU";
        }
    })

    const backgroundLayer1 = new Image();
    backgroundLayer1.src ="background001.png";

    const SOMETHING = 13000;
    let x = 0;
    let questionTime1 = 0;
    let questionTime2 = 0;
    let questionTime3 = 0;

    const playerImage = new Image();
    playerImage.src = 'groom_frames/animations.png';
    const spriteWidth = 650;
    const spriteHeight = 650;
    let frameX = 0;
    let frameY = 0;
    let gameFrame = 5;
    let staggerFrames = 6;
    let divider = 6;

    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function isInside(pos, rect, x, y){
        return pos.x > x && pos.x < x+rect.width && pos.y < y+rect.height && pos.y > y;
    }
    
    function randomArrow() {
        if(Math.floor(Math.random() * 10) > 4) return "Right";
        else return "Left";
    }

    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (gameState === "PLAYING") gameAnimation();
        else if (gameState === "MENU") menuAnimation();
        requestAnimationFrame(animate);
    }

    function menuAnimation() {
        ctx.drawImage(backgroundLayer1, 0, 0);
        ctx.drawImage(mainMenu, (CANVAS_WIDTH - mainMenu.width)/2, (CANVAS_HEIGHT - mainMenu.height)/2);
        ctx.drawImage(startButton, (CANVAS_WIDTH - mainMenu.width)/2 + 100, (CANVAS_HEIGHT - mainMenu.height)/2 + 400);
    }

    function gameAnimation() {
        score--;
        if (-x > 9500 && questionTime1 != 2) {
            questionTime1 = 1;
            needQuestion = true;
        } else if (-x > 10000 && questionTime2 != 2) {
            questionTime2 = 1;
            needQuestion = true;
        } else if (-x > 10500 && questionTime3 != 2) {
            questionTime3 = 1;
            needQuestion = true;
        }
        ctx.drawImage(backgroundLayer1, x, 0);
        ctx.font = "100px Arial";
        ctx.fillText("X: " + Math.round(-x), 0, 100);
        ctx.fillText("Score: " + score, 400, 100);
        if (frameY === 0) {
            divider = 26;
        } else {
            divider = 12;
        }
        let position = Math.floor(gameFrame/staggerFrames) % divider;
        frameX = spriteWidth * position;
        if(rPressed) {
            if (pressedCounter > 10) {
                pressedCounter = 0;
                rPressed = false;
                needNewArrow = true;
            } else pressedCounter++;
            rArrow = clickedRightArrow;
        } else if (lPressed) {
            if (pressedCounter > 10) {
                pressedCounter = 0;
                lPressed = false;
                needNewArrow = true;
            } else pressedCounter++;
            lArrow = clickedLeftArrow;
        }
        else if (needNewArrow) {
            needNewArrow = false;
            correctArrow = randomArrow();
            if (correctArrow === "Right") {
                rArrow = redRightArrow;
                lArrow = leftArrow;
            } else {
                rArrow = rightArrow;
                lArrow = redLeftArrow;
            }
        }
        ctx.drawImage(rArrow, R_ARROW_X, R_ARROW_Y);
        ctx.drawImage(lArrow, L_ARROW_X, L_ARROW_Y);
        ctx.drawImage(playerImage, frameX, frameY * spriteHeight, spriteWidth,
            spriteHeight, 50, 500, spriteWidth, spriteHeight);
        if (questionTime1 === 1 || questionTime2 === 1 || questionTime3 === 1) {
            if (needQuestion) {
                questionMenu.src = questionSelected.question;
                needQuestion = false;
            }
            speed = 0;
            speedScore = 0;
            staggerFrames = 6;
            frameY = 0;
            needNewArrow = false;
            correctArrow = "";
            rArrow = rightArrow;
            lArrow = leftArrow;
            ctx.drawImage(questionMenu, (CANVAS_WIDTH - questionMenu.width)/2, (CANVAS_HEIGHT - questionMenu.height)/2);
            answerImage1.src = questionSelected.answer1;
            answerImage2.src = questionSelected.answer2;
            answerImage3.src = questionSelected.answer3;
            answerImage4.src = questionSelected.answer4;
            ctx.drawImage(answerImage1, (CANVAS_WIDTH - questionMenu.width)/2 + 100, (CANVAS_HEIGHT - questionMenu.height)/2 + 500);
            ctx.drawImage(answerImage2, (CANVAS_WIDTH - questionMenu.width)/2 + 100, (CANVAS_HEIGHT - questionMenu.height)/2 + 700);
            ctx.drawImage(answerImage3, (CANVAS_WIDTH - questionMenu.width)/2 + 750, (CANVAS_HEIGHT - questionMenu.height)/2 + 500);
            ctx.drawImage(answerImage4, (CANVAS_WIDTH - questionMenu.width)/2 + 750, (CANVAS_HEIGHT - questionMenu.height)/2 + 700);
        } else {
            if (x < -SOMETHING) x = -speedScore/3;
            else x -= speedScore/3;
        }
        gameFrame++;
    }
    animate();
});