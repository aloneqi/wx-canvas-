function SelectInterval(object){
	object.res = wx.getSystemInfoSync().windowWidth/375;
	this.init(object);
};
SelectInterval.prototype={
		init:function(object){
			this.ctx=wx.createCanvasContext(object.canvasId);
			this.ctxSize={width:375*object.res,height:object.canvasHeight};
			this.x1=object.Xaxis?(object.Xaxis.left || 50)*object.res : 50*object.res;
			this.saveX1=this.x1;
			this.x2=object.Xaxis?(object.Xaxis.right || 325)*object.res : 325*object.res;
			this.saveX2=this.x2;
			this.width=this.saveX2 - this.saveX1;
			this.saveWidth=this.width;
			this.select_area=0;
			this.height=object.Yaxis || [125,5];
			this.range={min:0,max:0};
			this.scale=object.scale;
			this.decimalPoint=object.decimalPoint || 1;
			this.bothEndsNear=this.saveX1-(object.bothEndsNear*object.res || 0)/2;
			this.paragraph=[
				this.scale[1]-this.scale[0],
				this.scale[0]==0 || object.bothEndsNear?this.scale[this.scale.length-1]:this.scale[this.scale.length-1]+this.scale[0],
				object.bothEndsNear?this.scale[0]:this.scale[0]-this.scale[0]
			];
			this.spacing=(this.saveWidth+(object.bothEndsNear*object.res || 0))/(this.scale.length+1);
			this.distance1=this.bothEndsNear+this.spacing;
			this.distance2=(this.bothEndsNear+this.spacing*this.scale.length-this.distance1)/(this.scale.length-1);
			this.colour={title:object.colour.title,colorBar:object.colour.colorBar || ['#e5e5e5','#1384e0'],roundColor:object.colour.roundColor || ['#ffffff','#e5e5e5'],scale:object.colour.scale || ['#1384e0','#1384e0']};
			object.rightSliderStop && (this.scalevalue=this.bothEndsNear+this.spacing*(this.scale[0]==0?2:this.scale[0]-0==this.paragraph[0]?1:2));
			object.followValue && (this.followValue=object.followValue,this.followValue.size=object.followValue.size*object.res);
			object.showTitle && (this.showTitle={name:object.showTitle.name || '' ,size:object.showTitle.size*object.res,positionX:object.showTitle.positionX*object.res,positionY:object.showTitle.positionY});
			object.scaleIn && (this.scaleIn=object.scaleIn);this.scaleIn.name=this.scaleIn.name || '';
			if(object.image){
				this.image=object.image;
				this.half=this.image.width/2;
				this.y=this.height[0]+this.height[1]+5;
				this.imgWidth=this.image.width/2;
				this.imgHeight=this.image.height;
				this.realRd=this.image.width;
			}else{
				this.y=this.height[0]+(this.height[1]/2);
				this.round = {
					radius:object.round?object.round.radius*object.res:10*object.res,
					edgeLine:object.round?object.round.edgeLine*object.res:2*object.res
				};
				this.rd=(this.round.radius+this.round.edgeLine)*3/2;
				this.realRd=5*(this.round.radius+this.round.edgeLine)/3;
			}

			object.selectedInterval && this.interval(object.selectedInterval.min,object.selectedInterval.max);
			!object.selectedInterval && this.draw();
 		},
 		move:function(dynamicX,dynamicY){
 			if(this.image){
 				if(this.x1-this.imgWidth < dynamicX && dynamicX < this.x1+this.imgWidth && this.y < dynamicY && dynamicY < this.y+this.imgHeight){
 		     		this.select_area=true;
 		     	}else if(this.x2-this.imgWidth < dynamicX && dynamicX < this.x2+this.imgWidth && this.y < dynamicY && dynamicY < this.y+this.imgHeight){
 		     		this.select_area=false;
	 		    }else{
	 		     	this.select_area=undefined;
	 		    }
 			}else{
 				if(this.x1-this.rd < dynamicX && dynamicX < this.x1+this.rd && this.y-this.rd < dynamicY && dynamicY < this.y+this.rd){
 		     		this.select_area=true;
 		     	}else if(this.x2-this.rd < dynamicX && dynamicX < this.x2+this.rd && this.y-this.rd < dynamicY && dynamicY < this.y+this.rd){
 		     		this.select_area=false;
	 		    }else{
	 		     	this.select_area=undefined;
	 		    }
 			}
 		     
 		},
 		meter:function(dynamicX){
 			if(this.select_area==undefined)return;
 			if(this.select_area){
 				if(this.x2 - dynamicX >= this.realRd){
 					dynamicX < this.saveX1 ? this.x1 = this.saveX1:this.x1 = dynamicX;
 					this.width = this.x2 - this.x1;
 				}
 			}else{
 				if(this.x1 <= this.distance1 && dynamicX <= this.scalevalue){
 						this.x2 = this.scalevalue;
 						this.width = this.x2-this.x1;
 						return;
 				}
 				if(dynamicX - this.x1 >= this.realRd){
 					dynamicX > this.saveX2 ? this.x2 = this.saveX2:this.x2 = dynamicX;
 					this.width = this.x2-this.x1;
 				}
 			}
 			this.draw();
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
 				this.ctx.drawImage(this.image.url, ~~(this.x1-this.half), this.y, this.image.width, this.image.height);
 				this.ctx.drawImage(this.image.url, ~~(this.x2-this.half), this.y, this.image.width, this.image.height);
 			}

 			this.followValue && this.fontFollow();
 			this.showTitle && this.fontTitle();
			
 		},
 		interval:function(value1,value2){
 			var actualLength=(this.bothEndsNear+this.spacing*this.scale.length)-this.distance1;
 			this.x1=Math.round(actualLength/(this.paragraph[1]-this.scale[0])*(value1-this.scale[0]))+this.distance1;
 			this.x2=Math.round(actualLength/(this.paragraph[1]-this.scale[0])*(value2-this.scale[0]))+this.distance1;
			this.width=this.x2-this.x1;
			this.draw();
 		},
 		texthints:function(transfer){
 			if(this.select_area==undefined)return;
 			this.range.min=this.range.max=this.scale[0];
 			this.range.min=(Math.round(((this.x1 - this.distance1)/this.distance2)*this.paragraph[0])+this.range.min)/this.decimalPoint;
			this.range.max=(Math.round(((this.x2 - this.distance1)/this.distance2)*this.paragraph[0])+this.range.max)/this.decimalPoint;
 			transfer && transfer(this.range.min < 0?0:this.range.min,this.range.max > this.paragraph[1]?null:this.range.max);
 		},
 		fontTitle:function(){
 			this.ctx.setFontSize(this.showTitle.size);
 			this.ctx.setFillStyle(this.colour.title);
 			var decimal=this.paragraph[1]/this.decimalPoint;
 			if(this.range.min <= this.paragraph[2] ){
				this.range.max>=decimal?this.range.min='全部':this.range.min=`${this.range.min<0?0:this.range.min}${this.showTitle.name}-${this.range.max}${this.showTitle.name}`;
				this.ctx.fillText(`${this.range.min}`, this.showTitle.positionX  , this.showTitle.positionY);
			}else{
				this.range.max >= decimal?this.range.max=`${this.showTitle.name}以上`:this.range.max=`${this.showTitle.name}-${this.range.max}${this.showTitle.name}`;
				this.ctx.fillText(`${this.range.min+this.range.max}`, this.showTitle.positionX  , this.showTitle.positionY);
			}
 		},
 		fontFollow:function(){
 			this.ctx.setFillStyle(this.followValue.color);
 			this.ctx.setFontSize(this.followValue.size);
 			var decimal=this.paragraph[1]/this.decimalPoint;
 			this.ctx.fillText(`${this.range.min<=0?0:this.range.min}${this.scaleIn.name}`, this.x1, this.followValue.leftY);
 			this.ctx.fillText(`${this.range.max>decimal?decimal+this.scaleIn.name+'+':this.range.max+this.scaleIn.name}`, this.x2, this.followValue.rightY);
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

			this.ctx.draw();

 		}
};

module.exports.SelectInterval=SelectInterval;