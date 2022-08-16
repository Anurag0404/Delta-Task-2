const canvas=document.querySelector("canvas")
const board=document.querySelector("div");
const c=canvas.getContext("2d")
var time=0;
var gameOver=false;



canvas.width=window.innerWidth * 0.3
canvas.height=window.innerHeight 


const keys = {
    right:{
        pressed:false
    },
    left : {
        pressed:false
    }
}
let gravity=0.3;

class Player{
    constructor(life=3){
        this.position={
            x:100,
            y:100
        }
        this.velocity = {
            x:0,
            y:1
        }
        this.radius=10;
        this.life=life;
        console.log(this.life)
    }
    draw(){
        c.fillStyle = 'red'
        c.fill()
        c.beginPath();
        c.arc(this.position.x,this.position.y,this.radius, 0, 2 * Math.PI);
        c.stroke();   
    }
    update(up){
        if(up){
            this.position.y-=1;
            this.velocity.y = 0
            this.draw()
        }
        else{
        if(this.position.x+this.radius+this.velocity.x > canvas.width){
            this.velocity.x=0
        }
        
        if(this.position.x - this.radius + this.velocity.x <= 0 ){
            this.velocity.x=0
        }
        this.draw()
         this.position.x+=this.velocity.x
         this.position.y+=this.velocity.y
        
        if(this.position.y+this.radius+this.velocity.y <=canvas.height + 10){
            this.velocity.y+=gravity
        }
        else this.velocity.y=0
      
        if( this.position.y==0){
            this.velocity.y=0
            this.velocity.x=0
        }
    }
       
    }
}
    class Platform{
       constructor( x=200,y=100,evil=false, width = 150 ,height = 20) {
        this.position = {
            x,
            y
        }
        this.evil = evil;
        this.width = width;
        this.height = height;
       }
       draws() {
           if(this.evil){
            c.fillStyle = 'darkred'
            c.fillRect(this.position.x,this.
                position.y,this.width,this.height)
           }else{
                c.fillStyle = 'blue'
                c.fillRect(this.position.x,this.
                    position.y,this.width,this.height)
           }
       }
    }   
let player=new Player()
board.innerHTML=`life = ${player.life}`;
const platforms  = [new Platform(0,0,true,canvas.width,20),new Platform(50,200),new Platform(78,370),new Platform(230,500), new Platform(125,600),new Platform(0,canvas.height-20,true,canvas.width,20)]


function animate(){
    if(Math.floor(Math.random()*225)+1==4){
        let platformPos1=Math.random()*250;
        let dangerNum=(Math.floor(Math.random()*5));
        if(dangerNum+1==4) evil=true;
        else evil=false;
        platforms.push(new Platform(platformPos1,700,evil))}
    let id = requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    player.update(false);
    platforms.forEach(platform=>{
        if(!(platform.width == canvas.width)){
            platform.position.y-=1;
        }
        platform.draws();
    })
    
   

    if(keys.left.pressed) {
        platforms.forEach(platform=>{
        player.velocity.x=-4
        if (!(player.position.y+player.radius
            <= platform.position.y && player.position.y+player.radius + player.velocity.y >= platform.position.y && player.position.x >= platform.position.x && player.position.x <= platform.position.x + platform.width)) {
                player.velocity.y = 1
                gravity = 0.3
            }
        })
    }
    else if (keys.right.pressed){
        platforms.forEach(platform=>{
         player.velocity.x=4
         if (!(player.position.y+player.radius
            <= platform.position.y && player.position.y+player.radius + player.velocity.y >= platform.position.y && player.position.x >= platform.position.x && player.position.x <= platform.position.x + platform.width)) {
                player.velocity.y = 1
                gravity = 0.3
            }
        })
    }
    else player.velocity.x=0;
    platforms.forEach(platform=>{
  
        if (checkPosition(platform)) {
                player.velocity.y = 0
                player.position.y-=1;player.draw();
                if(platform.evil){
                    if(player.life){
                        window.cancelAnimationFrame(id)
                        player = new Player(player.life-1)
                        board.innerHTML=`life = ${player.life}`;
                        id = requestAnimationFrame(animate)
    
                    }else{
                        window.cancelAnimationFrame(id)
                        console.log("over")
                        board.innerHTML=`life = ${player.life} GAME OVER`; 
                        gameOver=true;

                    }
                    
                }
            }
        })
}
animate();
function checkPosition(platform){
    if (player.position.y+player.radius <= platform.position.y && 
        player.position.y+player.radius + player.velocity.y >= platform.position.y -1 && 
        player.position.x >= platform.position.x && 
        player.position.x <= platform.position.x + platform.width) return true;
    else{ console.log("dam");return false;}

}
document.addEventListener(`keydown`,({ keyCode }) => { 
switch (keyCode) {  
    case 37:
        console.log('left')
        keys.left.pressed=true
        break
    case 39: 
        console.log('right')
        keys.right.pressed=true
        break
}   
}) 
document.addEventListener('keyup', ({ keyCode }) => { 
switch (keyCode) {  
   case 37:
       console.log('left')
       keys.left.pressed=false 
       break
   case 39: 
       console.log('right')
       keys.right.pressed=false
       break

}   
})
document.getElementById("timer").innerHTML = `<span>Score: ${time} </span>`
function timer(){
    time+=1
    document.getElementById("timer").innerHTML = `<span>Score: ${time} </span>`
}

let x=setInterval(function (){
    timer()
    if (gameOver) {
        time=0
        clearInterval(x);
    }
},1000)

   