function SelectInterval(object){
	object.res = wx.getSystemInfoSync().screenWidth/375;
	object.resY = object.res ==1 ?object.res:wx.getSystemInfoSync().screenHeight/667;
	this.init(object);
};
SelectInterval.prototype={
		init:function(object){
			this.ctx=wx.createCanvasContext(object.canvasId);
			this.ctxSize={width:375*object.res,height:object.canvasHeight*object.resY};
			this.x1=object.Xaxis?(object.Xaxis.left || 50)*object.res : 50*object.res;
			this.saveX1=this.x1;
			this.x2=object.Xaxis?(object.Xaxis.right || 325)*object.res : 325*object.res;
			this.saveX2=this.x2;
			this.width=this.saveX2 - this.saveX1;
			this.saveWidth=this.width;
			this.select_area=undefined;
			this.height=[object.Yaxis[0]*object.resY,object.Yaxis[1]*object.resY] || [125*object.resY,5*object.resY];
			this.range={min:0,max:0};
			this.scale=object.scale.length === 1?[0,object.scale[0],object.scale[0]*2]:object.scale;
			this.decimalPoint=object.decimalPoint || 1;
			object.bothEndsNear || (object.bothEndsNear = '0');
			this.bothEndsNear=this.saveX1-(object.bothEndsNear*object.res || 0)/2;
			this.paragraph=[
				this.scale[1]-this.scale[0],
				(this.scale[0]==0 || object.bothEndsNear)?this.scale[this.scale.length-1]:this.scale[this.scale.length-1]+this.scale[0],
				object.bothEndsNear>0?this.scale[0]:this.scale[0]-this.scale[0]
			];
			this.spacing=(this.saveWidth+(object.bothEndsNear*object.res || 0))/(this.scale.length+1);
			this.distance1=this.bothEndsNear+this.spacing;
			this.distance2=(this.bothEndsNear+this.spacing*this.scale.length-this.distance1)/(this.scale.length-1);
			this.colour={colorBar:object.colour.colorBar || ['#e5e5e5','#1384e0'],roundColor:object.colour.roundColor || ['#ffffff','#e5e5e5'],scale:object.colour.scale || ['#1384e0','#1384e0']};
			if(typeof object.rightSliderStop === "boolean" && object.rightSliderStop){
				this.scalevalue = this.bothEndsNear+this.spacing*(this.scale[0]==0 ? 2 : this.scale[0] == this.paragraph[0] ? 1:2);
			}else if(typeof object.rightSliderStop === "number"){
				this.scalevalue = object.rightSliderStop
			}
			object.followValue && (this.followValue = Object.assign(object.followValue,{size:object.followValue.size*object.res,leftY:object.followValue.leftY*object.resY,rightY:object.followValue.rightY*object.resY}));
			object.showTitle && (this.showTitle = {name:object.showTitle.name || '' ,size:object.showTitle.size*object.res,title:object.showTitle.title || '#000000',positionX:object.showTitle.positionX*object.res,positionY:object.showTitle.positionY*object.resY,isfollow:object.showTitle.isfollow || {view:false}});
			object.scaleIn && (this.scaleIn = Object.assign(object.scaleIn,{name:object.scaleIn.name || '',valueY:object.scaleIn.valueY*object.resY,pointY:object.scaleIn.pointY*object.resY}));
			if(object.image){
				this.image = Object.assign(object.image,{
					isString:typeof object.image.url === "string",
					width:object.image.width*object.res,
					height:object.image.height*object.resY,
					leftY:object.image.leftY*object.resY,
					rightY:object.image.rightY*object.resY,
					imgHalf:(object.image.width*object.res)/2
				});
				object.manner && (this.realRd=this.image.width);
			}else{
				this.y=this.height[0]+(this.height[1]/2);
				this.round = {
					radius:object.round?object.round.radius*object.res:10*object.res,
					edgeLine:object.round?object.round.edgeLine*object.res:2*object.res
				};
				this.rd=(this.round.radius+this.round.edgeLine)*3/2;
				this.realRd=5*(this.round.radius+this.round.edgeLine)/3;
			}
			this.meter = object.manner ? meterDiffer : meter;
			object.selectedInterval && this.interval(object.selectedInterval.min,object.selectedInterval.max,object.manner);
			!object.selectedInterval && this.draw(object.manner);
 		},
 		move:function(dynamicX,dynamicY){
			if (this.select_area !== undefined ) return
 			if(this.image){
 				if(this.x1-this.image.imgHalf < dynamicX && dynamicX < this.x1+this.image.imgHalf && this.image.leftY < dynamicY && dynamicY < this.image.leftY+this.image.height){
 		     		this.select_area=true;
 		     	}else if(this.x2-this.image.imgHalf < dynamicX && dynamicX < this.x2+this.image.imgHalf && this.image.rightY < dynamicY && dynamicY < this.image.rightY+this.image.height){
 		     		this.select_area=false;
	 		    }else{
					this.select_area = undefined;
				}
 			}else{
 				if(this.x1-this.rd < dynamicX && dynamicX < this.x1+this.rd && this.y-this.rd < dynamicY && dynamicY < this.y+this.rd){
 		     		this.select_area=true;
 		     	}else if(this.x2-this.rd < dynamicX && dynamicX < this.x2+this.rd && this.y-this.rd < dynamicY && dynamicY < this.y+this.rd){
 		     		this.select_area=false;
	 		    }else{
					this.select_area = undefined;
				}
 			}
 		},
 		originalImage:function(){
 			if(!this.image){
 				this.ctx.arc(this.x1, this.y, this.round.radius, 0, 2* Math.PI)
				this.ctx.setLineWidth(this.round.edgeLine);
				this.ctx.setStrokeStyle(this.colour.roundColor[1]);
				this.ctx.setFillStyle(this.colour.roundColor[0]);
				this.ctx.stroke()
				this.ctx.fill();
				this.ctx.beginPath();
				this.ctx.arc(this.x2, this.y, this.round.radius, 0, 2* Math.PI);
				this.ctx.setLineWidth(this.round.edgeLine);
				this.ctx.setStrokeStyle(this.colour.roundColor[1]);
				this.ctx.setFillStyle(this.colour.roundColor[0]);
				this.ctx.stroke();
				this.ctx.fill();
 			}else{
				this.ctx.drawImage(this.image.isString?this.image.url:this.image.url[0], ~~(this.x1-this.image.imgHalf), this.image.leftY, this.image.width, this.image.height);
 				this.ctx.drawImage(this.image.isString?this.image.url:this.image.url[1], ~~(this.x2-this.image.imgHalf), this.image.rightY, this.image.width, this.image.height);	
 			}
			
 		},
 		interval:function(value1,value2){
 			var actualLength=(this.bothEndsNear+this.spacing*this.scale.length)-this.distance1;
 			this.x1=Math.round(actualLength/(this.paragraph[1]-this.scale[0])*(value1-this.scale[0]))+this.distance1;
 			this.x2=Math.round(actualLength/(this.paragraph[1]-this.scale[0])*(value2-this.scale[0]))+this.distance1;
			this.width=this.x2-this.x1;
			this.draw(arguments[2]);
 		},
 		texthints:function(transfer){
 			this.range.min=(Math.round(((this.x1 - this.distance1)/this.distance2)*this.paragraph[0])+this.scale[0])/this.decimalPoint;
			this.range.max=(Math.round(((this.x2 - this.distance1)/this.distance2)*this.paragraph[0])+this.scale[0])/this.decimalPoint;
		},
 		fontTitle:function(){
			if(this.showTitle.isfollow.view){
				this.ctx.beginPath();
				this.ctx.arc(this.select_area?this.x1:this.x2, this.showTitle.positionY, this.showTitle.isfollow.roundSize, 0, 2* Math.PI);
				this.ctx.setFillStyle(this.showTitle.isfollow.roundColor);
				this.ctx.fill();
				this.ctx.setFillStyle(this.showTitle.title);
				this.ctx.fillText(`${this.select_area?this.range.min:this.range.max>this.paragraph[1]?this.paragraph[1]+'+':this.range.max}`, this.select_area?this.x1:this.x2  , this.showTitle.positionY+this.showTitle.isfollow.roundSize/4);
			}else{
				this.ctx.setFontSize(this.showTitle.size);
				this.ctx.setFillStyle(this.showTitle.title);
				var decimal=this.paragraph[1]/this.decimalPoint;
				if(this.range.min <= this.paragraph[2] ){
				   	this.ctx.fillText(this.range.max>=decimal?'全部':`${this.range.min<0?0:this.range.min}${this.showTitle.name}-${this.range.max}${this.showTitle.name}`, this.showTitle.positionX  , this.showTitle.positionY);
			   	}else{
				   	this.ctx.fillText(this.range.min+this.range.max >= decimal?`${this.showTitle.name}以上`:`${this.showTitle.name}-${this.range.max}${this.showTitle.name}`, this.showTitle.positionX  , this.showTitle.positionY);
			   	}
			}
 		},
 		fontFollow:function(){
 			this.ctx.setFillStyle(this.followValue.color);
 			this.ctx.setFontSize(this.followValue.size);
 			var decimal=this.paragraph[1]/this.decimalPoint;
 			this.ctx.fillText(`${this.range.min<=0?0:this.range.min}${this.scaleIn.name}`, this.x1, this.followValue.leftY);
 			this.ctx.fillText(`${this.range.max>decimal?decimal+this.scaleIn.name+'+':this.range.max+this.scaleIn.name}`, this.x2, this.followValue.rightY);
		},
		transfer:function(fn){ 
			if(this.select_area === undefined) return;
			this.select_area = undefined;
			console.log(this.range.max)
			fn(this.range.min < 0?0:this.range.min,this.range.max > this.paragraph[1]?null:this.range.max);
			this.draw(arguments[1]);
		},
 		draw:function(){
			this.ctx.clearRect(0, 0, this.ctxSize.width, this.ctxSize.height);
 			if(this.scaleIn){
				this.ctx.setFontSize(this.scaleIn.size);
				this.ctx.setTextAlign('center');
				for(var i=0,len=this.scale.length; i < len ;i++){
					this.ctx.setFillStyle(this.colour.scale[0]);
					this.ctx.fillText(`${this.scale[i]/this.decimalPoint}${this.scaleIn.name || ''}`, this.bothEndsNear+this.spacing*(i+1), this.scaleIn.valueY);
					this.scaleIn.pointY && this.ctx.setFillStyle(this.colour.scale[1]);
					this.scaleIn.pointY && this.ctx.fillRect(this.bothEndsNear+this.spacing*(i+1), this.scaleIn.pointY, 1, 4);
				}
 			}
			this.texthints();
 			this.ctx.setFillStyle(this.colour.colorBar[0]);
			this.ctx.fillRect(this.saveX1, this.height[0], this.saveWidth, this.height[1]);

			this.ctx.setFillStyle(this.colour.colorBar[1]);
			this.ctx.fillRect(this.x1, this.height[0], this.width, this.height[1]);

			this.originalImage();
			
			this.followValue && this.fontFollow();
			this.showTitle && !arguments[0] && this.fontTitle();
			 
			this.ctx.draw();

 		}
};

function meter(dynamicX){
	if(this.select_area==undefined)return;
	if(this.select_area){
		if(this.x2 - dynamicX >= this.realRd){
			this.x1 = dynamicX < this.saveX1 ?this.saveX1:dynamicX;
			this.width = this.x2 - this.x1;
		}
	}else{
		if(this.x1 <= this.distance1 && dynamicX <= this.scalevalue){
				this.x2 = this.scalevalue;
				this.width = this.x2-this.x1;
				return;
		}
		if(dynamicX - this.x1 >= this.realRd){
			this.x2 = dynamicX > this.saveX2 ?this.saveX2:dynamicX;
			this.width = this.x2-this.x1;
		}
	}
	this.draw();
}

function meterDiffer(dynamicX){
   if(this.select_area==undefined)return;
   if(this.select_area){
		if( dynamicX < (this.x2 - (this.spacing/this.paragraph[0])*this.scalevalue)){
			this.x1 = dynamicX < this.saveX1 ? this.saveX1:dynamicX;
		}
	}else{
		if( dynamicX > (this.x1 + (this.spacing/this.paragraph[0])*this.scalevalue)){
			this.x2 = dynamicX > this.saveX2 ?this.saveX2:dynamicX;
		}
	}
	this.width = this.x2 - this.x1;
	this.draw();
}

module.exports.SelectInterval=SelectInterval;
