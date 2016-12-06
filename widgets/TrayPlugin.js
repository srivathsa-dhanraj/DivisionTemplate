/*
TODO:
-Get rid of local 'colsWidth'
*/
Plugin.extend({
    _type: 'tray',
    _isContainer: true,
    _render: true,
    _number:[],//This for acting like global static. WTF!
    _value:0,
    _valueText:undefined,
    _splitAllowed:false,
    _colCount:0,
    _unitsCount:0,
    _tensCount:0,
    _hundredsCount:0,
    _thousandsCount:0,
    _uCounter:undefined,
    _tCounter:undefined,
    _hCounter:undefined,
    _thCounter:undefined,
    _counterTexts:undefined,
    _elementCounts:undefined,
    initPlugin: function(data) {
        
        var instance = this;
        this._self = new createjs.Container();
        
        var dims = this.relativeDims();
        this._self.x = dims.x;
        this._self.y = dims.y;
        this._self.h = dims.h;
        this._self.w = dims.w;
        
        this._splitAllowed = data.allowSplit;
        
        //console.log("Tray dims ",dims);
        //var number = this._stage.getModelValue(data.number);
        
        var input = data.numberValue;
        var number = [];
        number.push((input%10));
        number.push(((Math.floor(input/10))%10));
        number.push(Math.floor((input/100)%10));
        number.push(Math.floor(input/1000)); 
        instance._number = number;
        
        
        this._elementCounts = [];
        this._counterTexts = [];
        //var totalElements = number.unit + number.tenth + number.hundredth + number.thousandth;
        var totalElements = number[3]+number[2]+number[1]+number[0];
        //var availableWidth = Math.floor(Math.sqrt(10000/totalElements));
        //var rowLimit = Math.ceil(100/availableWidth);
        instance._colCount = data.colCount;
        var colsWidth = (100/instance._colCount);
        var subColLimit = 2;
        var subColWidth = (colsWidth / subColLimit);
        var rowCount = 5;
        
        var elementWidth = subColWidth;
        var elementHeight = 100/rowCount;
        var totalRows = Math.floor(100/elementHeight);
        
        var placeObjectData = {};
        
        var row = 0;
        var subCol = 0;
        var index = 0;
        
        
        //var onesHeight = Math.floor(100/rowLimit) - 2;
        for(var j=0; j<data.colCount; j++){
            instance._elementCounts.push(0);
        }
        var placeValueCount = 1;
        for(var i=0; i<totalElements; i++){
            
            placeObjectData.w = elementWidth;
            placeObjectData.h = elementHeight;
            placeObjectData.id = data.id+"_"+i;
            placeObjectData.subColLimit = subColLimit;
            placeObjectData.subColWidth = subColWidth
            
            if(placeValueCount > totalElements - number[3]){
                
                placeObjectData.asset = 'thousand';
                placeObjectData.value = 1000;
                
            }else if(placeValueCount > totalElements - number[3] - number[2]){
                
                placeObjectData.asset = 'hundred';
                placeObjectData.value = 100;
                
            }else if(placeValueCount > totalElements - number[3] - number[2] - number[1]){
                
                placeObjectData.asset = 'ten';
                placeObjectData.value = 10;
                
            }else{
                
                placeObjectData.asset = 'one';
                placeObjectData.value = 1;
            }
            
            var place = placeObjectData.value.toString().length;
            var rowY = instance.getElementCount(place-1)%(100/elementHeight);
            placeObjectData.x = 100-(colsWidth*place) + (subCol * subColWidth);
            if(rowY==totalRows-1){
                subCol++;
                if(subCol==subColLimit){
                    subCol = 0;
                }
            }
                
            placeObjectData.y =  rowY * elementHeight;
            instance.incrementElementCount(place-1);
            instance.getElementCount(place-1)==number[place-1]?subCol=0:subCol;
            
            instance.createPlaceValue(placeObjectData);
            
            placeValueCount++;
            
        }
        
        //Shape for the tray
        var bgShape = new createjs.Shape();
        var color;
        color = "red";
        bgShape.graphics = new createjs.Graphics().beginStroke(color).drawRect(0,0,dims.w,dims.h);
        bgShape.alpha = 0.5;
        this._self.addChild(bgShape);
        
        //Shape for each column in the tray
        for(var i=0; i<instance._colCount; i++){
            var colShape = new createjs.Shape();
            var color = "blue";
            colShape.graphics = new createjs.Graphics().beginStroke(color).drawRect(i*(colsWidth*dims.w/100),0,colsWidth*dims.w/100,dims.h);
            colShape.alpha = 0.5;
            this._self.addChild(colShape);
        }
        
        //var p = PluginManager.invoke('place', data, instance._parent, instance._stage, instance._theme);
        var textData = {};
        textData.x = 0;
        textData.y = -10;
        textData.w = 100;
        textData.h = 5;
        textData.id = "valueText";
        textData.fontsize = "1em";
        textData.__text = "value";
        instance._valueText = instance.createTextField(textData);
        
        for(var i=0; i<data.colCount; i++){
            textData.x = 100 - ((i+1) * colsWidth);
            textData.y = 101;
            textData.w = colsWidth;
            textData.h = 5;
            textData.id = "valueText";
            textData.fontsize = "1em";
            textData.__text = ""+instance.getElementCount(i);
            instance._counterTexts.push(instance.createTextField(textData));
            
        }
        //Renderer.update = true;
        instance.updateValue();
        
    },
    createPlaceValue: function(value){
        var instance = this;
        instance._value += value.value;
        //instance.incrementElementCount(value.value.toString().length-1);
        instance.updateValue();
        var p = PluginManager.invoke('place', value, instance, instance._stage, instance._theme);
        Renderer.update = true;
    },
    createTextField: function(td){
        var instance = this;
        td.align = "center";
        return PluginManager.invoke('text', td, instance, instance._stage, instance._theme);
        //instance.updateValue();
    },
    updateValue: function(){
        if(this._valueText){
            this._valueText._self.text = "Value: "+this._value;
            Renderer.update = true;
        }
    },
    getElementCount: function(i){
        var instance = this;
        var val = instance._elementCounts[i];
        val == undefined? val=0 : val;
        return val;

    },
    incrementElementCount:function(i){
        var instance = this;
        var val = 0;
        instance._elementCounts[i]++;
        instance._counterTexts[i]?instance._counterTexts[i]._self.text = instance._elementCounts[i]:0;

        Renderer.update = true;
        return val;
    },
    decrementElementCount:function(i){
        var instance = this;
        var val = 0;
        instance._elementCounts[i]--;
        val = instance._elementCounts[i];
        instance._counterTexts[i]?instance._counterTexts[i]._self.text = instance._elementCounts[i]:0;

        Renderer.update = true;
        return val;
    }
});

