/*TODO:
-Position place values into columns in master tray
-Splitting within columns.
-Snap within tray columns on drop.
-Master tray on left. Size static. Everything on right 
-Question on top of mater tray (eg Divide 642 by 4)
*/
Plugin.extend({
    _type: 'division',
    _isContainer: true,
    _render: true,
    _trays:[],
    initPlugin: function(data) {
        
        var instance = this;
        
        this._self = new createjs.Container();
        
        var dims = this.relativeDims();
        this._self.x = dims.x;
        this._self.y = dims.y;
        this._self.w = dims.w;
        this._self.h = dims.h;
        
        console.log("Division dims ",dims);
        console.log("Stage dims ",this._stage.w);
        
        var dividend = 1452;
        //this.invokeChildren(data, this, this._stage, this._theme);
        var trayData = {};
        trayData.x = 0;
        trayData.y = 25;
        trayData.w = 30;
        trayData.h = 45;
        trayData.colCount = dividend.toString().length;
        trayData.numberValue = dividend;
        trayData.allowSplit = true;
        trayData.asset = 'hundred';
        trayData.id = 'tray1';
        
        var p1 = PluginManager.invoke('tray', trayData, instance, instance._stage, instance._theme);
        instance._trays.push(p1);
        
        trayData.x = 32;
        trayData.y = 5;
        trayData.w = 30;
        trayData.h = 45;
        trayData.colCount2 = dividend.toString().length;
        trayData.numberValue = 0;
        trayData.allowSplit = false;
        trayData.asset = 'hundred';
        trayData.id = 'tray2';
        var p2 = PluginManager.invoke('tray', trayData, instance, instance._stage, instance._theme);
        instance._trays.push(p2);
        
        trayData.x = 32;
        trayData.y = 60;
        trayData.w = 30;
        trayData.h = 45;
        trayData.colCount = dividend.toString().length;
        trayData.numberValue = 0;
        trayData.allowSplit = false;
        trayData.asset = 'hundred';
        trayData.id = 'tray3';
        var p3 = PluginManager.invoke('tray', trayData, instance, instance._stage, instance._theme);
        instance._trays.push(p3);
        
        trayData.x = 65;
        trayData.y = 5;
        trayData.w = 30;
        trayData.h = 45;
        trayData.colCount = dividend.toString().length;
        trayData.numberValue = 0;
        trayData.allowSplit = false;
        trayData.asset = 'hundred';
        trayData.id = 'tray4';
        var p4 = PluginManager.invoke('tray', trayData, instance, instance._stage, instance._theme);
        instance._trays.push(p4);
        
        
        trayData.x = 65;
        trayData.y = 60;
        trayData.w = 30;
        trayData.h = 45;
        trayData.colCount = dividend.toString().length;
        trayData.numberValue = 0;
        trayData.allowSplit = false;
        trayData.asset = 'hundred';
        trayData.id = 'tray5';
        var p5 = PluginManager.invoke('tray', trayData, instance, instance._stage, instance._theme);
        instance._trays.push(p5);
        
        console.log("_trays "+this._trays.length);
    },
    testFunc: function(value){
        console.log("test log "+value);
    }

});
