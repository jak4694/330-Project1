(function(){
    'use strict';
    
    let walkers = [];
    let canvasWidth, canvasHeight;
    let horizontalBias = 0.5, verticalBias = 0.5;
	let fps = 12;
    let walkerWidth = 5;
    let paused = false;
    let drawShape = "square";
    let drawColor = "colored";
    let ctx;
    let hiddenCtx;
    
    window.onload = function(){
        
        hiddenCtx = document.querySelector("#hiddenCanvas").getContext('2d');
        let canvas = document.querySelector('canvas');
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvas.onclick = canvasClicked;

        ctx = canvas.getContext('2d');

        ctx.fillStyle = 'black';

        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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
        document.querySelector("#clearButton").onclick = function(){
            jakLIB.cls(ctx, canvasWidth, canvasHeight);
        }
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
        document.querySelector("#walkerColorDropdown").onchange = function(){
            drawColor = this.value;
        }
        document.querySelector("#fileUploadButton").onchange = function(e){
            let img = new Image();
            img.src = URL.createObjectURL(e.target.files[0]);
            img.onload = function(){
                hiddenCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                jakLIB.getColorAtPosition(hiddenCtx, 0, 0, canvasWidth, canvasHeight);
                document.querySelector("#pictureOption").disabled = false;
            };
            img.fail = function(){};
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
            let color;
            if(drawColor == "rainbow")
            {
                color = jakLIB.getRandomColor();
            }
            else if(drawColor == "picture")
            {
                let x = walkers[i].x - walkerWidth;
                if(x < 0)
                {
                    x = 0;
                }
                else if(x > canvasWidth - (walkerWidth * 2))
                {
                    x = canvasWidth - (walkerWidth * 2);
                }
                let y = walkers[i].y - walkerWidth;
                if(y < 0)
                {
                    y = 0;
                }
                else if(y > canvasHeight - (walkerWidth * 2))
                {
                    y = canvasHeight - (walkerWidth * 2);
                }
                color = jakLIB.getColorAtPosition(hiddenCtx, x, y, walkerWidth * 2, walkerWidth * 2);
            }
            else
            {
                color = walkers[i].color;
            }
            ctx.fillStyle = color;
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
                if(jakLIB.flipWeightedCoin()){
                    this.x += jakLIB.flipWeightedCoin(horizontalBias) ? -this.width : this.width;
                }else{
                    this.y += jakLIB.flipWeightedCoin(verticalBias) ? -this.width : this.width;
                }
            }
        };
        walkers.push(walker);
    }

    function createRandomWalker()
    {
        let x = jakLIB.getRandomInt(0, canvasWidth / walkerWidth) * walkerWidth;
        let y = jakLIB.getRandomInt(0, canvasHeight / walkerWidth) * walkerWidth;
        let color = jakLIB.getRandomColor();
        createWalker(x, y, color);
    }
    
    function clearAllWalkers()
    {
        walkers.length = 0;
    }
    
    function canvasClicked(e){
        let rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - rect.x;
        let mouseY = e.clientY - rect.y;
        createWalker(mouseX - (mouseX % walkerWidth), mouseY - (mouseY % walkerWidth), jakLIB.getRandomColor());
    }
})()