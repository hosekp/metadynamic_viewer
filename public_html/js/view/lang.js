if(typeof view==="undefined"){view={};}
if(typeof view.lang==="undefined"){view.lang={};}
$.extend(view.lang,{
    cze:{
        "Nothing to draw":"Nic k vykreslení",
        "opened":"otevřeno",
        "Close":"Zavřít",
        "To get the picture, just press right mouse button over it and select Save image as..":"Klikněte pravým tlačítkem myši na obrázek a dejte Uložit jako ..",
        "Choose files":"Vyber soubory",
        "Examples":"Příklady",
        "Drop yours HILLS files here":"Upusť zde soubory",
        "Counter":"Počítadlo:",
        "Play":"Přehrát","Stop":"Zastavit","Measure":"Měřidlo","Loop":"Smyčka","Resize":"Změnit velikost","Resolution":"Rozlišení","Picture":"Obrázek","Slider":"Jezdec","Speed":"Rychlost",
        "Bias":"Potenciál","Difference":"Rozdíl",
        "Closest hills":"Nejbližší kopce",
        "Click at point you want to find closest hills to":"Klikni na bod, ke kterému chceš najít nejbližší kopce",
        "ncv not set":"ncv nenastaveno",
        Increase:"Zvýšit",Decrease:"Snížit","Change axis":"Změnit osy","Automatic Z axi":"Automatická Z osa","Change energy units":"Změn jednotky",
        "not supported":"nepodporován","not implemented":"neimplementováno",
        "Could not initialise":"Nepodařil se inicializovat",
        //"the shader program":"",
        "loaded":"nahráno",
        "Wrong length of texture array":"Špatná délka pole pro texturu",
        "Released":"Uvolněn",
        "3 and more CVs":"tři a více CV",
        "lines successfully parsed":"řádků úspěšně nahráno",
        "Unknown parameter:":"Neznámý parametr:",
        "Empty file":"Prázdný soubor",
        "Cannot rearrange array, wrong length":"Nelze setřídit pole, špatná délka",
        "Wrong middle point":"Špatný středový bod",
        "Data sorted,":"Data seřazena,",
        "reorderings":"přemístění",
        "Wrong number of CV":"Špatný počet CV",
        "Variable sigma is not supported":"Proměnná velikost sigmy není podporována",
        "resize conducted":"Provedena změna velikosti",
    }
});
Lang=function(){
    var lan=control.settings.lang.get();
    if(lan==="eng"){
        //if(!args.pop){
        //}
        var args=Array.prototype.slice.call(arguments);
        return args.join(" ");
    }
    var args=arguments;
    var dict=view.lang[lan];
    var ret=[];var nel;
    for(var i=0;i<args.length;i++){
        nel=dict[args[i]];
        if(typeof nel==="undefined"){
            nel=args[i];
        }
        ret.push(nel);
    }
    return ret.join(" ");
};