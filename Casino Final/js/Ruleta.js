class RuletaMegaPupu {

    constructor(){
        this.saldo = 100;
        this.ficha=0;
        this.apuestas={};
        this.girando=false;
        this.historial=[];
        this.estadisticas={};

        this.anguloR=0;
        this.velocidadR=0;
        this.anguloB=0;
        this.velocidadB=0;

        this.rojos=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

        this.numeros=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,
            8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];

        this.numeros.forEach(n=>this.estadisticas[n]=0);

        this.canvas=document.getElementById("ruleta");
        this.ctx=this.canvas.getContext("2d");
        this.r=this.canvas.width/2;

        this.crearTapete();
        this.loop();

    }

    selFicha(e,v){
        this.ficha=v;
        document.querySelectorAll(".chip").forEach(c=>c.classList.remove("selected"));
        e.target.classList.add("selected");
    }

    crearTapete(){

        const t=document.getElementById("tapete");
        t.innerHTML="";

        const filas=[
            [0,3,6,9,12,15,18,21,24,27,30,33,36],
            ["",2,5,8,11,14,17,20,23,26,29,32,35],
            ["",1,4,7,10,13,16,19,22,25,28,31,34]
        ];

        filas.forEach(f=>{

            const fila=document.createElement("div");
            fila.className="fila";

            f.forEach(val=>{

                if(val===""){
                    let esp=document.createElement("div");
                    esp.style.width="60px";
                    fila.appendChild(esp);
                    return;
                }

                let d=document.createElement("div");
                d.className="numero "+(val===0?"verde":this.rojos.includes(val)?"rojo":"negro");
                d.innerText=val;
                d.onclick=()=>this.apostar(val,d);

                fila.appendChild(d);

            });

            t.appendChild(fila);

        });

        const filaDoc=document.createElement("div");
        filaDoc.className="fila";

        ["1st 12","2nd 12","3rd 12","1-18"].forEach(txt=>{

            let d=document.createElement("div");
            d.className="apuesta";
            d.innerText=txt;
            d.onclick=()=>this.apostar(txt,d);

            filaDoc.appendChild(d);

        });

        t.appendChild(filaDoc);

        const filaExt=document.createElement("div");
        filaExt.className="fila";

        ["EVEN","ROJO","NEGRO","ODD","19-36"].forEach(txt=>{

            let d=document.createElement("div");
            d.className="apuesta";
            d.innerText=txt;
            d.onclick=()=>this.apostar(txt,d);

            filaExt.appendChild(d);

        });

        t.appendChild(filaExt);

    }

    dibujar(){

        let ang=(2*Math.PI)/this.numeros.length;

        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.r,this.r);
        this.ctx.rotate(this.anguloR);

        for(let i=0;i<this.numeros.length;i++){

            this.ctx.beginPath();
            this.ctx.moveTo(0,0);

            this.ctx.fillStyle=this.numeros[i]==0?"#0f7a3a":
                this.rojos.includes(this.numeros[i])?"#c40000":"#0d0d0d";

            this.ctx.arc(0,0,this.r,i*ang,(i+1)*ang);
            this.ctx.fill();

            this.ctx.save();
            this.ctx.rotate(i*ang+ang/2);

            this.ctx.fillStyle="white";
            this.ctx.fillText(this.numeros[i],this.r-22,4);

            this.ctx.restore();

        }

        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.r,this.r);
        this.ctx.rotate(this.anguloB);

        this.ctx.fillStyle="white";

        this.ctx.beginPath();
        this.ctx.arc(this.r-18,0,6,0,Math.PI*2);
        this.ctx.fill();

        this.ctx.restore();

    }

    loop(){

        if(this.girando){

            this.anguloR+=this.velocidadR;
            this.anguloB+=this.velocidadB;

            this.velocidadR*=0.996;
            this.velocidadB*=0.985;

            if(Math.abs(this.velocidadB)<0.002){

                this.velocidadB*= -0.3;

                if(Math.abs(this.velocidadB)<0.001){

                    this.girando=false;
                    this.calcularResultado();

                }

            }

        }

        this.dibujar();
        requestAnimationFrame(()=>this.loop());

    }

    girar(){

        if(this.girando||Object.keys(this.apuestas).length===0)return;

        this.girando=true;

        this.velocidadR=Math.random()*0.08+0.15;
        this.velocidadB=-(Math.random()*0.25+0.35);

    }

    calcularResultado(){

        let ang=(2*Math.PI)/this.numeros.length;

        let anguloFinal=(this.anguloB-this.anguloR)%(2*Math.PI);
        if(anguloFinal<0)anguloFinal+=2*Math.PI;

        let indice=Math.floor(anguloFinal/ang);
        let ganador=this.numeros[indice];

        this.estadisticas[ganador]++;
        this.actualizarStats();

        this.historial.unshift(ganador);
        if(this.historial.length>15)this.historial.pop();

        this.mostrarHistorial();

        document.getElementById("resultado").innerText="Número: "+ganador;

        this.apuestas={};
        document.querySelectorAll(".ficha").forEach(f=>f.remove());

    }

    actualizarStats(){

        let max=0,min=999;
        let mas=0,menos=0;

        for(let n in this.estadisticas){

            if(this.estadisticas[n]>max){
                max=this.estadisticas[n];
                mas=n;
            }

            if(this.estadisticas[n]<min){
                min=this.estadisticas[n];
                menos=n;
            }

        }

        document.getElementById("mas").innerText=mas+" ("+max+")";
        document.getElementById("menos").innerText=menos+" ("+min+")";

    }

    mostrarHistorial(){

        let h=document.getElementById("historial");
        h.innerHTML="";

        this.historial.forEach(n=>{

            let s=document.createElement("span");

            s.innerText=n;
            s.className=n==0?"verde":this.rojos.includes(n)?"rojo":"negro";

            h.appendChild(s);

        });

    }

    apostar(tipo,el){

        if(!this.ficha)return;

        if(!this.apuestas[tipo])this.apuestas[tipo]=0;

        this.apuestas[tipo]+=this.ficha;

        let total = this.apuestas[tipo];

        let fichaExistente = el.querySelector(".ficha");

        if(!fichaExistente){

            let f=document.createElement("div");
            f.className="ficha";

            Object.assign(f.style,{
                position:"absolute",
                top:"50%",
                left:"50%",
                transform:"translate(-50%,-50%)",
                width:"34px",
                height:"34px",
                borderRadius:"50%",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:"white",
                fontWeight:"bold",
                fontSize:"12px",
                zIndex:"10",
                border:"2px solid white",
                boxShadow:"0 0 6px black"
            });

            el.style.position="relative";
            el.appendChild(f);
            fichaExistente = f;
        }

        fichaExistente.innerText = total;

        if(total >= 500) fichaExistente.style.background="#7b1fa2";
        else if(total >= 100) fichaExistente.style.background="#2e7d32";
        else if(total >= 50) fichaExistente.style.background="#ff9800";
        else if(total >= 10) fichaExistente.style.background="#ff00b6";
        else fichaExistente.style.background="#00ffb2";

    }

}

/* INSTANCIA */
const juego = new RuletaMegaPupu();

/* PUENTE PARA NO CAMBIAR HTML */
function selFicha(e,v){ juego.selFicha(e,v); }
function girar(){ juego.girar(); }


function volverACasino(){

    let saldoCasino = Number(localStorage.getItem("saldoCasino")) || 0;

    // sumamos el saldo de la tragaperras
    saldoCasino += maquina.saldo;

    localStorage.setItem("saldoCasino", saldoCasino);

    window.location.href = "../menu/Menu.html";
}
