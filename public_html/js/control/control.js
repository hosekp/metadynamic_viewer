if(typeof control==="undefined"){control={};}
if(typeof control.control==="undefined"){control.control={};}
$.extend(control.control,{
    ratio:0,
    stats:null,
    needRedraw:true,
    running:false,
    lasttime:0,
    init:function(){
        var stt=new Stats();
        stt.setMode(0);
        $("#all").append(stt.domElement);
        this.stats=stt;
        this.cycle(this.lasttime);
    },
    start:function(){
        if(this.ratio===1){this.reset();}
        this.running=true;
        this.lasttime=window.performance.now();
    },
    cycle:function(stamp){
        var cont=control.control;
        if(cont.running){
            var dt = stamp - cont.lasttime;
            var nratio=cont.ratio+dt*control.settings.speed.get()/10000;
            if(nratio>1){
                if(control.settings.loop.get()){
                    nratio=cont.reset();
                    compute.axi.firstloop=false;
                }else{
                    control.settings.play.set(false);
                    cont.set(1);
                }
            }else{
                cont.set(nratio);
            }
        }
        cont.stats.begin();
        control.settings.newHash();
        view.ctrl.redraw();
        view.ctrl.resize();
        view.axi.drawAxes();
        cont.draw();
        cont.stats.end();
        //var now = window.performance.now();
        //var newtime=this.time+dt*control.settings.speed.get()/1000;
        //graf.draw(this.set(newtime));
        cont.lasttime = stamp;
        requestAnimationFrame(cont.cycle);
    },
    /*cycle:function(stamp){
        if(this.running){
            var dt = stamp - this.lasttime;
            var nratio=this.ratio+dt*control.settings.speed.get()/10000;
            if(nratio>1){
                if(control.settings.loop.get()){
                    nratio=this.reset();
                    compute.axi.firstloop=false;
                }else{
                    control.settings.play.set(false);
                    this.set(1);
                }
            }else{
                this.set(nratio);
            }
        }
        this.stats.begin();
        control.settings.newHash();
        view.ctrl.redraw();
        view.ctrl.resize();
        view.axi.drawAxes();
        this.draw();
        this.stats.end();
        //var now = window.performance.now();
        //var newtime=this.time+dt*control.settings.speed.get()/1000;
        //graf.draw(this.set(newtime));
        this.lasttime = stamp;
        requestAnimationFrame($.proxy(this.cycle,this));
    },*/
    draw:function(){
        if(this.needRedraw){
            this.needRedraw=!manage.manager.draw(this.ratio);
        }
        //manage.console.debug("drawing "+this.ratio);
    },
    stop:function(){
        this.running=false;
    },
    reset:function(){
        this.set(0);
        //manage.console.debug("reseted");
        return 0;
    },
    set:function(rat){
        if(this.ratio===rat){return;}
        this.ratio=rat;
        view.ctrl.slide.byratio(rat);
        this.needRedraw=true;
    }
});