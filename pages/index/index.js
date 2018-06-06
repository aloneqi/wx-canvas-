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
		this.selectInterval.transfer((min,max)=>{
			console.log(min,max);
		},true);
	},
	onLoad() {
		this.selectInterval = new SelectInterval({
			canvasId:'canvas',
			canvasHeight:100,
			Xaxis:{left:30,right:345},
			scale:[10,20,30,40,50],
			Yaxis:[125,5],
			manner:true,
			// bothEndsNear:0,
			// decimalPoint:10,
			rightSliderStop:2,
			showTitle:{
				size:15,
				title:'#ffffff',
				// positionX:100,
				positionY:70,
				isfollow:{
					view:true,
					roundSize:12,
					roundColor:'rgba(10, 113, 238, 0.8)'
				}
			},
			scaleIn:{
				name:'km',
				size:10,
				valueY:108,
				pointY:113
			},
			colour:{
				colorBar:['#e5e5e5','#0a71ee'],
				roundColor:['#ffffff','#e5e5e5'],
				scale:['#000000','#999999']
			},
			selectedInterval:{
				min:15,
				max:30
			},
			// round:{
			// 	radius:10,
			// 	edgeLine:2
			// },
			image:{
				url:['../../assets/image/water.png','../../assets/image/water-1.png'],
				width:27,
				height:31,
				leftY:132,
 				rightY:96,
			},
			followValue:{
 				color:'#ffffff',
 				size:8,
 				leftY:151,
 				rightY:112
 			}
		});
	}
})
		