window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 3250;
    const CANVAS_HEIGHT = canvas.height = 1300;

    var rect = {
        x:0,
        y:0,
        width:200,
        height:100,

    }

    const rightArrow = new Image();
    rightArrow.src = 'arrow_frames/rightpassive.png';
    const leftArrow = new Image();
    leftArrow.src = 'arrow_frames/leftpassive.png';

    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas, evt);
    
        if (isInside(mousePos,rect)) {
            alert('clicked inside rect');
        }else{
            alert('clicked outside rect');
        }   
    }, false);

    const textDisplay = this.document.getElementById('textDisplay');
    const rButton = this.document.getElementById('rightButton');
    const lButton = this.document.getElementById('leftButton');

    rButton.addEventListener('click', rightClicked);
    lButton.addEventListener('click', leftClicked);

    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function isInside(pos, rect) {
        return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y;
    }

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
        ctx.drawImage(rightArrow, 1675, 880);
        ctx.drawImage(leftArrow, 1168, 880);
        ctx.drawImage(playerImage, frameX, frameY * spriteHeight, spriteWidth,
            spriteHeight, 50, 500, spriteWidth, spriteHeight);

        gameFrame++;
        requestAnimationFrame(animate);
    }
    animate();
});