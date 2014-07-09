if(typeof manage==="undefined"){manage={};}
if(typeof manage.console==="undefined"){manage.console={};}
$.extend(manage.console,{
    $console:null,
    constext:[],
    loglevel:2,
    /* 0= nic
     * 1= pouze errory
     * 2= i warningy
     * 3= i logy
     * 4= i debug
     */
    init:function(){
        this.$console=$("#cons");
    },
    addText:function(string){
        if(this.$console===null){this.init();}
        var txt=this.constext;
        txt.push(string);
        if(txt.length>20){
            txt.shift();
        }
        var str="";
        for(var i=0;i<txt.length;i++){
            str=txt[i]+"<br>"+str;
        }
        this.$console.html(str);
    },
    debug:function(string){if(this.loglevel>=4)this.addText(string);},
    log:function(string){if(this.loglevel>=3)this.addText(string);},
    warning:function(string){if(this.loglevel>=2)this.addText(string);},
    error:function(string){if(this.loglevel>=1)this.addText(string);}
});
