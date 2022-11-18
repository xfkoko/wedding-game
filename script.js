window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 3250;
    const CANVAS_HEIGHT = canvas.height = 1300;

    const rightArrow = new Image();
    rightArrow.src = 'arrow_frames/rightpassive.png';
    const leftArrow = new Image();
    leftArrow.src = 'arrow_frames/leftpassive.png';
    const redRightArrow = new Image();
    redRightArrow.src = 'arrow_frames/rightactive.png';
    const redLeftArrow = new Image();
    redLeftArrow.src = 'arrow_frames/leftactive.png';
    const R_ARROW_X = 1675;
    const R_ARROW_Y = 880
    const L_ARROW_X = 1168;
    const L_ARROW_Y = 880;
    let needNewArrow = true;
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
                    needNewArrow = true;
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
                        speed = speed - 3;
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
                    needNewArrow = true;
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
                        speed = speed - 3;
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
            frameY = 0;
            staggerFrames = 6;
        }
    })

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
        if (frameY === 0) {
            divider = 26;
        } else {
            divider = 12;
        }
        let position = Math.floor(gameFrame/staggerFrames) % divider;
        frameX = spriteWidth * position;
        
        if (needNewArrow) {
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