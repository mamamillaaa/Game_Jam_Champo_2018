var game = new Phaser.Game(1000, 600, Phaser.CANVAS, 'CandleGuy', { preload: preload, create: create, update: update });


//game;
function preload() {
  
  
}

function create(){
  game.plugins.add(Phaser.Plugin.Illuminated);
  
  myLamp1 = game.add.illuminated.lamp(200, 200 /*,{ illuminated lamp config object }*/);
  
  myObj = game.add.illuminated.rectangleObject(420, 210, 40, 30);
  
  myObjs = [myObj];
  myLamp2.createLighting(myObjs);
  
  myLamps = [myLamp];
  myMask = game.add.illuminated.darkMask(myLamps/*, color*/);
  
}

function update(){    
  myLamp.refresh();
  myMask.refresh();
}

function render(){}