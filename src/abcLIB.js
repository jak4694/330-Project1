(function(){
    'use strict';
    
    let abcLIB = {
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
		}
    };
    
    if(window)
    {
        window["abcLIB"] = abcLIB;
    }
    else
    {
        throw "'window' is not defined!";
    }
})()