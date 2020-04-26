<template>
    <canvas id="canvasDemo" style="background-color: black"></canvas>
</template>

<script>
    var utils={};
    utils.colorToRGB=function (color,alpha) {
        if(typeof color==='string'&&color[0]==='#') color=window.parseInt(color.slice(1),16);
        alpha=(alpha===undefined)?1:alpha;
        var r=color>>16&0xff,
            g=color>>8&0xff,
            b=color&0xff,
            a=alpha<0?0:((alpha>1)?1:alpha);
            // a= alpha
        a=Math.round(a*100)/100
        if(a===1){
            return "rgb("+r+","+g+","+b+")";
        }else{
            return "rgba("+r+","+g+","+b+","+alpha+")";
        }
    }
    utils.parseColor=function (color,toNumber) {
        if(toNumber===true){
            if(typeof color==='number'){
                return (color|0);
            }
            if(typeof color==='string'&&color[0]==='#'){
                color=color.slice(1);
            }
            return window.parseInt(color,16);
        }else{
            if(typeof  color==='number'){
                color='#'+('0000'+(color|0).toString(16)).substr(-6);
            }
            return color;
        }
    }

    function Ball(radius,color) {
        if(radius===undefined) radius=40;
        if (color===undefined) color="#ff0000";
        this.x=0;
        this.y=0;
        this.xpos=0;
        this.ypos=0;
        this.zpos=0;
        this.vx=0;
        this.vy=0;
        this.vz=0;
        this.mass=1;
        this.radius=radius;
        this.color=utils.parseColor(color);
        this.ratation=0;
        this.scaleX=1;
        this.scaleY=1;
        this.lineWidth=1;
        this.visible=true;
    }
    Ball.prototype.draw=function (context) {
        context.save();
        context.translate(this.x,this.y);
        context.rotate(this.ratation);
        context.scale(this.scaleX,this.scaleY);
        context.lineWidth=this.lineWidth;
        context.fillStyle=this.color;
        context.beginPath();
        context.arc(0,0,this.radius,0,Math.PI*2,true);
        context.closePath();
        context.fill();
        if(this.lineWidth>0){
            context.stroke();
        }
        context.restore();
    }
    Ball.prototype.getBounds=function () {
        return {
            x:this.x-this.radius,
            y:this.y-this.radius,
            width:this.radius*2,
            height:this.radius*2
        }
    }

    let canvasGarden;
    let context;
    export default {
        name: "canvasGarden",
        mounted() {
            this.initCanvas()
        },
        methods: {
            initCanvas() {
                canvasGarden = document.getElementById('canvasDemo');
                context = canvasGarden.getContext('2d');
                canvasGarden.width = window.innerWidth
                canvasGarden.height = window.innerHeight
                this.garden()
            },
            garden(){
                let particles=[],
                    numParticles=80,
                    minDist=100,
                    spring=0.000001,
                    bounce=-1;

                for(let size,particle,i=0;i<numParticles;i++){
                    particle=new Ball(2,"#fff");
                    size=Math.random()*10+2;
                    particle.mass=size;
                    particle.x=Math.random()*canvasGarden.width;
                    particle.y=Math.random()*canvasGarden.height;
                    particle.vx=Math.random()*3-3;
                    particle.vy=Math.random()*3-3;
                    particles.push(particle);
                }

                function springFun(partA,partB) {
                    let dx=partB.x-partA.x,
                        dy=partB.y-partA.y,
                        dist=Math.sqrt(dx*dx+dy*dy);
                    if(dist<minDist){
                        //log.value=dist+','+minDist+'\n'+partB.mass;
                        let alpha=1-dist/minDist;
                        context.strokeStyle=utils.colorToRGB("#ffffff",alpha);
                        // log.value = "alpha : "+alpha+",color : "+utils.colorToRGB("#ffffff",alpha)
                        context.beginPath();
                        context.moveTo(partA.x,partA.y);
                        context.lineTo(partB.x,partB.y);
                        context.stroke();
                        let ax=dx*spring,
                            ay=dx*spring;
                        partA.vx+=ax/partA.mass;
                        partA.vy+=ay/partA.mass;
                        partB.vx-=ax/partB.mass;
                        partB.vy-=ay/partB.mass;
                    }
                }

                function move(partA,i) {
                    partA.x+=partA.vx;
                    partA.y+=partA.vy;
                    if(partA.x+partA.radius>canvasGarden.width){
                        partA.x=canvasGarden.width-partA.radius;
                        partA.vx*=bounce;
                    }else if(partA.x-partA.radius<0){
                        partA.x=partA.radius;
                        partA.vx*=bounce;
                    }
                    if(partA.y+partA.radius>canvasGarden.height){
                        partA.y=canvasGarden.height-partA.radius;
                        partA.vy*=bounce;
                    }else if(partA.y-partA.radius<0){
                        partA.y=partA.radius;
                        partA.vy*=bounce;
                    }
                    for(let partB,j=i+1;j<numParticles;j++){
                        partB=particles[j];
                        springFun(partA,partB);
                    }
                }
                function draw(particle) {
                    particle.draw(context);
                }
                (function drawFrame() {
                    window.requestAnimationFrame(drawFrame,canvasGarden);
                    context.clearRect(0,0,canvasGarden.width,canvasGarden.height);
                    particles.forEach(move);
                    particles.forEach(draw);
                }())

            }
        }
    }
</script>

<style scoped>

</style>