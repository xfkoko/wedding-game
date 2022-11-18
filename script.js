window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 3250;
    const CANVAS_HEIGHT = canvas.height = 1300;

    const rightArrow = new Image();
    rightArrow.src = 'arrow_frames/rightpassive.png';
    const leftArrow = new Image();
    leftArrow.src = 'arrow_frames/leftpassive.png';

    canvas.addEventListener('click', function(evt) {
        if(frameY == 1) frameY = 0;
        else frameY = 1;
    }, false);

    const playerImage = new Image();
    playerImage.src = 'groom_frames/animations.png';
    const spriteWidth = 650;
    const spriteHeight = 650;
    let frameX = 0;
    let frameY = 0;
    let gameFrame = 5;
    const staggerFrames = 6;
    let divider = 6;

    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (frameY === 0) {
            divider = 26;
        } else {
            divider = 6;
        }
        let position = Math.floor(gameFrame/staggerFrames) % divider;
        frameX = spriteWidth * position;
        ctx.drawImage(rightArrow, 1675, 880);
        ctx.drawImage(leftArrow, 1168, 880);
        ctx.drawImage(playerImage, frameX, frameY * spriteHeight, spriteWidth,
            spriteHeight, 50, 500, spriteWidth, spriteHeight);
        gameFrame++;
        requestAnimationFrame(animate);
    }
    animate();
});