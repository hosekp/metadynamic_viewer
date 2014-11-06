if(typeof manage==="undefined"){manage={};}
if(typeof manage.console==="undefined"){manage.console={};}
$.extend(manage.console,{
    $console:null,
    constext:[],
    //loglevel:2,
    /* 0= nic
     * 1= pouze errory
     * 2= i warningy
     * 2.5 = i successy
     * 3= i logy
     * 4= i debug
     */
    init:function(){
        this.$console=$("#cons").show();
    },
    addText:function(string,loglvl){
        if(control.settings.loglvl.get()<loglvl){return;}
        if(this.$console===null){this.init();}
        var txt=this.constext;
        var colors={1:"red",2:"orange",3:"black",4:"blue",2.5:"green"};
        txt.push("<span style='color:"+colors[loglvl]+"'>"+string+"</span>");
        if(txt.length>20){
            txt.shift();
        }
        var str="";
        for(var i=0;i<txt.length;i++){
            str=txt[i]+"<br>"+str;
        }
        this.$console.html(str);
    },
    debug:function(){this.addText(Lang.apply(null,arguments),4);},
    log:function(){this.addText(Lang.apply(null,arguments),3);},
    warning:function(){this.addText(Lang.apply(null,arguments),2);},
    error:function(){this.addText(Lang.apply(null,arguments),1);},
    success:function(){this.addText(Lang.apply(null,arguments),2.5);}
});

