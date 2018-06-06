# wx-canvas-

微信小程序 canvas区间滑动选取

目标js文件引用方式 import { SelectInterval } from '层级目录/selectInterval';
目标js文件onLoad(){}里面要一下写入例如: this.selectInterval = new selectInterval({属性});



			this.selectInterval = new SelectInterval({

			canvasId:'canvas',             值必须是canvas组件的canvas-id属性的值
			
			canvasHeight:100,              值必须是当前画布的高度
			
			Xaxis:{left:30,right:345},     { left:30, 横条的左端 right:345, 横条的右端 }(right必须大于left,如果不传有默认值)
			
			scale:[10,20,30],              刻度值Array类型,取值以一个不变数为常量不断递增,数组任何两个前后值相减要恒等于这个常量,如果数组第一个值不是0,                                      会默认在数组前面添加一个0,但是0这个值不会在canvas上显示,(当数组长度是2的时候,
                                     可以设置任意大于零的数值,但第二个值必须大于第一个值);
																		 
			Yaxis:[125,5],                 刻度值Array类型,第一个值是绘制的横条的起始高度,第二个值是横条本身的高度(如果不传默认[125,5])
			manner:true,                   切换选择滑动点的上方在滑动的时候是否有跟随圆球，如果值为false那么明确显示区间滑动所得的最小值与最大值
			bothEndsNear:310,              可以设置刻度值和尺度点距离横条的开头与终点的距离,不传默认居中
			
			// decimalPoint:10,            刻度值/decimalPoint,可以使刻度值变小数,必须是10的倍数,可以不传
			
			// rightSliderStop:2,          值为一个Boolean或者在manner的值为true的时候可填number,可以不传;而number的值就是最大值与最小值的差，设置后两个滑动点是不会滑动到小于这个number的距离
			
			showTitle:{
				name:'km',                   String类型,用作设置单位
				size:15,                     标签字体大小,Number类型
				title:'#1384e0',             头部标签的字体颜色或者圆球里面的字体颜色,String类型
				positionX:100,               标签字体在canvas横向的位置,Number类型，只有manner为false或者不传的时候生效
				positionY:80,                标签字体或者圆球在canvas纵向的位置,Number类型
				isfollow:{                   跟随圆球大小与颜色的设置,manner的值为false或不传的时候,这个属性可以不给
					view:true,           manner的值为true时，view的值必须为true
					roundSize:12,        圆球大小
					roundColor:'rgba(10, 113, 238, 0.8)' 圆球的颜色
				}
			},(如果不传不会显示头部标签)
			
			scaleIn:{
				name:'km',                   String类型,用作设置单位
				size:10,                     控制刻度值字体的大小,Number类型
				valueY:108,                  刻度值在canvas纵坐标的位置,Number类型
				pointY:113                   尺度点在canvas纵坐标的位置,Number类型
			},(如果不传不会显示刻度值)
			
			colour:{
				colorBar:['#e5e5e5','#1384e0'],     横条的颜色,Array类型,第一个是横条的底色,第二个是取值范围的颜色
				roundColor:['#ffffff','#e5e5e5'],   圆圈颜色,Array类型,第一个是圆的颜色,第二个是圆的边框颜色
				scale:['#000000','#999999']         刻度数值的字体颜色
			},(如果不传会显示上面的默认参数)
			
			selectedInterval:{
				min:15,
				max:23 
			},(min不能大区等于max,如果不传只会显示在横条的两端)
			
			round:{
				radius:10,
				edgeLine:2
			},(如果不传会默认圆的半径为10,边框为2)
			
			// image:{
			// 	url:'../../assets/image/spot-a.png',   图片的本地路径值为String类型；值可以为数组，但是如果是数组时数组的长度必须是2
			// 	width:20,                              设置图片的宽度
			// 	height:24                              设置图片的高度
			// },(如果不传不会显示图片)
			
			followValue:{
 				color:'#f8835f',
 				size:10,                                 设置字体大小
 				leftY:151,                               随数值在canvas纵向的位置
 				rightY:151
 			}(如果不传不会显示跟随数值)
		});
		
 /**Page({})里面创建如下属性 必须
 
 	自定义(e){ bindtouchstart
		this.selectInterval.move(e.changedTouches[0].x,e.changedTouches[0].y);
	},
	
	自定义(e){ bindtouchmove
		this.selectInterval.meter(e.changedTouches[0].x);
	},
	
	自定义(e){ bindtouchend
		this.selectInterval.texthints((min,max)=>{
			参数min/max返回的值是最小/大价格,超过最大值max返回null
			console.log(min,max);
		},true);初始化时传入manner属性的值为true时候,这个函数的第二个参数的true就要传,不传也没什么问题，只是结果会有不同;
	},

 	<canvas canvas-id="canvas" bindtouchstart="自定义" bindtouchmove="自定义" bindtouchend="自定义"></canvas>
 	画布css样式width:100%;box-sizing: border-box;height: 自定义rpx;
 **/
