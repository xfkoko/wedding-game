window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 1440;
    const CANVAS_HEIGHT = canvas.height = 720;

    const mainMenu = new Image();
    mainMenu.src = 'menus/menu001.png';

    const endMenu = new Image();
    endMenu.src = 'menus/endmenu.png';
    const newGameButton = new Image();
    newGameButton.src = 'menus/newgame.png';

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
            answers: ["questions/q1a1.png", "questions/q1a2.png", "questions/q1a3.png", "questions/q1a4.png"],
            correct: "questions/q1a3.png"
        },
        Q2: {
            question: "questions/q2.png",
            answers: ["questions/q2a1.png", "questions/q2a2.png", "questions/q2a3.png", "questions/q2a4.png"],
            correct: "questions/q2a3.png"
        },
    }
    let needPositions = true;
    let correctAnswer;
    let needQuestion = false;
    let questionSelected;
    let questionPhase = false;
    
    const startButton = new Image();
    startButton.src = 'menus/menustart001.png';

    const resultImage = new Image();
    let showResult = false;
    let showCounter = 0;

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
    const R_ARROW_X = CANVAS_WIDTH/2 + 10;
    const R_ARROW_Y = CANVAS_HEIGHT/1.4 + 20;
    const L_ARROW_X = CANVAS_WIDTH/2 - 180;
    const L_ARROW_Y = R_ARROW_Y;
    let needNewArrow = false;
    let rPressed = false;
    let lPressed = false;
    let pressedCounter = 0;
    let correctArrow = "";
    let rArrow = rightArrow;
    let lArrow = leftArrow;

    let gameAtEnd = true;

    let speed = 0;
    const MAX_SPEED = 10;

    let speedScore = 0;

    let score = 50000;

    // { MENU, PLAYING, END} something else?
    let gameState = "MENU";

    console.log(rightArrow.height);

    canvas.addEventListener('click', function(e) {
        mousePos = getMousePos(canvas, e);
        if (gameState === "PLAYING") {
            if (gameAtEnd) {
                endScreenClick();
            }
            else if (questionTime1 === 1 || questionTime2 === 1 || questionTime3 === 1) {
                questionClick();
            }
            else gameClick();
        }
        else if (gameState === "MENU") menuClick();
        else console.log("END/OTHER CLICK");
    })

    function menuClick() {
        let w = (CANVAS_WIDTH - mainMenu.width);
        let h = (CANVAS_HEIGHT - mainMenu.height);
        if(isInside(mousePos, startButton, w/2 + w/20, h/2 + h/1.8)) {
            gameState = "PLAYING";
            gameAtEnd = false;
            needNewArrow = true;
        }
        else console.log("Is NOT inside start");
    }

    function endScreenClick() {
        let w = (CANVAS_WIDTH - endMenu.width);
        let h = (CANVAS_HEIGHT - endMenu.height)
        if(isInside(mousePos, newGameButton, w/1.6, h/0.75)) {
            gameReset();
        }
        else console.log("Is NOT inside new game");
    }

    function questionClick() {
        let clicked;
        if (isInside(mousePos, answerImage1, (CANVAS_WIDTH - questionMenu.width)/2 + 55, (CANVAS_HEIGHT - questionMenu.height)/2 + 220)) {
            console.log("Answer1");
            clicked = 1;
        } else if (isInside(mousePos, answerImage2, (CANVAS_WIDTH - questionMenu.width)/2 + 55, (CANVAS_HEIGHT - questionMenu.height)/2 + 300)) {
            console.log("Answer2");
            clicked = 2;
        } else if (isInside(mousePos, answerImage3, (CANVAS_WIDTH - questionMenu.width)/2 + 188 + 111, (CANVAS_HEIGHT - questionMenu.height)/2 + 220)) {
            console.log("Answer3");
            clicked = 3;
        } else if (isInside(mousePos, answerImage4, (CANVAS_WIDTH - questionMenu.width)/2 + 188 + 111, (CANVAS_HEIGHT - questionMenu.height)/2 + 300)) {
            console.log("Answer4");
            clicked = 4;
        } else clicked = 0;
        if (clicked === correctAnswer) {
            console.log("Correct clicked!");
            if (questionTime1 === 1) questionTime1 = 2;
            else if (questionTime2 === 1) questionTime2 = 2;
            else if (questionTime3 === 1) questionTime3 = 2;
            needNewArrow = true;
            needPositions = true;
            questionPhase = false;
            score += 1000;
            resultImage.src = "menus/rightanswer.png";
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
            resultImage.src = "menus/wronganswer.png";
            showResult = true;
        }
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

    function gameReset(){
        speed = 0;
        speedScore = 0;
        frameY = 0;
        staggerFrames = 6;
        score = 50000;
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

    const backgroundLayer1 = new Image();
    backgroundLayer1.src ="background001.png";

    const SOMETHING = 28806;
    let x = 0;
    let questionTime1 = 0;
    let questionTime2 = 0;
    let questionTime3 = 0;

    const playerImage = new Image();
    playerImage.src = 'groom_frames/animations_scaled.png';
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

    var randomProperty = function (obj) {
        var keys = Object.keys(obj);
        return obj[keys[ keys.length * Math.random() << 0]];
    };

    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (gameState === "PLAYING") gameAnimation();
        else if (gameState === "MENU") menuAnimation();
        requestAnimationFrame(animate);
    }

    function menuAnimation() {
        ctx.drawImage(backgroundLayer1, 0, 0);
        let w = (CANVAS_WIDTH - mainMenu.width);
        let h = (CANVAS_HEIGHT - mainMenu.height)
        ctx.drawImage(mainMenu, w/2, h/2);
        ctx.drawImage(startButton, w/2 + w/20, h/2 + h/1.8);
    }

    function gameAnimation() {
        if (-x > 27200) {
            gameAtEnd = true;
            speed = 0;
            speedScore = 0;
            staggerFrames = 6;
            frameY = 0;
            needNewArrow = false;
        } else {
            score--;
        }
        if (-x > 5750 && questionTime1 != 2) {
            questionTime1 = 1;
            if (!questionPhase) {
                needQuestion = true;
                questionPhase = true;
            }
        } else if (-x > 13100 && questionTime2 != 2) {
            questionTime2 = 1;
            if (!questionPhase) {
                needQuestion = true;
                questionPhase = true;
            }
        } else if (-x > 20600 && questionTime3 != 2) {
            questionTime3 = 1;
            if (!questionPhase) {
                needQuestion = true;
                questionPhase = true;
            }
        }
        ctx.drawImage(backgroundLayer1, x, 0);
        ctx.font = "50px Arial";
        ctx.fillText("X: " + Math.round(-x), 0, 50);
        ctx.fillText("Score: " + score, 250, 50);
        if (frameY === 0) {
            divider = 26;
        } else {
            divider = 12;
        }
        let position = Math.floor(gameFrame/staggerFrames) % divider;
        frameX = spriteWidth * position;
        if (gameAtEnd) {
            rArrow = redRightArrow;
            lArrow = redLeftArrow;
        } else {
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
        }
        ctx.drawImage(rArrow, R_ARROW_X, R_ARROW_Y);
        ctx.drawImage(lArrow, L_ARROW_X, L_ARROW_Y);
        ctx.drawImage(playerImage, frameX, frameY * spriteHeight, spriteWidth,
            spriteHeight, CANVAS_WIDTH/20, CANVAS_HEIGHT/2.4, spriteWidth, spriteHeight);
        if (showResult) {
            if (showCounter < 80) {
                ctx.drawImage(resultImage, (CANVAS_WIDTH - resultImage.width)/2, (CANVAS_HEIGHT - resultImage.height)/2);
                showCounter++;
            } else {
                showResult = false;
                showCounter = 0;
            }
        }
        if (questionTime1 === 1 || questionTime2 === 1 || questionTime3 === 1) {
            if (needQuestion) {
                questionSelected = randomProperty(QUESTIONS);
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
            let answerImages = [answerImage1, answerImage2, answerImage3, answerImage4];
            if (needPositions) {
                let answerSources = questionSelected.answers.slice();
                needPositions = false;
                for (let i = 0; i < 4; i++) {
                    let index = Math.floor(Math.random()*answerSources.length);
                    answerImages[i].src = answerSources[index];
                    if (answerSources[index] === questionSelected.correct) correctAnswer = i+1
                    answerSources.splice(index, 1);
                }
            }
            ctx.drawImage(answerImage1, (CANVAS_WIDTH - questionMenu.width)/2 + 55, (CANVAS_HEIGHT - questionMenu.height)/2 + 220);
            ctx.drawImage(answerImage2, (CANVAS_WIDTH - questionMenu.width)/2 + 55, (CANVAS_HEIGHT - questionMenu.height)/2 + 300);
            ctx.drawImage(answerImage3, (CANVAS_WIDTH - questionMenu.width)/2 + 188 + 111, (CANVAS_HEIGHT - questionMenu.height)/2 + 220);
            ctx.drawImage(answerImage4, (CANVAS_WIDTH - questionMenu.width)/2 + 188 + 111, (CANVAS_HEIGHT - questionMenu.height)/2 + 300);
        } else {
            if (x < -SOMETHING) x = -speedScore/3;
            else x -= speedScore/3;
        }
        if (gameAtEnd) {
            let w = (CANVAS_WIDTH - endMenu.width);
            let h = (CANVAS_HEIGHT - endMenu.height)
            ctx.drawImage(endMenu, w/2, h/2);
            ctx.drawImage(newGameButton, w/1.6, h/0.75);
            ctx.fillText(score, CANVAS_WIDTH/2.2, CANVAS_HEIGHT/1.92);
        }
        gameFrame++;
    }
    animate();
});