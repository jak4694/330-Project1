(function(){
    'use strict';
    
    let walkers = [];
    let canvasWidth, canvasHeight;
    let horizontalBias = 0.5, verticalBias = 0.5;
	let fps = 12;
    let walkerWidth = 5;
    let ctx;
    
    window.onload = function(){
        let canvas = document.querySelector('canvas');
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvas.onclick = canvasClicked;

        ctx = canvas.getContext('2d');

        ctx.fillStyle = 'black';

        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        createWalker(320, 240, "green");
        createWalker(100, 300, "blue");
        createWalker(500, 100, "red");

        setInterval(drawWalker, 1000 / fps);
        //setInterval(cls,5000);

        document.querySelector("#randomWalkerButton").onclick = createRandomWalker;
        document.querySelector("#horizontalBiasSlider").onchange = function(){
            horizontalBias = this.value / 100;
        }
        document.querySelector("#verticalBiasSlider").onchange = function(){
            verticalBias = this.value / 100;
        }
    }


    function drawWalker(){

        for(let i = 0; i < walkers.length; i++)
        {
            ctx.save();
            ctx.fillStyle = walkers[i].color;
            ctx.fillRect(walkers[i].x-walkers[i].width/2,walkers[i].y-walkers[i].width/2,walkers[i].width/2,walkers[i].width/2);
            walkers[i].move();
            ctx.restore();
        }

    }

    function createWalker(x, y, color)
    {
        let walker = {
            x: x,
            y: y,
            color: color,
            width: walkerWidth,
            move(){
                if(abcLIB.flipWeightedCoin()){
                    this.x += abcLIB.flipWeightedCoin(horizontalBias) ? -this.width : this.width;
                }else{
                    this.y += abcLIB.flipWeightedCoin(verticalBias) ? -this.width : this.width;
                }
            }
        };
        walkers.push(walker);
    }

    function createRandomWalker()
    {
        let x = abcLIB.getRandomInt(0, canvasWidth / walkerWidth) * walkerWidth;
        let y = abcLIB.getRandomInt(0, canvasHeight / walkerWidth) * walkerWidth;
        let color = abcLIB.getRandomColor();
        createWalker(x, y, color);
    }

    function cls(){
        ctx.clearRect(0,0,640,480);
    }
    
    function canvasClicked(e){
        let rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - rect.x;
        let mouseY = e.clientY - rect.y;
        createWalker(mouseX - (mouseX % walkerWidth), mouseY - (mouseY % walkerWidth), abcLIB.getRandomColor());
    }
})()