window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;

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

    class InputHandler {
        constructor(){
            this.keys = []
            window.addEventListener('keydown', e => {
                console.log(e.key);
            });
        }
    }

    class Player {

    }

    class Background {

    }

    class Enemy {

    }

    function handleEnemies(){

    }

    function displayStatusText(){

    }

    const input = new InputHandler();

    function animate(){

    }
});