window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 3250;
    const CANVAS_HEIGHT = canvas.height = 1300;

    const textDisplay = this.document.getElementById('textDisplay');
    const rButton = this.document.getElementById('rightButton');
    const lButton = this.document.getElementById('leftButton');

    rButton.addEventListener('click', rightClicked);
    lButton.addEventListener('click', leftClicked);

    function rightClicked() {
        textDisplay.innerHTML = "Right clicked";
        console.log("Right")
    }

    function leftClicked() {
        textDisplay.innerHTML = "Left clicked";
        console.log("Left")
    }

    const playerImage = new Image();
    playerImage.src = 'groom_frames/idlesheet2.png';
    const spriteWidth = 650;
    const spriteHeight = 650;
    let frameX = 0;
    let frameY = 0;
    let gameFrame = 5;
    const staggerFrames = 7;

    function animate(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        let position = Math.floor(gameFrame/staggerFrames) % 18;
        frameX = spriteWidth * position;
        ctx.drawImage(playerImage, frameX, frameY * spriteHeight, spriteWidth,
            spriteHeight, 50, 500, spriteWidth, spriteHeight);

        gameFrame++;
        requestAnimationFrame(animate);
    }
    animate();
});