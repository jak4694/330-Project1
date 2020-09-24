(function(){
    'use strict';
    
    let walkers = [];
    let canvasWidth, canvasHeight;
    let horizontalBias = 0.5, verticalBias = 0.5;
	let fps = 30;
    let walkerWidth = 5;
    let paused = false;
    let drawShape = "square";
    let drawColor = "picture";
    let movementRestrictions = "confined";
    let startWalkerCount = 20;
    let ctx;
    let hiddenCtx;
    
    window.onload = function(){
        
        hiddenCtx = document.querySelector("#hiddenCanvas").getContext('2d');
        let canvas = document.querySelector('canvas');
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvas.onclick = canvasClicked;

        ctx = canvas.getContext('2d');

        ctx.save();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.rect(0, 0, canvasWidth, canvasHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        hiddenCtx.drawImage(document.querySelector("#starterImage"), 0, 0, canvasWidth, canvasHeight);
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
        document.querySelector("#resetBiasButton").onclick = function(){
            document.querySelector("#horizontalBiasSlider").value = 50;
            document.querySelector("#verticalBiasSlider").value = 50;
            horizontalBias = 0.5;
            verticalBias = 0.5;
        }
        document.querySelector("#fpsSlider").onchange = function(){
            fps = this.value;
        }
        document.querySelector("#movementRestrictionsDropdown").onchange = function(){
            movementRestrictions = this.value;
            if(movementRestrictions == "confined")
            {
                document.querySelector("#pictureOption").disabled = false;
            }
            else
            {
                document.querySelector("#pictureOption").disabled = true;
            }
        }
        document.querySelector("#walkerShapeDropdown").onchange = function(){
            drawShape = this.value;
        }
        document.querySelector("#walkerColorDropdown").onchange = function(){
            drawColor = this.value;
            if(drawColor == "picture")
            {
                document.querySelector("#noRestrictions").disabled = true;
                document.querySelector("#wrapRestrictions").disabled = true;
                for(let i = 0; i < walkers.length; i++)
                {
                    if(walkers[i].x < walkerWidth)
                    {
                        walkers[i].x = walkerWidth;
                    }
                    else if(walkers[i].x > canvasWidth - walkerWidth)
                    {
                        walkers[i].x = canvasWidth - walkerWidth;
                    }
                    if(walkers[i].y < walkerWidth)
                    {
                        walkers[i].y = walkerWidth;
                    }
                    else if(walkers[i].y > canvasHeight - walkerWidth)
                    {
                        walkers[i].y = canvasHeight - walkerWidth;
                    }
                }
            }
            else
            {
                document.querySelector("#noRestrictions").disabled = false;
                document.querySelector("#wrapRestrictions").disabled = false;
            }
        }
        document.querySelector("#fileUploadButton").onchange = function(e){
            let img = new Image();
            img.src = URL.createObjectURL(e.target.files[0]);
            img.onload = function(){
                hiddenCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                document.querySelector("#pictureOption").disabled = false;
            };
            img.fail = function(){};
        }
        
        for(let i = 0; i < startWalkerCount; i++)
        {
            createRandomWalker();
        }
        drawWalkers();
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
            let previousX = walkers[i].x;
            let previousY = walkers[i].y;
            walkers[i].move();
            ctx.save();
            let color;
            if(drawColor == "rainbow")
            {
                color = jakLIB.getRandomColor();
            }
            else if(drawColor == "picture")
            {
                let x = walkers[i].x;
                let y = walkers[i].y;
                if(x < walkerWidth || x > canvasWidth - walkerWidth || y < walkerWidth || y > canvasHeight - walkerWidth)
                {
                    color = jakLIB.getRandomColor();
                }
                else
                {
                    color = jakLIB.getColorAtPosition(hiddenCtx, x, y, walkerWidth * 2, walkerWidth * 2);
                }
            }
            else
            {
                color = walkers[i].color;
            }
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            if(drawShape == "circle")
            {
                ctx.beginPath();
                ctx.arc(walkers[i].x,walkers[i].y,walkers[i].width/2,0,Math.PI*2);
                ctx.fill();
                ctx.closePath();
            }
            else if(drawShape == "lines")
            {
                ctx.lineWidth = walkerWidth;
                ctx.beginPath();
                ctx.moveTo(previousX, previousY);
                ctx.lineTo(walkers[i].x, walkers[i].y);
                ctx.closePath();
                ctx.stroke();
            }
            else
            {
                ctx.beginPath();
                ctx.rect(walkers[i].x-walkers[i].width/2,walkers[i].y-walkers[i].width/2,walkers[i].width/2,walkers[i].width/2);
                ctx.closePath();
                ctx.fill();
            }
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
                }
                else{
                    this.y += jakLIB.flipWeightedCoin(verticalBias) ? -this.width : this.width;
                }
                if(movementRestrictions == "wrap")
                {
                    if(this.x < 0)
                    {
                        this.x = canvasWidth - this.x;
                    }
                    else if(this.x > canvasWidth)
                    {
                        this.x -= canvasWidth;
                    }
                    if(this.y < 0)
                    {
                        this.y = canvasHeight - this.xy;
                    }
                    else if(this.y > canvasHeight)
                    {
                        this.y -= canvasHeight;
                    }
                }
                else if(movementRestrictions == "confined")
                {
                    if(this.x < walkerWidth)
                    {
                        this.x = walkerWidth;
                    }
                    else if(this.x > canvasWidth - walkerWidth)
                    {
                        this.x = canvasWidth - walkerWidth;
                    }
                    if(this.y < walkerWidth)
                    {
                        this.y = walkerWidth;
                    }
                    else if(this.y > canvasHeight - walkerWidth)
                    {
                        this.y = canvasHeight - walkerWidth;
                    }
                }
            }
        };
        walkers.push(walker);
    }

    function createRandomWalker()
    {
        let components = jakLIB.getRandomWalkerComponents(canvasWidth, canvasHeight, walkerWidth);
        createWalker(components.x, components.y, components.color);
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