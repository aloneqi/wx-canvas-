import { SelectInterval } from './selectInterval';

Page({
	data:{

	},
	js_touchstart(e){
		this.selectInterval.move(e.changedTouches[0].x,e.changedTouches[0].y);
	},
	js_touchmove(e){
		this.selectInterval.meter(e.changedTouches[0].x);
	},
	js_touchend(e){
		this.selectInterval.texthints((min,max)=>{
			console.log(min,max);
		});
	},
	onLoad() {
		this.selectInterval = new SelectInterval({
			canvasId:'canvas',
			canvasHeight:100,
			Xaxis:{left:30,right:345},
			scale:[10,20,30],
			Yaxis:[125,5],
			bothEndsNear:310,
			// decimalPoint:10,
			// rightSliderStop:true,
			showTitle:{
				name:'km',
				size:15,
				positionX:100,
				positionY:80
			},
			scaleIn:{
				name:'km',
				size:10,
				valueY:108,
				pointY:113
			},
			colour:{
				title:'#1384e0',
				colorBar:['#e5e5e5','#1384e0'],
				roundColor:['#ffffff','#e5e5e5'],
				scale:['#000000','#999999']
			},
			selectedInterval:{
				min:15,
				max:23
			},
			round:{
				radius:10,
				edgeLine:2
			},
			// image:{
			// 	url:'../../assets/image/spot-a.png',
			// 	width:20,
			// 	height:24
			// },
			followValue:{
 				color:'#f8835f',
 				size:10,
 				leftY:151,
 				rightY:151
 			}
		});
	}
})
		