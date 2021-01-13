const { redux } = window
document.onkeydown = checkKey;

var missiles = [];
var barrelCollisions=0;
var missileSpeed = 2000;
var levelCounter = 1;

var player = document.getElementById("player");
player.style.top = "550px";
player.style.left = "0px";

var enemy = document.getElementById("enemy");
enemy.style.left = "50px";

var ladderElements = document.getElementsByClassName("ladder");
var platformElements = document.getElementsByClassName("platform");
var ladderPositions = [];
var platformsPositions = [];

for(var i=0; i< Object.keys(ladderElements).length; i++){
  ladderPositions.push(ladderElements[i].style.left);
}

for(var i=0; i< Object.keys(platformElements).length; i++){
  platformsPositions.push(parseInt(platformElements[i].style.bottom)+150+"px");
}

var flag = 0;

setInterval(function(){
  if(flag == 0){
    if(enemy.style.left != "600px"){
      enemy.style.left = parseInt(enemy.style.left) + 10 + "px";
    }
    else
      flag = 1;
  }
  else{
    if(enemy.style.left != "50px"){
      enemy.style.left = parseInt(enemy.style.left) - 10 + "px";
    }
    else
      flag = 0
  }
 }, 90);

 setInterval(function(){
  createMissile();
 }, missileSpeed);

 setInterval(function(){
   moveMissileStore.dispatch({ MissileMov: 'MissileMov' });
 }, 100);

 setInterval(function(){
  //checkForCollitions();
   collisionStore.dispatch({ collision: 'collision' });
 }, 1);



 function createMissile(){
    var missile = document.createElement("div");
    missile.classList.add("missile");
    missile.style.top = "175px";
    missile.style.left = parseInt(enemy.style.left) + 16 + "px";

    missiles.push(missile);
    document.getElementById("playground").appendChild(missile);
 }


 function checkForPrincess(){
  if(player.style.top == "150px" && player.style.left == "650px"){
    
    fetch("https://donkeykong-v.glitch.me/sas", {method:"POST",body:JSON.stringify({score: barrelCollisions})})
     .then(res => {res.json().then(data=>{
       missileSpeed = missileSpeed - data.newSpeed;
       
       if(levelCounter<5){
          alert("Nivel Completado ("+levelCounter+"/5) - Los Barriles caeran más seguido");
           levelCounter++;
           player.style.top = "550px";
           player.style.left = "0px";
        }
       else{
         alert("Haz completado el juego - Barriles Golpeados: "+barrelCollisions);
         player.style.top = "550px";
         player.style.left = "0px";
         missiles.forEach(missile => missile.remove());
         levelCounter = 1;
         missileSpeed = 2000;
         
       }
          
       
     })})
     .catch(err=>{console.log(err)})
  }
}


const movePlayerStore = redux.createStore(updatePlayerPosition);
const moveMissileStore = redux.createStore(updateMissilePosition);
const collisionStore = redux.createStore(checkForCollisions);


function checkKey(event) {

  var keyCode = event.keyCode;
  if (keyCode == '37') movePlayerStore.dispatch({ type: 'left' });
  else if (keyCode == '39') movePlayerStore.dispatch({ type: 'right' });
  else if (keyCode == '38') movePlayerStore.dispatch({ type: 'up' });
  else if (keyCode == '40') movePlayerStore.dispatch({ type: 'down' });
}

function updatePlayerPosition(state = { isLeft: false, isRight: false, isUp: false, isDown: false }, action) {
  switch (action.type) {
    case 'left':
      return { ...state, isLeft: true, isRight: false, isUp: false, isDown: false }
    case 'right':
      return { ...state, isLeft: false, isRight: true, isUp: false, isDown: false }
    case 'up':
      return { ...state, isLeft: false, isRight: false, isUp: true, isDown: false }
    case 'down':
      return { ...state, isLeft: false, isRight: false, isUp: false, isDown: true }
  }
}

function updateMissilePosition(state = { isMov: false  }, action) {
  switch (action.MissileMov) {
    case 'MissileMov':
      return { ...state, isMov: true }
  }
}

function checkForCollisions(state = { collision: false  }, action) {
  switch (action.collision) {
    case 'collision':
      return { ...state, collision: true }
  }
}

collisionStore.subscribe(() => {
  const {collision } = collisionStore.getState()
  if(collision){
          for (var i = 0; i < missiles.length; i++) {
      if(missiles[i].offsetTop+30==player.offsetTop && (
         (missiles[i].offsetLeft<=player.offsetLeft+25&&missiles[i].offsetLeft+15>=player.offsetLeft+25) ||
         (missiles[i].offsetLeft<=player.offsetLeft+25&&missiles[i].offsetLeft+15>=player.offsetLeft))
        )
        {
          alert("Te ha pegado un barril");
          player.style.left = "0px"; 
          player.style.top = "550px";
          barrelCollisions++;
        }
    }
  }
});

moveMissileStore.subscribe(() => {
  const {isMov } = moveMissileStore.getState()
  if(isMov){
      for (var i = 0; i < missiles.length; i++) {
    if(missiles[i].style.top == "575px")
      missiles[i].remove();
    else
      missiles[i].style.top = parseInt(missiles[i].style.top) + 5 + "px";
    }
  }
});


movePlayerStore.subscribe(() => {
  const {isLeft, isRight, isUp, isDown } = movePlayerStore.getState()

  if(platformsPositions.includes(player.style.top)){
    if(isLeft && player.style.left != "0px" ){
      player.style.left = parseInt(player.style.left) - 10 + "px";
    }

    if(isRight && player.style.left != "670px"){
      player.style.left = parseInt(player.style.left) + 10 + "px";
      checkForPrincess();
    }
 }

  if(isUp && ladderPositions.includes(player.style.left) && !((player.style.top=="450px" && player.style.left=="600px") || (player.style.top=="350px" && player.style.left=="100px") || (player.style.top=="250px" && player.style.left=="400px") || (player.style.top=="150px" && player.style.left=="250px") )){
    
    if((
        (parseInt(player.style.top) <= 550 && (parseInt(player.style.top) >= 450) && player.style.left=="600px") ||
        (parseInt(player.style.top) <= 450 && (parseInt(player.style.top) >= 350) && player.style.left=="100px") ||
        (parseInt(player.style.top) <= 350 && (parseInt(player.style.top) >= 250) && player.style.left=="400px") ||
        (parseInt(player.style.top) <= 250 && (parseInt(player.style.top) >= 150) && player.style.left=="250px")
      ))               
    {
      player.style.top = parseInt(player.style.top) - 10 + "px";
    }
  }

  if(isDown && ladderPositions.includes(player.style.left) && !((player.style.top=="550px" && player.style.left=="600px") || (player.style.top=="450px" && player.style.left=="100px") || (player.style.top=="350px" && player.style.left=="400px") || (player.style.top=="250px" && player.style.left=="250px") )){
    player.style.top = parseInt(player.style.top) + 10 + "px";
  }
})






