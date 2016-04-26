
var Events = require('eventor');
    function Lottery(opt) {
        this.conId = opt.id || "";
        this.conNode = document.getElementById(this.conId);
        this.cover = opt.cover; //封面图片地址
        this.coverType = 'image'; //封面是一张图片也可以是背景色
        this.brushSize = opt.brushSize || 44,
        this.width = opt.width || 250;
        this.height = opt.height || 64;
        this.lotteryType = !!opt.canvasBack && !!opt.canvasBack.lotteryType ? opt.canvasBack.lotteryType : 'image';
        this.backImage = !!opt.canvasBack && !!opt.canvasBack.backImage ?  opt.canvasBack.backImage : '';
        this.family = !!opt.canvasBack && !!opt.canvasBack.fontFamily ? opt.canvasBack.fontFamily : 'Arial';
        this.fontSize = !!opt.canvasBack && !!opt.canvasBack.fontSize ? opt.canvasBack.fontSize : 22; 
        this.color = !!opt.canvasBack && !!opt.canvasBack.color ? opt.canvasBack.color : '#b65100';
        this.backgroundColor = !!!!opt.canvasBack && !!opt.canvasBack.backgroundColor ? opt.canvasBack.backgroundColor : '#ffffff';
        this.bold = !!opt.canvasBack && !!opt.canvasBack.fontBold ? 'bold' : '';
        this.customize = !!opt.customizeBack ? opt.customizeBack : false;
        this.content = !!opt.canvasBack ? (this.lotteryType == 'image' ? opt.canvasBack.backImage : (!!opt.canvasBack.text && opt.canvasBack.text !='' ? opt.canvasBack.text : '谢谢参与')) : '';
        this.background = null;
        this.mask = null;
        this.backCtx = null;
        this.maskCtx = null;
        this.lottery = null;
        this.clientRect = null;
        this.isExistsMask = true;
        this.scratch = true; // 是否可以刮，默认true可以刮，但调用clearMask后变为false;
        this.complete = opt.complete || function() {};
        this.init( this.content , this.lotteryType);

    }
    Events.mixTo(Lottery);
    var proto = Lottery.prototype;

    proto.createElement= function(tagName, attributes) {
            var ele = document.createElement(tagName);
            for (var key in attributes) {
                ele.setAttribute(key, attributes[key]);
            }
            return ele;
        }

    proto.getTransparentPercent= function(ctx, width, height) {
            var imgData = ctx.getImageData(0, 0, width, height),
                pixles = imgData.data,
                transPixs = [];
            for (var i = 0, j = pixles.length; i < j; i += 4) {
                var a = pixles[i + 3];
                if (a < 128) {
                    transPixs.push(i);
                }
            }
            return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
        }

    proto.resizeCanvas = function(canvas, width, height) {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').clearRect(0, 0, width, height);
        }

    proto.drawPoint = function(x, y, e) {
            this.array_paint = this.array_paint || [];
            this.array_paint.push([x, y]);
            this.maskCtx.beginPath();
            this.maskCtx.lineTo(e.pageX, e.pageY);
            this.maskCtx.stroke();
            // 绘制线  
            var _this = this;
            // function paint () {  
            //     // 在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。也就是取余  
            //     _this.maskCtx.globalCompositeOperation = 'destination-out';  
            //     _this.maskCtx.globalAlpha = 1;  
            //     _this.maskCtx.strokeStyle ="#ffffff";  
            //     _this.maskCtx.lineWidth = 20;  
            //     _this.maskCtx.lineJoin = "round";   // 当两条线条交汇时，创建圆形边角  

            //     for(var i=0; i < _this.array_paint.length; i++)//循环数组  
            //     {  
            //         _this.maskCtx.beginPath();  
            //         if(_this.array_paint[i] && i){//当是拖动而且i!=0时，从上一个点开始画线。  
            //             _this.maskCtx.moveTo(_this.array_paint[i-1][0], _this.array_paint[i-1][1]);  
            //         }else{  
            //             _this.maskCtx.moveTo(_this.array_paint[i][0], _this.array_paint[i][1]);  
            //         }  
            //         _this.maskCtx.lineTo(_this.array_paint[i][0], _this.array_paint[i][1]);  
            //         _this.maskCtx.closePath();  
            //         _this.maskCtx.stroke();  
            //     }  
            // } 
            // paint()
           /* x = x*2;
            y = y *2;*/
            var radgrad = this.maskCtx.createRadialGradient(x, y, 0, x, y, this.brushSize);
            radgrad.addColorStop(0, 'rgba(0,0,0,0.8)');
            radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.maskCtx.fillStyle = radgrad;
            this.maskCtx.arc(x, y, this.brushSize, 0, Math.PI * 2, true);
            this.maskCtx.fill();
            /*修复红米第二刮奖中没有刮的效果问题*/
            if (!_this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
                if(!_this.customize){
                    _this.conNode.appendChild(this.background);
                }
                _this.conNode.appendChild(this.mask);
                this.clientRect = _this.conNode ? _this.conNode.getBoundingClientRect() : null;
            }
            
            if (this.trigger('drawPercentCallback') && this.scratch) {
                this.trigger('drawPercentCallback',this.getTransparentPercent(this.maskCtx, this.width, this.height));
            }
        }

    proto.bindEvent = function() {
            var _this = this;
            var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
            var clickEvtName = device ? 'touchstart' : 'mousedown';
            var moveEvtName = device ? 'touchmove' : 'mousemove';
            if (!device) {
                var isMouseDown = false;
                document.addEventListener('mouseup', function(e) {
                    isMouseDown = false;

                }, false);
            } else {
                document.addEventListener("touchmove", function(e) {
                    if (isMouseDown) {
                        e.preventDefault();
                    }
                }, false);
                document.addEventListener('touchend', function(e) {
                    isMouseDown = false;
                }, false);
            }
            this.mask.addEventListener(clickEvtName, function(e) {
                isMouseDown = true;
                var docEle = document.documentElement;
                if (!_this.clientRect) {
                    _this.clientRect = {
                        left: 0,
                        top: 0
                    };
                }
                var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
                var y = (device ? e.touches[0].clientY : e.clientY) - _this.conNode.getBoundingClientRect().top + docEle.scrollTop - docEle.clientTop;
                _this.drawPoint(x, y, e);
                e.preventDefault();
            }, false);

            this.mask.addEventListener(moveEvtName, function(e) {
                if (!device && !isMouseDown) {
                    return false;
                }
                var docEle = document.documentElement;
                if (!_this.clientRect) {
                    _this.clientRect = {
                        left: 0,
                        top: 0
                    };
                }
                var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
                var y = (device ? e.touches[0].clientY : e.clientY) - _this.conNode.getBoundingClientRect().top + docEle.scrollTop - docEle.clientTop;
                _this.drawPoint(x, y, e);
                e.preventDefault();
            }, false);
        }

    proto.drawLottery = function() {
            var _this = this;
            this.background = this.background || this.createElement('canvas', {
                style: 'position:absolute;left:0;top:0;'
            });
            this.mask = this.mask || this.createElement('canvas', {
                style: 'position:relative;left:0;top:0;'
            });
            if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
                if (!_this.customize) {
                    this.conNode.appendChild(this.background);
                }
                this.conNode.appendChild(this.mask);
                this.clientRect = this.conNode ? this.conNode.getBoundingClientRect() : null;
                this.bindEvent();
            }else{
            	console.error('找不到对象ID');
            }

            this.backCtx = this.backCtx || this.background.getContext('2d');
            this.maskCtx = this.maskCtx || this.mask.getContext('2d');

            this.drawMask(function() {
            	
                if (!!_this.customize) {
                    document.getElementById(_this.customize).style.display = 'block';
                   _this.trigger('complete')
                }else{
                    if (_this.lotteryType == 'image') {
                        var image = new Image();
                        
                        image.onload = function() {
                        	console.log(_this.width,_this.height)
                            _this.resizeCanvas(_this.background, _this.width, _this.height);
                            _this.backCtx.drawImage(this,  0, 0, _this.width, _this.height);
                            setTimeout(function() {
                                 _this.trigger('complete');
                            }, 0)

                        }
                        image.src = _this.lottery;
                    } else if (_this.lotteryType == 'text') {
                    	console.log(_this.width,_this.height)
                        _this.resizeCanvas(_this.background, _this.width, _this.height);
                        _this.backCtx.save();
                        _this.backCtx.fillStyle = _this.backgroundColor;
                        _this.backCtx.fillRect(0, 0, _this.width, _this.height);
                        _this.backCtx.restore();
                        _this.backCtx.save();
                        var fontSize = _this.fontSize;

                        _this.backCtx.font = _this.bold + " " + fontSize + 'px ' + _this.family;
                        _this.backCtx.textAlign = 'center';
                        _this.backCtx.fillStyle = _this.color;
                        _this.backCtx.fillText(_this.lottery, _this.width / 2, _this.height / 2.2 + fontSize / 2);
                        _this.backCtx.restore();
                        setTimeout(function() {
                              _this.trigger('complete');
                        }, 0)
                    }
                }
            });
        }

    proto.drawAgain = function(con,type){
            var _this = this;
            _this.backCtx = _this.backCtx || _this.background.getContext('2d');
            _this.maskCtx = _this.maskCtx || _this.mask.getContext('2d');
            _this.backCtx.clearRect(0, 0, _this.width, _this.height)
            if (type == 'image') {
                var img = new Image();
                img.onload = function() {
                    _this.resizeCanvas(_this.background, _this.width, _this.height);
                    _this.backCtx.drawImage(this,0,0, _this.width, _this.height);
                    setTimeout(function() {
                         _this.trigger('complete');
                    }, 0)
                }
                img.src = con;
            }else if(type == 'text'){
                _this.width = _this.width;
                _this.height = _this.height;
                _this.resizeCanvas(_this.background, _this.width, _this.height);
                _this.backCtx.save();
                _this.backCtx.fillStyle = _this.backgroundColor;
                _this.backCtx.fillRect(0, 0, _this.width, _this.height);
                _this.backCtx.restore();
                _this.backCtx.save();
                var fontSize = _this.fontSize;

                _this.backCtx.font = _this.bold + " " + fontSize + 'px ' + _this.family;
                _this.backCtx.textAlign = 'center';
                _this.backCtx.fillStyle = _this.color;
                _this.backCtx.fillText(con, _this.width / 2, _this.height / 2.2 + fontSize / 2);
                _this.backCtx.restore();
                setTimeout(function() {
                     _this.trigger('complete');
                }, 0)
            }
        }

    proto.drawMask = function(cb) {
    	console.log(this.width, this.height)
            var _this = this;
            this.resizeCanvas(this.mask, this.width, this.height);
            if (this.coverType == 'color') {
                this.maskCtx.fillStyle = this.cover;
                this.maskCtx.fillRect(0, 0, this.width, this.height);
                this.maskCtx.globalCompositeOperation = 'destination-out';
                cb && cb();
            } else if (this.coverType == 'image') {
                var image = new Image(),
                    _this = this;

                image.onload = function() {
                    cb && cb();
                    _this.maskCtx.drawImage(this, 0, 0, _this.width, _this.height);
                    _this.maskCtx.globalCompositeOperation = 'destination-out';
                }
                image.src = this.cover;
            }

        }

    proto.clearMask = function() {
            var _this = this;
            if (!!_this.isExistsMask) {
                _this.isExistsMask = false;
                _this.scratch = false;
                _this.maskCtx.clearRect(0, 0, this.width, this.height);
            }

        }
    proto.clearBack =  function() {
            var _this = this;
            if (!!_this.isExistsMask) {
                //_this.isExistsMask = false;
                //_this.scratch = false;
                _this.backCtx.clearRect(0, 0, this.width, this.height);
            }

        }

    proto.deleteMask = function() {
            var _this = this;
            _this.mask.remove();
        }

    proto.init = function(lottery, lotteryType) {
            this.lottery = lottery;
            this.lotteryType = lotteryType || 'image';
            this.drawLottery();
        }

module.exports = Lottery;
