(function(){
    'use strict';
    
    let jakLIB = {
        getRandomInt(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
		
		getRandomColor(){
			function getByte(){
				return 55 + Math.round(Math.random() * 200);
			}
			return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",.8)";
		},
		
		flipWeightedCoin(weight = 0.5){
			return Math.random() > weight;
		},
        
        cls(ctx, canvasWidth, canvasHeight){
            ctx.save();
            ctx.fillStyle = "black";
            ctx.globalAlpha = 1;
            ctx.fillRect(0,0,canvasWidth,canvasHeight);
            ctx.restore();
        },
        
        getColorAtPosition(ctx, x, y, width = 1, height = 1)
        {
            let colorData = ctx.getImageData(x, y, width, height).data;
            let red = 0;
            let green = 0;
            let blue = 0;
            let alpha = 0;
            for(let i = 0; i < colorData.length; i+=4)
            {
                {
                    red += colorData[i];
                    green += colorData[i + 1];
                    blue += colorData[i + 2];
                    alpha += colorData[i + 3];
                }
            }
            red = Math.floor(red / (width * height));
            blue = Math.floor(blue / (width * height));
            green = Math.floor(green / (width * height));
            alpha = Math.floor(alpha / (width * height)) / 255;
            return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
        }
    };
    
    if(window)
    {
        window["jakLIB"] = jakLIB;
    }
    else
    {
        throw "'window' is not defined!";
    }
})()