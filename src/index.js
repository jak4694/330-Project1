(function(){
    'use strict';
    
    let walkers = [];
    let canvasWidth, canvasHeight;
    let horizontalBias = 0.5, verticalBias = 0.5;
	let fps = 12;
    let walkerWidth = 5;
    let paused = false;
    let drawShape = "square";
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

        drawWalkers();
        //setInterval(cls,5000);

        document.querySelector("#playButton").onclick = function(){
            if(!paused)
            {
                return;
            }
            paused = false;
            drawWalkers();
        }
        document.querySelector("#pauseButton").onclick = function(){
            paused = true;
        }
        document.querySelector("#clearButton").onclick = cls;
        document.querySelector("#randomWalkerButton").onclick = createRandomWalker;
        document.querySelector("#clearWalkersButton").onclick = clearAllWalkers;
        document.querySelector("#horizontalBiasSlider").onchange = function(){
            horizontalBias = this.value / 100;
        }
        document.querySelector("#verticalBiasSlider").onchange = function(){
            verticalBias = this.value / 100;
        }
        document.querySelector("#fpsSlider").onchange = function(){
            fps = this.value;
        }
        document.querySelector("#walkerShapeDropdown").onchange = function(){
            drawShape = this.value;
        }
    }


    function drawWalkers()
    {
        if(paused)
        {
            return;
        }
        setTimeout(drawWalkers, 1000 / fps);
        for(let i = 0; i < walkers.length; i++)
        {
            ctx.save();
            ctx.fillStyle = walkers[i].color;
            if(drawShape == "circle")
            {
                ctx.beginPath();
                ctx.arc(walkers[i].x,walkers[i].y,walkers[i].width/2,0,Math.PI*2);
                ctx.fill();
                ctx.closePath();
            }
            else
            {
                ctx.fillRect(walkers[i].x-walkers[i].width/2,walkers[i].y-walkers[i].width/2,walkers[i].width/2,walkers[i].width/2);
            }
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
    
    function clearAllWalkers()
    {
        walkers.length = 0;
        cls();
    }

    function cls(){
        ctx.save();
        ctx.fillStyle = "black";
        ctx.globalAlpha = 1;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    
    function canvasClicked(e){
        let rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - rect.x;
        let mouseY = e.clientY - rect.y;
        createWalker(mouseX - (mouseX % walkerWidth), mouseY - (mouseY % walkerWidth), abcLIB.getRandomColor());
    }
})()