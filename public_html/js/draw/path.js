/** @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
* Copyright (C) 2014  Petr Hošek
*/
if(window.draw===undefined){var draw={};}
if(draw.path===undefined){draw.path={};}
$.extend(draw.path,{
    $cont:null,
    $can:null,
    context:null,
    data:[],
    width:0,
    height:0,
    needRedraw:false,
    inited:false,
    init:function(){
        var can=$('<canvas id="path_canvas" class="aux_can"></canvas>'),ctx;
        this.$cont=$("#canvas_cont").append(can);
        this.$can=can;
        ctx=can[0].getContext("2d");
        this.context=ctx;
        view.axi.subscribe(this,"resize");
        control.control.everytick(this,"draw");
        this.resize();
        this.inited=true;
    },
    setPath:function(dat){
        if(!control.settings.measure.get()){return;}
        if(!this.inited){this.init();}
        //manage.console.debug("Path:","path=",dat);
        if(this.isSame(dat)){return;}
        //manage.console.debug("Path:","draw");
        this.data=dat;
        this.needRedraw=true;
    },
    addPath:function(dato){
        if(!control.settings.measure.get()){return;}
        if(!this.inited){this.init();}
        this.data.push(dato);
        this.needRedraw=true;
    },
    isSame:function(arr){
        var i,len,dats=this.data;
        if(arr.length!==dats.length){return false;}
        len=arr.length;
        for(i=0;i<len;i+=1){
            if(arr[i][0]!==dats[i][0]||arr[i][1]!==dats[i][1]){return false;}
        }return true;
    },
    render:function(){
        var i,len,datas=this.data,ctx=this.context,dato,wid=this.width,hei=this.height;
        if(!this.needRedraw){return;}
        //ctx=this.$can[0].getContext("2d");
        ctx.clearRect(0,0,wid,hei);
        if(datas.length===0){return;}
        //manage.console.debug("Path:","path=",datas);
        ctx.lineWidth=5;
        ctx.strokeStyle="black";
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.beginPath();
        dato=datas[0];
        ctx.moveTo(dato[0]*wid,(dato[1])*hei);
        len=datas.length;
        if(len===1){
            ctx.strokeRect(dato[0]*wid-1,(dato[1])*hei-1,2,2);
        }else{
            for(i=1;i<len;i+=1){
                dato=datas[i];
                ctx.lineTo(dato[0]*wid,(dato[1])*hei);
            }
        }
        ctx.stroke();
        this.needRedraw=false;
    },
    resize:function(){
        var cont=this.$cont,can=this.$can,
        wid,hei;
        wid=cont.width();
        hei=cont.height();
        can.height(hei).width(wid).attr({width:wid,height:hei});
        this.width=wid;
        this.height=hei;
    },
    notify:function(args){
        if(args==="resize"){return this.resize();}
        if(args==="draw"){return this.render();}
        if(args==="hide"){this.data=[];this.needRedraw=true;}
    }
});
// @license-end