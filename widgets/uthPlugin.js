Plugin.extend({
    _type: 'uth',
    _isContainer: false,
    _render: true,
    initPlugin: function(data) {
        var instance = this;
        var dims = this.relativeDims();
		
		this._self = new createjs.Container();
		    this._self.x = dims.x;
            this._self.y = dims.y;
            this._self.origX = dims.x;
            this._self.origY = dims.y;
            this._self.width = dims.w;
            this._self.height = dims.h;
			this._render = true;
			
		/*UTH Plugin starts*/
		
		
      function loadImages(callback) {
	   
			var images = {};
			callback(images);
		
		  }
         
		  var totalwidth = data.w;
		  var totalheight = data.h;
		  		  
		var input = this._stage.getModelValue(data.inputNumber);
		if(input <= 999){
		
			var number = {};
			number.hundredth = Math.floor(input/100);
			var hundrethnumber = number.hundredth;
			number.tenth = ((Math.floor(input/10))%10);
			var tenthnumber = number.tenth;
			number.unit = (input%10);
			var unitnumber = number.unit;

			loadImages(function (images) {

		     		var changeinwidth = Math.floor((totalwidth/data.w)*100);
					var changeinheight = Math.floor((totalheight/data.h)*100);
					var splitwidth = 30;
					var imagewidthhundredth = splitwidth/5; 
					var imageheighthundredth = (data.h/2); 
				    var imagewidthtenth = (splitwidth/5);
					var imageheighttenth = (data.h/2); 
					var imagewidthunit = (splitwidth/3);
					var imageheightunit = (data.h/3);
					 
			      var x=data.x;
				  var y=data.y;
				  var xvar = Math.floor((tenthnumber*changeinwidth)/100)+x;
				  var yvar = y + 10;
				  var vvar = Math.floor((unitnumber*changeinwidth)/100);
				  var wvar = yvar + 10;
				  
				 drawimages(imagewidthhundredth,imageheighthundredth,x,images,y,"tenth",number.hundredth);
				 var xtenthvalue = x + splitwidth+5;
				 drawimages(imagewidthtenth, imageheighttenth, xtenthvalue,images,y,"tenth",number.tenth);
				 var xunitvalue = xtenthvalue + splitwidth+2;
				 drawimages(imagewidthunit, imageheightunit, xunitvalue,images,y,"one",number.unit);
				  
			});
			
			function drawimages(imagewidthhundredth,imageheighthundredth,x,images,y,a,c){
				  var d = {};
				  d.x = x;
				  d.y = y;
				  d.w = 30;
				  d.h = 50;
				  d.type = 'gridLayout';
				  d.asset = a;
				 d.count = c;
				PluginManager.invoke('placeholder', d, instance, instance._stage, instance._theme);
			}
		}
		
		/*UTH Plugin ends*/
    }
	    
	
});

