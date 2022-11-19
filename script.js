window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 3250;
    const CANVAS_HEIGHT = canvas.height = 1300;

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
    let needNewArrow = true;
    let rPressed = false;
    let lPressed = false;
    let pressedCounter = 0;
    let correctArrow = "";
    let rArrow = rightArrow;
    let lArrow = leftArrow;

    let speed = 0;
    const MAX_SPEED = 10;

    let speedScore = 0

    console.log(rightArrow.height);

    canvas.addEventListener('click', function(e) {
        mousePos = getMousePos(canvas, e);
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
                        else speed++;
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
            } else {
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
                        else speed++;
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
    })

    this.window.addEventListener('keydown', function(e) {
        console.log(e.keyCode);
        if (e.keyCode === 32) {
            speed = 0;
            speedScore = 0;
            frameY = 0;
            staggerFrames = 6;
        }
    })

    function sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }

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
        return pos.x > x && pos.x < x+rect.width && pos.y < y+rect.height && pos.y > y
    }
    
    function randomArrow() {
        if(Math.floor(Math.random() * 10) > 4) return "Right";
        else return "Left";
    }

    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (-x > 10000 && questionTime1 != 2) {
            questionTime1 = 1;
        }
        ctx.drawImage(backgroundLayer1, x, 0);
        if (questionTime1 === 1 || questionTime2 === 1 || questionTime3 === 1) {
            speed = 0;
            speedScore = 0;
            staggerFrames = 6;
            frameY = 0;
            needNewArrow = false;
            rArrow = rightArrow;
            lArrow = leftArrow;
        } else {
            if (x < -SOMETHING) x = -speedScore/3;
            else x -= speedScore/3;
        }
        ctx.font = "100px Arial";
        ctx.fillText("X: " + Math.round(-x), 0, 100);
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
        gameFrame++;
        requestAnimationFrame(animate);
    }
    animate();
});