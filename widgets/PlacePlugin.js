Plugin.extend({
    _type: 'place',
    _isContainer: false,
    _render: true,
    initPlugin: function(data) {
        var instance = this;
        var asset = '';
        if(data.asset) {
            //Removing ECML "validate" button generated by AuthoringTool
            if ((data.asset === "validate") || (data.asset === "next") || (data.asset === "previous")) {
                return;
            }
            asset = data.asset;
            
        } else if (data.model) {
            asset = this._stage.getModelValue(data.model);
        } else if (data.param) {
            asset = this.getParam(data.param);
        }
        if(_.isEmpty(asset)) {
            this._render = false;
            console.warn("ImagePlugin: Asset not found", data);
        } else {
            var assetSrc = this._theme.getAsset(asset);

            var img;
            if(_.isString(assetSrc)){
                img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = assetSrc;
            }else{
                img = assetSrc;
            }
            var s = new createjs.Bitmap(img);
            this._self = s;

            var dims = this.relativeDims();

            // // Align the image in its container
            // var xd = dims.x;
            // dims = this.alignDims();
            // s.x = dims.x;
            // s.y = dims.y;
            //{
                var sb = s.getBounds();
                if(sb) {
                    this.setScale();
                }
            //}

            // Align the image in its container
            var xd = dims.x;
            dims = this.alignDims();
            s.x = dims.x;
            s.y = dims.y;
        }    
        var dragItem = {};
        var dragPos = {};
        var asset = this._self;
            asset.cursor = 'pointer';

            asset.on("mousedown", function(evt) {
                this.parent.addChild(this);
                this.offset = {
                    x: this.x - evt.stageX,
                    y: this.y - evt.stageY
                };
                dragItem = instance._value.resvalue;
                dragPos = {
                    x: evt.stageX,
                    y: evt.stageY
                };
                var data = {
                    type: evt.type,
                    x: evt.stageX,
                    y: evt.stageY,
                    drag_id: instance._value.resvalue,
                    itemId: itemId
                }
            });
            asset.on("pressmove", function(evt) {
                this.x = evt.stageX + this.offset.x;
                this.y = evt.stageY + this.offset.y;

                //instance.addShadow();

                Renderer.update = true;
            });
            asset.on("pressup", function(evt) {
                
            });
    },
    alignDims: function() {
        var parentDims = this._parent.dimensions();
        var dims = this._dimensions;

        // Alignment of the image in its parent container
        var align  = (this._data.align ? this._data.align.toLowerCase() : "");
        var valign = (this._data.valign ? this._data.valign.toLowerCase() : "");

        if (align == "left") dims.x = 0;
        else if (align == "right") dims.x = (parentDims.w - dims.w);
        else if (align == "center") dims.x = ((parentDims.w - dims.w)/2);

        if (valign == "top") dims.y = 0;
        else if (valign == "bottom") dims.y = (parentDims.h - dims.h);
        else if (valign == "middle") dims.y = ((parentDims.h - dims.h)/2);

        return this._dimensions;
    },
    refresh: function() {
        var asset = '';
        if (this._data.model) {
            asset = this._stage.getModelValue(this._data.model);   
        } else if (this._data.param) {
            asset = this.getParam(this._data.param);
        } else {
            asset = this._data.asset;
        }
        if (asset) {
            var image = this._theme.getAsset(asset);
            this._self.image = image;
            Renderer.update = true;
        }
    },
});
