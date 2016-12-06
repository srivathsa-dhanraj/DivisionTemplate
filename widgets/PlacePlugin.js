Plugin.extend({
    _type: 'place',
    _isContainer: false,
    _render: true,
    _divisor: 0,
    _value: 0,
    initPlugin: function(data) {
        var instance = this;
        var originX = 0;
        var originY = 0;
        var columnWidth = 0;

        var asset = '';
        if (data.asset) {
            asset = data.asset;
        } else if (data.model) {
            asset = this._stage.getModelValue(data.model);
        } else if (data.param) {
            asset = this.getParam(data.param);
        }
        if (_.isEmpty(asset)) {
            this._render = false;
            console.warn("ImagePlugin: Asset not found", data);
        } else {
            var assetSrc = this._theme.getAsset(asset);

            var img;
            if (_.isString(assetSrc)) {
                img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = assetSrc;
            } else {
                img = assetSrc;
            }
            var s = new createjs.Bitmap(img);


            var dims = this._parent.relativeDims();

            s.x = dims.x;
            s.y = dims.y;
            s.w = dims.w;
            s.h = dims.h;
            this._self = s;
            //console.log("dims in place ",dims);
            this.setScale();

            var dims = this.relativeDims();
            this._self.x = dims.x;
            this._self.y = dims.y;
            this._self.h = dims.h;
            this._self.w = dims.w;

            originX = this._parent._self.x;
            originY = this._parent._self.y;
            instance._value = data.value;
            columnWidth = data.subColLimit * data.subColWidth;

            var initialParent = instance._parent;
            var place = instance._value.toString().length;


        }



        var dragItem = {};
        var dragPos = {};
        var preDragPos = {};
        var asset = this._self;
        asset.cursor = 'pointer';

        asset.on("mousedown", function(evt) {
            this.offset = {
                x: this.x - evt.stageX,
                y: this.y - evt.stageY
            };
            dragPos = {
                x: evt.stageX,
                y: evt.stageY
            };

            preDragPos.x = this.x;
            preDragPos.y = this.y;
        });
        asset.on("pressmove", function(evt) {
            //Move only if the next higher place value is empty. (Current place val is place-1)
            if (instance._parent._splitAllowed && (instance._parent.getElementCount(place) != 0 || instance._parent.getElementCount(place) == undefined)) {
               return;
            }
            //if(!instance._parent._splitAllowed)
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;

            //var leftEdge = originX + instance._self.x;
            //var topEdge = originY + instance._self.y;
            //console.log("leftedge "+leftEdge+" topEdge "+topEdge+"");

            Renderer.update = true;
        });
        asset.on("pressup", function(evt) {

            var trays;
            var thisObj = instance;
            while (thisObj._parent != undefined) {
                if (thisObj._parent._trays != undefined) {
                    trays = thisObj._parent._trays;
                    instance._divisor = trays.length - 1;
                    break;
                } else {
                    thisObj = thisObj._parent;

                }
            }
            if (trays == undefined) {
                console.log("_trays not found");
                return;
            }


            for (var i = 0; i < trays.length; i++) {

                var t = trays[i];
                var snapped = false;

                var leftEdge = originX + instance._self.x;
                var topEdge = originY + instance._self.y;
                var rightEdge = leftEdge + instance._dimensions.w;
                var bottomEdge = topEdge + instance._dimensions.h;

                //console.log("leftedge "+leftEdge+" topEdge "+topEdge);

                var trayLeft = t._self.x;
                var trayRight = t._self.x + t._dimensions.w;
                var trayTop = t._self.y;
                var trayBottom = t._self.y + t._dimensions.h;

                if (leftEdge > trayLeft && topEdge > trayTop &&
                    rightEdge < trayRight &&
                    bottomEdge < trayBottom) {
                    //console.log("dropped on "+t._id);

                    if (t != instance._parent) {


                        var index = instance._parent._childIds.indexOf(instance._id);
                        if (index != -1) {
                            instance._parent._childIds.splice(index, 1);
                            t._childIds.push(instance._id);

                            instance._parent._value -= instance._value;
                            t._value += instance._value;

                            t.updateValue();
                            instance._parent.updateValue();
                        }

                        var actualX = trayRight - ((instance._parent._colWidth * place) * t._dimensions.w * 0.01);

                        var rowY;
                        var roundedCount;

                        rowY = t.getElementCount(place - 1) % (100 / data.h);
                        roundedCount = t.getElementCount(place - 1) - rowY;
                        t.incrementElementCount(place - 1);
                        instance._parent.decrementElementCount(place - 1);

                        var sets = roundedCount / (100 / data.h);
                        var colId = sets % data.subColLimit;
                        instance._self.x = (trayRight - (place * columnWidth * 0.01 * (t._dimensions.w)) + (colId * instance._self.w)) - originX;

                        instance._self.y = (trayTop + rowY * instance._dimensions.h) - originY;

                        instance._parent = t;

                        Renderer.update = true;
                        snapped = true;
                        break;


                    } else if (instance._parent._splitAllowed && instance._parent.getElementCount(place - 1) <= instance._parent._number[place-1]%instance._divisor) {

                        var relativeX = (originX + instance._self.x) - t._self.x;
                        var droppedColId = Math.floor(relativeX / (columnWidth * 0.01 * t._dimensions.w));
                        var droppedPlace = (Math.floor(100 / columnWidth)) - droppedColId;

                        if (droppedPlace == place - 1) {
                            instance._parent._value -= instance._value;
                            instance._parent.decrementElementCount(droppedPlace);
                            initialParent.removeChild(instance._self);

                            for (var i = 0; i < 10; i++) {
                                var val = (Math.pow(10, droppedPlace) / 10);
                                var placeObjectData = {};
                                //console.log("x ");
                                rowY = t.getElementCount(droppedPlace - 1) % (100 / data.h);
                                roundedCount = t.getElementCount(droppedPlace - 1) - rowY;
                                t.incrementElementCount(droppedPlace - 1);
                                //t._parent._number[droppedPlace-1]++;

                                if (droppedPlace == 1) {
                                    placeObjectData.asset = "one";
                                } else if (droppedPlace == 2) {
                                    placeObjectData.asset = "ten";
                                } else if (droppedPlace == 3) {
                                    placeObjectData.asset = "hundred";
                                } else if (droppedPlace == 4) {
                                    placeObjectData.asset = "thousand";
                                }


                                sets = roundedCount / (100 / data.h);
                                colId = sets % data.subColLimit;


                                var newx = (droppedColId * columnWidth) + (colId * (columnWidth / data.subColLimit));
                                var newy = rowY * data.h;



                                placeObjectData.w = data.w;
                                placeObjectData.h = data.h;
                                placeObjectData.x = newx;
                                placeObjectData.y = newy;
                                placeObjectData.id = data.id + "_";
                                placeObjectData.subColLimit = data.subColLimit;
                                placeObjectData.subColWidth = data.subColWidth;
                                //placeObjectData.asset = 'thousand';
                                placeObjectData.value = val;
                                instance._parent.createPlaceValue(placeObjectData);

                            }
                            console.log("update number here?");
                            instance._parent._number[place-2]+=10;
                        }
                    }else{
                        if(!instance._parent._splitAllowed){
                            console.log("Cannot split in this tray");
                        }
                        else if(instance._parent.getElementCount(place - 1) >= instance._divisor){
                            console.log("No need to split");
                        }
                    }
                }

            }

            if (!snapped) {
                instance._self.x = preDragPos.x;
                instance._self.y = preDragPos.y;
                Renderer.update = true;
            } else {
                snapped = false;
            }               
        });
    }
});