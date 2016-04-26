# seedit-lottery [![spm version](https://moekit.com/badge/seedit-lottery)](https://moekit.com/package/seedit-lottery)

---

## Install

```
$ mk install seedit-lottery --save
```

## 使用方法
		
 		// 初始化 奖品图片的实例
 		var seeditLottery = require('seedit-lottery');
		 var opt = {
		    id: 'JS_canvas_img', 
		   width:  document.getElementById("JS_canvas_img").offsetWidth,
		    height:  document.getElementById("JS_canvas_img").offsetHeight,
		    brushSize: 30,
		    cover: 'http://source.bozhong.com/activity/pointSystem/img/integral_bg_scratch_gray.png',
		    canvasBack :{
		        lotteryType:'image',
		        backImage:'http://source.bozhong.com/activity/pointSystem/img/integral_bg_scratch_win.png'
		    }
		 }


## 初始化参数定义 

* conId :<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">id</font> 刮刮乐容器的ID对象
* width :<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">number</font> 容器宽度，默认250
* height :<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">number</font> 容器高度，默认64
* coverType:<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">string</font> 封面类型， 图片或背景色，默认图片类型，可选参数 'image' or 'color'，一般默认为图片类型
* cover : <font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">string</font>根据coverType类型,放置封面图片的URL或封面背景色（#000000）
* brushSize: <font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">number</font> 橡皮擦大小，默认44
* canvasBack :<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">obj</font> 定义刮刮乐奖品层
	* lotteryType:<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">string</font> 奖品展示类型为图片或文本，可选参数 'image' or 'text'，默认为图片

		当lotteryType类型为image时
		* backImage : <font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">url</font>,backImage 需设置奖品图片URL，必选

		当lotteryType类型为text时
		* fontFamily :<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">string</font>,设置字体,默认宋体，可选
		* fontSize :<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">number</font>,可设置字体大小,默认22，可选
		* color :<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">string</font>,可设置字体颜色,默认#b65100，可选
		* backgroundColor :<font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">string</font>,可设置背景颜色,默认#ffffff，可选
		* fontBold : <font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">boolean</font>,可设置字体是否加粗,默认加粗，可选
		* text : <font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">string</font> ,设置显示的内容，默认显示'谢谢参与'，必选

* customizeBack : <font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">id</font>自定义刮刮乐奖品层，启动后，canvasBack定义将会失效


## 实例参数说明

* clearMask : <font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">function</font>,清除刮刮封面


## 事件监听说明

* drawPercentCallback : <font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">function</font>,argument 返回封面已擦除的区域(百分比)
* complete : <font style="background-color: #FEE9CC;color: #AB9577;padding: 0 6px;">function</font> 初始化完成
