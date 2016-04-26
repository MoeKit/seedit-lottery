# Demo

---

## 文本格式，奖品以文字显示

````html
	<div id="JS_canvas_text" style="width:200px;height:100px;position: relative;"></div>
````

````javascript
var seeditLottery = require('seedit-lottery');
var opt = {
	id: 'JS_canvas_text', 
    width:  document.getElementById("JS_canvas_text").offsetWidth,
    height:  document.getElementById("JS_canvas_text").offsetHeight,
    brushSize: 30,
    cover: 'http://fe.office.bzdev.net/source/csf/activity/pointSystem/img/integral_bg_scratch_gray.png',
    canvasBack :{
        lotteryType:'text',
        backgroundColor:'#7B2C2C',
        color:'#ffffff',
        fontFamily:'微软雅黑',
        fontBold:false,
        fontSize:20,
        text:'谢谢参与' 
    }
}
var canvasText = new seeditLottery(opt);

canvasText.on('drawPercentCallback',function(percent){
    if( percent > 60 ){
       canvasText.clearMask();
    }
}).on('complete',function(){
    console.log('Complete!')
    canvasText.clearMask(); // 加载完刮刮乐后直接显示奖品
})




````

## 图片格式，奖品以一张图片显示

````html
    <div id="JS_canvas_img" style="width:200px;height:100px;position: relative;"></div>
````

````javascript
var seeditLottery = require('seedit-lottery');
var opt = {
    id: 'JS_canvas_img', 
    width:  document.getElementById("JS_canvas_img").offsetWidth,
    height:  document.getElementById("JS_canvas_img").offsetHeight,
    brushSize: 30,
    cover: 'http://fe.office.bzdev.net/source/csf/activity/pointSystem/img/integral_bg_scratch_gray.png',
    canvasBack :{
        lotteryType:'image',
        backImage:'http://fe.office.bzdev.net/source/csf/activity/pointSystem/img/integral_bg_scratch_win.png'
    }
}
var canvasImg = new seeditLottery(opt);

canvasImg.on('drawPercentCallback',function(percent){
    if( percent > 60 ){
       canvasImg.clearMask();
    }
}).on('complete',function(){
    console.log('Complete!')
})



````

## 自定义格式，奖品内容前端用HTML输入显示

````html
    <style>
    .box{
        position: relative; 
        overflow: hidden;
        width: 200px;
        height: 100px;
    }
    #JS_prize{
        position: absolute;
        left:0;
        top:0;
        width:200px;
        height:100px;
        z-index: 1;
        text-align: center;
        color:#000;
        font-size:24px;
        background:url(http://fe.office.bzdev.net/source/csf/activity/pointSystem/img/integral_bg_scratch_nowin.png) left top no-repeat;
        background-size: 100%;
    }
    #JS_canvas{
        width:200px;
        height:100px;
        position: relative;
        z-index: 2;
        display: none;
    }
    </style>

    <div class="box">
        <div id="JS_prize">你个逗逼</div>
        <div id="JS_canvas"></div>
    </div>

````

````javascript
var seeditLottery = require('seedit-lottery');
var opt = {
    id: 'JS_canvas', 
    width:  document.getElementById("JS_canvas").offsetWidth,
    height:  document.getElementById("JS_canvas").offsetHeight,
    brushSize: 30,
    cover: 'http://fe.office.bzdev.net/source/csf/activity/pointSystem/img/integral_bg_scratch_gray.png',
    customizeBack:'JS_prize'
}
var canvas = new seeditLottery(opt);

canvas.on('drawPercentCallback',function(percent){
    if( percent > 60 ){
       canvas.clearMask();
    }
}).on('complete',function(){
    console.log('Complete!')
})
````
