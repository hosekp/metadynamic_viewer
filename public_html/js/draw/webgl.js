/** @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
* Copyright (C) 2014  Petr Hošek
*/
if(typeof draw==="undefined"){draw={};}
if(typeof draw.gl==="undefined"){draw.gl={};}
$.extend(draw.gl,{
    g1:null,
    vertex:null,
    fragment:null,
    inited:false,
    engine:"gl",
    $can:null,
    program:null,
    init:function(){
        if(this.inited){return true;}
        if(!this.initGL()){return false;}
        this.getShader("2d-vertex","vertex");
        this.getShader("2d-fragment","fragment");
        return false;
        //if(!this.initShaders()){return false;}
        //this.initBuffers();
        //this.initParam();
        //this.initTextures();
        //var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        //gl.uniform2f(resolutionLocation, main.width, main.height);
    },
    isInited:function(){
        return this.inited;
    },
    resize:function(width,height){
        if(this.g1){
            this.g1.viewport(0, 0, width, height);
        }
    },
    initGL:function(){
        var can=$("<canvas>").attr({id:"main_can_gl"}).addClass("main_can");
        this.$can=can;
        //draw.drawer.appendCanvas();
        try {
            var params={premultipliedAlpha:false,preserveDrawingBuffer:true};
            var gl = can[0].getContext("webgl",params) 
                  || can[0].getContext("experimental-webgl",params);
            //var gl = can[0].getContext("webgl");
            //gl = getWebGLContext(main.div.canvas[0]);
        } catch(e) {this.loadFailed(e);return false;}
        if (!gl) {
            this.loadFailed("WebGL:","Could not initialize","WebGL");
            return false;}
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.g1=gl;
        //this.resize();
        return true;
    },
    initProgram:function(){
        var gl=this.g1;
        var progr = gl.createProgram();
        this.program=progr;
        gl.attachShader(progr,this.vertex);
        gl.attachShader(progr,this.fragment);
        gl.linkProgram(progr);
        if (!gl.getProgramParameter(progr, gl.LINK_STATUS)) {
            this.loadFailed("WebGL:","Could to initialize","shader program");
            return false;
        }
        this.initParam();
        gl.useProgram(progr);
        this.initBuffers();
        return true;
    },
    initParam:function(){
        var gl=this.g1;
        var progr=this.program;
        progr.positionLocation = gl.getAttribLocation(progr, "a_position");
        gl.enableVertexAttribArray(progr.positionLocation);

        progr.texCoordLocation=gl.getAttribLocation(progr,"a_texCoord");
        gl.enableVertexAttribArray(progr.texCoordLocation);
        
        progr.zmaxLoc = gl.getUniformLocation(progr, "u_zmax");
        progr.stepLoc = gl.getUniformLocation(progr, "u_step");
        progr.cmarginLoc = gl.getUniformLocation(progr, "u_cmargin");

        //program.texCoordLocation=texCoordLocation;

    },
    initBuffers:function(){
        var gl=this.g1;
        this.coordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0]), gl.STATIC_DRAW);
        this.coordarr=new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]);
        gl.bufferData(gl.ARRAY_BUFFER,this.coordarr, gl.STATIC_DRAW);
        this.texCoordBuffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.texCoordBuffer);
        //gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]), gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,1,1,1,0,0,0,0,1,1,1,0]), gl.STATIC_DRAW);
        //gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1.0,-1.0,1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,-1.0,1.0,1.0]),gl.STATIC_DRAW);
        this.initTextures();
    },
    initTextures:function(){
        var gl=this.g1;
        //var textureSizeLocation = gl.getUniformLocation(this.program, "u_textureSize");
        //gl.uniform2f(textureSizeLocation, main.width, main.height);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        manage.console.log("WebGL:","loaded");
        this.inited=true;
    },
    draw:function(array,zmax){
        //if(!this.inited){this.init();}
        var gl=this.g1;
        var nat=view.axi.natureRange(0,zmax,7,false);
        //manage.console.debug("step="+nat[2]);
        //manage.console.debug("drawing");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
        this.updateCoord(this.coordarr);
        gl.bufferData(gl.ARRAY_BUFFER,this.coordarr, gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.program.positionLocation,2,gl.FLOAT,false,0,0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(this.program.texCoordLocation,2,gl.FLOAT,false,0,0);
        gl.uniform1f(this.program.zmaxLoc,zmax*64);
        gl.uniform1f(this.program.stepLoc,nat[2]*64);
        gl.uniform1f(this.program.cmarginLoc,0.003/control.settings.zoompow());
        /*var arrBuffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,arrBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,graf.arrbuf,gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.program.arrBuffLocation,1,gl.FLOAT,false,0,0);*/
        //graf.compArr();
        //main.cons(graf.bytearr.length);
        var resol=control.settings.resol.get();
        
        if(resol*resol*4!==array.length){
            manage.console.error("WebGL:","Wrong length of texture array");
        }
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,resol,resol,0,gl.RGBA,gl.UNSIGNED_BYTE,array);
        //var err=gl.getError();if(err!==gl.NO_ERROR){manage.console.error("WebGL texture error: ",err);}
        //array=new Uint8Array([0,80,160,240]);
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA,2,2,0,gl.ALPHA,gl.UNSIGNED_BYTE,array);
        //texImage2D (ulong target, long level, ulong intformat, ulong width, ulong height, long border, ulong format, ulong type, Object data )
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        //var err=gl.getError();if(err!==gl.NO_ERROR){manage.console.error("WebGL draw error: ",err);}
    },
    updateCoord:function(arr){
        var zoom=control.settings.zoom.get();
        var posx=control.settings.frameposx.get();
        var posy=control.settings.frameposy.get();
        var zoomcoef=control.settings.zoomcoef.get();
        var zoompow=Math.pow(zoomcoef,zoom);
        var xlow=posx*zoompow;
        var xhigh=zoompow+posx*zoompow;
        var ylow=posy*zoompow;
        var yhigh=zoompow+posy*zoompow;
        arr[0]=xlow;
        var mustr=[xlow,ylow, xhigh,ylow, xlow,yhigh, xlow,yhigh, xhigh,ylow, xhigh,yhigh];
        for(var i=0;i<12;i++){
            arr[i]=mustr[i];
        }
        return arr;
        //[0,0, 1,0, 0,1, 0,1, 1,0, 1,1]
        
    },
    getShader:function(id,typ) {
        $.get("shaders/"+id+".shd",$.proxy(function(str){
            this.initShader(str,typ);
        },this),"text");
    },
    initShader:function(str,typ){
        var gl=this.g1;
        if(typ==="vertex"){
            var shader=gl.createShader(gl.VERTEX_SHADER); 
        }else if(typ==="fragment"){
            shader=gl.createShader(gl.FRAGMENT_SHADER);
        }else{return null;}
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            this.loadFailed(gl.getShaderInfoLog(shader));
            return null;
        }
        //manage.console.debug(typ+"Shader parsed and compiled");
        if(typ==="vertex"){
            this.vertex=shader;
        }else if(typ==="fragment"){
            this.fragment=shader;
        }else{return null;}
        if(this.vertex && this.fragment){
            this.initProgram();
        }
    },
    loadFailed:function(error){
        manage.console.warning(error);
        control.settings.glcan.set(false);
        draw.drawer.switchTo("raster");
    }
});
// @license-end