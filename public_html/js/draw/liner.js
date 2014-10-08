if(typeof draw==="undefined"){draw={};}
if(typeof draw.liner==="undefined"){draw.liner={};}
$.extend(draw.liner,{
    $can:null,
    engine:"liner",
    init:function(){
        var can=$("<canvas>").attr({id:"main_can_liner"});
        this.$can=can;
        this.ctx=this.$can[0].getContext("2d");
        if(this.ctx){
            this.inited=true;
        }else{
            this.inited=false;
        }
    },
    isInited:function(){
        return this.inited;
    },
    draw:function(drawable){
        /*if(!this.inited){
            this.init();
        }*/
        var height=this.$can.height();
        var width=this.$can.width();
        var ctx=this.ctx;
        ctx.clearRect(0,0,width,height);
        ctx.beginPath();
        ctx.moveTo(0,height-drawable[0]*height);
        ctx.strokeStyle="black";
        ctx.fillStyle="red";
        var resol=control.settings.resol.get();
        var step=width/resol;
        for(var i=0;i<resol;i++){
            ctx.lineTo(i*step,height-drawable[i]*(height-5));
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
});