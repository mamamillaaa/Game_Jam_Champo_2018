var game = new Phaser.Game(1000, 600, Phaser.CANVAS, 'CandleGuy', { preload: preload, create: create, update: update});


function preload() {


    // -- musique --
    
    game.load.audio('cave', ['sound/cave.mp3', 'sound/cave.ogg']);
    
    game.load.image('ground', 'assets/platform_01.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    game.load.spritesheet('dudebougie', 'assets/dudebougie.png', 283, 247);
    game.load.spritesheet('testsprite', 'assets/testsprite.png', 64, 64);
    game.load.image('bougie', 'assets/bougie.png');
    game.load.image('bullet', 'assets/flamme.png');
    game.load.image('background', 'assets/background.png');
    game.load.spritesheet('spritewall', 'assets/spritesheetwall.png', 64, 64);
    game.load.image('cratesprite', 'assets/caisse.png');
    game.load.spritesheet('spikesprite', 'assets/spike.png',64,64);
    game.load.spritesheet('trappesprite', 'assets/TrappeSprite.png',64,64);
    game.load.image('cratesprite', 'assets/star.png');
    game.load.image('fragile', 'assets/sol_fragile.png');
    game.load.spritesheet('spikesprite', 'assets/TrappeSprite.png',64,64);
    game.load.spritesheet('candleguy', 'assets/candleguy.png', 64, 64);
    game.load.spritesheet('life', 'assets/life.png', 64, 64);
    game.load.spritesheet('npcSuperForce', 'assets/npcSuperForce.png', 32, 64);
    game.load.spritesheet('npcArmor', 'assets/npcArmor.png', 32, 64);
    game.load.spritesheet('npcFlame', 'assets/npcFlame.png', 32, 64);
    game.load.spritesheet('npcDoubleJump', 'assets/npcDoubleJump.png', 32, 64);
    game.load.spritesheet('npcSize', 'assets/npcSize.png', 32, 64);
    game.load.spritesheet('foe', 'assets/foe.png', 32, 32);
    game.load.spritesheet('plateform', 'assets/plateform.png', 64, 64);
    game.load.image('aura', 'assets/aura.png');
    game.load.image('trou', 'assets/troudesouris.png');
    game.load.image('deathscreen', 'assets/gameover.png');
    game.load.spritesheet('death', 'assets/hero-sprites-all.png',64,64)
}


/*
Code de la map
' ': vide
1: sol
2: plateforme tombante
4: ennemi
5: flamme
6: rebondissante
7: crate
8: plateforme destructible double saut
9: trou de petit
t: trappe
a: piques
b: porte 
d: plateforme doublesaut
0: end
*/

var map = [
'                                                    2 r',
'                                           qggg8gg8gggr',
' qk                                   a    9999       r',
'           3          aa     qkttqkttqggggggggk       r',
'   qgk   qgggk  qgkttqgggggk                  l     x r',
'                        l                     l     ggm',
'      d        aa     l                       l     9 r',
'          wggggggg888ggggggngggggk       wg88gggggggn r',
'         dl                r             l     m    r r',
'          l   1            r            ql    xm   0r r',
'      qk  l  qgn           r             l    qm   mr r',
' d        l    sk          9             l     m   mr r',
'          9         aawbbbbbbbktqbbk     l     m   mr r',
' qgk      sbbktqbbbbbbe                  l         mr r',
'                                         l a    7 6mr r',
'      qk                                 sbbbbbbbbbbe r',
'                           w88ggggggn                 r',
'         d            qk   l        r                 r',
'   ddd    qk              dl        r                 r',
'                           9     0  rgggk             r',
'    qk          wggg88gggggggbbbbbbbe       d   a  a  r',
'          d     l           r                 qgggggggr',
'            x   l     a a   r                         r',
'   wg88gggggggn sbb88bbbbbbbe      a   a              r',
'dddl          r                 ggggggggggk           r',
'   l     a  x r                            d     a    r',
'k  sb88bbbbbbbe           a                  qgggggkgqr',
'    l    7            qgggggggk                       r',
'    9 4  7                                            r',
'ggggggggggggggggkttttttqgggkttttqgggggggggggktttqgggggm'
];

var dictiowall = {
    'g':7,//droite gauche
    'n':2,//coin haut droite
    's':0,//coin bas gauche
    'e':1,//coin bas droite
    'w':3,//coin haut gauche
    'l':6,//haut bas
    'r':6,
    'b':7,//tube vertical
    'm':1,//angle bas droit
    't':10,//trap
    'a':11,//pique
    'd':7,
    'q':5,
    'k':4,
};

var dist;

//==Joueur et caractéristiques==
var player;
//Puissance d'attaque :
var MIGHT = 3;
//Grosse armure et vitesse de déplacement :
var ARMOR = true;
var SPEED = 150;
var JUMPSPEED = 300;
var DOUBLEJUMPSPEED = 150;
//Flame :
var FLAME = true;
//Double saut :
var JUMPS = 2;
var doublejumpok=true;
//Taille
var SIZE = 1;
//Vie
var LIFE;
var lifeBar;
//Arme
var weapon;
var lumsize;

var platforms;

var cursors;
var fireButton;

var ennemygroup;
var ennemy;

var npcgroup;
var npcSuperForce;
var npcArmor;
var npcFlame;
var npcDoubleJump;
var npcSize;
var npcTab = [giveSuperForce, giveArmor, giveFlame, giveDoubleJump, giveSize];

var breakablegroup;
var breakable;

var crategroup;
var crate;

var spikegroup;
var spike;

var trapgroup;
var trap;

var aura;

var trougroup;
var trou;

var lifegroup;
var lifepoint;

function create() {

    lifeBar=[];
    
    // -- musique --
    music = game.add.audio('cave');
    music.play();

    
    // -- physique --
	game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'background');

    trapgroup=game.add.group();
    trapgroup.enableBody=true;

    lifegroup=game.add.group();

    trougroup=game.add.group();
    trougroup.enableBody=true;

    LIFE = 6;


    


    breakablegroup=game.add.group();
    breakablegroup.enableBody = true;

    crategroup = game.add.group();
    crategroup.enableBody = true;

    platforms = game.add.group();
    platforms.enableBody = true;
    game.world.setBounds(0, 0, 4000, map.width*64);

    spikegroup=game.add.group();
    spikegroup.enableBody=true;

    player = game.add.sprite(100, 1700, 'candleguy');
    game.physics.arcade.enable(player);
    player.scale.setTo(SIZE, SIZE);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [3, 4], 5, true);
    player.animations.add('right', [1, 2], 5, true);
    player.animations.add('fall', [5, 5, 5, 5, 5], 5, true);
    player.animations.add('jump', [6, 6, 6, 6, 6], 5, true);
    player.animations.add('attack_left', [8, 8], 10, true);
    player.animations.add('attack_right', [7, 7], 10, true);
    player.animations.add('took_dmgs', [9, 10], 5, true);
    player.events.onOutOfBounds.add(killPlayer, this);


    aura=game.add.sprite(player.x-200, player.y-200,'aura');
    aura.enableBody=true;
    game.physics.arcade.enable(aura);
    //player.animations.add('died', [10, 10, 10, 10, 10], 5, true);
    this.jumping = false;
    game.camera.follow(player);
    //game.worldScale += 0.5

    lifeBar = game.add.group();
    lumsize=400;

    npcgroup = game.add.group();
    npcgroup.enableBody = true;

    ennemygroup = game.add.group();
    ennemygroup.enableBody = true;
    ennemygroup.physicsBodyType = Phaser.Physics.ARCADE;

    weapon = game.add.weapon(30, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    weapon.bulletSpeed = 300;
    weapon.fireRate = 500;
    game.physics.arcade.enable(weapon.bullets);

    weapon.trackSprite(player, 0, 0, true);

    createMap();

    //==Controles==
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    
    shadowTexture = game.add.bitmapData(game.width, game.height);    
    // Create an object that will use the bitmap as a texture    
    lightSprite = game.add.image(game.camera.x, game.camera.y, shadowTexture);    
    // Set the blend mode to MULTIPLY. This will darken the colors of    
    // everything below this sprite.    
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    for (var o=0;o<LIFE;o++){
        lifepoint=lifegroup.create(0+60*o,20,'life');
        lifepoint.animations.add('burn', [0,1,2,3], 10, true);
        lifepoint.animations.play('burn');
        lifepoint.fixedToCamera=true;
        lifepoint.bringToTop();
        lifeBar[o]=lifepoint;
    }
}

function update() {
    aura.x=player.x-200;
    aura.y=player.y-200;
    //==Lumiere==
    lightSprite.reset(game.camera.x, game.camera.y);    
    updateShadowTexture();
    //==Physique==
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player, trougroup);
    game.physics.arcade.collide(player, trapgroup, trappegestion, null, this);
    game.physics.arcade.collide(crategroup, platforms);
    game.physics.arcade.collide(npcgroup, platforms);
    game.physics.arcade.collide(crategroup, crategroup);
    game.physics.arcade.collide(ennemygroup, platforms);
    game.physics.arcade.collide(ennemygroup, crategroup);
    game.physics.arcade.collide(weapon.bullets, platforms, destroybullet, null, this);
    game.physics.arcade.collide(player, ennemygroup, loseLife, null, this);
    game.physics.arcade.collide(player, breakablegroup, checkifbroken, null, this);
    game.physics.arcade.collide(player, crategroup);
    game.physics.arcade.collide(player, spikegroup, loseLife, null, this);
    game.physics.arcade.collide(aura, ennemygroup, reactionfoe, null, this);
    game.physics.arcade.collide(ennemygroup,breakablegroup);
    game.physics.arcade.collide(ennemygroup,crategroup);
    game.physics.arcade.collide(trougroup,crategroup);
    game.physics.arcade.collide(breakablegroup , ennemygroup);

    game.physics.arcade.overlap(player, npcSuperForce, npcTab[0], null, this);
    game.physics.arcade.overlap(player, npcArmor, npcTab[1], null, this);
    game.physics.arcade.overlap(player, npcFlame, npcTab[2], null, this);
    game.physics.arcade.overlap(player, npcDoubleJump, npcTab[3], null, this);
    game.physics.arcade.overlap(player, npcSize, npcTab[4], null, this);
    
    for (var i=0; i<crategroup.children.length; i++){
        if (crategroup.children[i].body.velocity.x > 0){
            crategroup.children[i].body.velocity.x -= 1;
        }
        else if(crategroup.children[i].body.velocity.x < 0){
            crategroup.children[i].body.velocity.x += 1;
        }
    }
    /*key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key1.onDown.add(platforme, this);*/

    player.body.velocity.x = 0;

    var onTheGround = player.body.touching.down;
    if (onTheGround){
        this.jumps = JUMPS;
        this.jumping = false;
        if (cursors.left.isDown){
            player.body.velocity.x = -SPEED;
            player.animations.play('left');
        }
        else if (cursors.right.isDown){
            player.body.velocity.x = SPEED;
            player.animations.play('right');

        }
        else{
            player.animations.stop();
            player.frame = 0;
        }

        if (this.jumps > 0 && cursors.up.isDown && cursors.up.duration < 200) {
            player.body.velocity.y = -JUMPSPEED;
            this.jumping = true;
            player.animations.stop();
            player.frame = 6;
        }

        if (fireButton.isDown && fireButton.duration < 200){
            if(cursors.right.isDown){
                //player.animations.play('attack_right');
                player.frame = 7;
                if (FLAME){
                    weapon.fire();
                }
            }
            if(cursors.left.isDown){
                //player.animations.play('attack_left');
                player.frame = 8;
                if (FLAME){
                    weapon.fireAtXY(player.x-1,player.y);
                }
            }
            else{
                player.animations.play('attack_right');
                if (FLAME){
                    weapon.fire();
                }
            }
        }
    }
    else{
        player.animations.stop();
        player.frame = 5;
        if (cursors.left.isDown){
            player.body.velocity.x = -SPEED;
        }
        else if (cursors.right.isDown){
            player.body.velocity.x = SPEED;
        }
        if (this.jumps == 1 && cursors.up.isDown && cursors.up.duration < 200) {
            player.body.velocity.y = -DOUBLEJUMPSPEED;
            this.jumping = true;
            player.frame = 6;
        }
        if (this.jumping && cursors.up.isUp) {
            this.jumps--;
            this.jumping = false;
            player.animations.stop();
            player.frame = 5;
        }
    }
    
    lightSprite.reset(game.camera.x, game.camera.y);
}

//==Création de la TileMap==
function createMap(){
    for (var i=0; i<map.length; i++){
        for (var j=0; j<map[i].length; j++){
            if (map[i][j] != ' '){
                if (map[i][j]==8){
                    var breakable=breakablegroup.create(j*64,i*64,'fragile');
                    breakable.body.immovable=true;
                    breakable.frame=dictiowall[8];
                }
                if (map[i][j]==9){
                    trou=trougroup.create(j*64,i*64,'trou');
                    trou.body.immovable=true;
                }
                else if (map[i][j]==7){
                    crate=crategroup.create(j*64,i*64,'cratesprite');
                    crate.body.gravity.y = 300;
                }
                else if (map[i][j]=='a'){
                    spike=spikegroup.create(j*64,i*64,'spikesprite');
                    spike.body.immovable=true;
                    spike.animations.add('piquant', [0, 1, 2, 3,2,1,0], 5, true);
                    spike.animations.play('piquant');
                }
                else if(map[i][j]=='t'){
                    trap=trapgroup.create(j*64,i*64,'trappesprite');
                    trap.body.immovable=true;
                    trap.animations.add('open', [0, 1, 2], 5, true);

                }
                else if (map[i][j] in dictiowall && map[i][j] != 'd'){
                    var ground=platforms.create(j*64, i*64, 'spritewall');
                    ground.body.immovable = true;
                    ground.frame=dictiowall[map[i][j]];
                }
                else if (map[i][j] == 'x'){
                    createFoe(i, j);
                }
            }
        }
    }
    placeNPC();
}

function placeMoreGround(){
    for (var i=0; i<map.length; i++){
        for (var j=0; j<map[i].length; j++){
            if (map[i][j] == 'd'){
                var ground=platforms.create(j*64, i*64, 'spritewall');
                ground.body.immovable = true;
                ground.frame=dictiowall[map[i][j]];
            }
        }
    }
}

//==Placement de NPCs==
function placeNPC(){
    for (var i=0; i<map.length; i++){
        for (var j=0; j<map[i].length; j++){
            if (map[i][j] == '0'){
                npcSuperForce = npcgroup.create(j*64,i*64,'npcSuperForce');
                npcSuperForce.anchor.y -= 0.075;
                npcSuperForce.animations.add('giveAbility', [1, 2, 3, 4], 2, false);
            }
            if (map[i][j] == '1'){
                npcArmor = npcgroup.create(j*64,i*64,'npcArmor');
                npcArmor.anchor.y -= 0.075;
                npcArmor.animations.add('giveAbility', [1, 2, 3, 4], 2, false);
            }
            if (map[i][j] == '2'){
                npcFlame = npcgroup.create(j*64,i*64,'npcFlame');
                npcFlame.anchor.y -= 0.075;
                npcFlame.animations.add('giveAbility', [1, 2, 3, 4], 2, false);
            }
            if (map[i][j] == '3'){
                npcDoubleJump = npcgroup.create(j*64,i*64,'npcDoubleJump');
                npcDoubleJump.anchor.y -= 0.075;
                npcDoubleJump.animations.add('giveAbility', [1, 2, 3, 4], 2, false);
            }
            if (map[i][j] == '4'){
                npcSize = npcgroup.create(j*64,i*64,'npcSize');
                npcSize.anchor.y -= 0.075;
                npcSize.animations.add('giveAbility', [1, 2, 3, 4], 2, false);
            }
        }
    }
}

/*function updateEnnemies(){
    ennemygroup.f
}*/

//==Fonctions de don de capacité==
function giveSuperForce(){
    console.log('give super force');
    npcSuperForce.animations.play('giveAbility');
    npcSuperForce.body.enable=false;
    for (var i=0; i<crategroup.children.length; i++){
        setCrateImmovable(crategroup.children[i]);
    }
}

function setCrateImmovable(crate){
    crate.body.immovable = true;
    crate.body.moves = false;
}

function giveArmor(){
    console.log('give armor');
    npcArmor.animations.play('giveAbility');
    npcArmor.body.enable=false;
    ARMOR = false;
    SPEED = 200;
}

function giveFlame(){
    console.log('give flame');
    npcFlame.animations.play('giveAbility');
    npcFlame.body.enable=false;
    FLAME = false;
    aura.scale.setTo(0.5,0.5);
    lumsize=200;
    updateShadowTexture();
}

function giveDoubleJump(){
    console.log('give double jump');
    npcDoubleJump.animations.play('giveAbility');
    npcDoubleJump.body.enable=false;
    JUMPS = 1;
    DOUBLEJUMPSPEED = 250;
    doublejumpok = false;
    placeMoreGround();
}

function giveSize(){
    console.log('give size');
    npcSize.animations.play('giveAbility');
    npcSize.body.enable=false;
    SIZE = 0.5;
    player.scale.setTo(SIZE, SIZE);
    trougroup.setAll('body.enable',false);
}

//==Création d'ennemis (à partir d'une position)
function createFoe(x,y){
    ennemy = ennemygroup.create(y*64, x*64,'foe');
    ennemy.animations.add('left', [0, 1, 2]);
    ennemy.animations.add('right', [4, 5, 6]);
    ennemy.animations.add('static', [3,4,5], 5, true);
    ennemy.animations.play('static');
    ennemy.enableBody = true;
    ennemy.body.bounce.y = 0.2;
    ennemy.body.gravity.y = 300;
    ennemy.body.collideWorldBounds = true;
    ennemy.life = 3;
}

//==Perte de vie==
function loseLife(){
    LIFE--;
    lifeBar[LIFE].kill();
    if (LIFE==0){
        death();
    }
    player.y -= 50;
        player.animations.play('took_dmgs');
    console.log(LIFE);
}

//==Destruction des flames==
function destroybullet(bullet,platform){
    bullet.kill();
}

function checkifbroken(player,platform){
    if (!doublejumpok){
        platform.kill();
    }
}

function platforme(){
    for (var i=0; i<map.length; i++){
        for (var j=0; j<map[i].length; j++){
            if(map[i][j]=='d'){
                var ground=platforms.create(j*64, i*64, 'spritewall');
                ground.body.immovable = true;
                ground.frame=dictiowall[map[i][j]];
            }
        }
    }
}

function death(){

       //var xdeath=player.x;
       //var ydeath=player.y;
       player.kill();
      // var death=game.add.sprite(xdeath,ydeath,'death');
       //death.frame=8;
       game.time.events.add(Phaser.Timer.SECOND, ecranmort, this);

}

function ecranmort(){


    var endscreen= game.add.sprite(120,75,'deathscreen');
    endscreen.scale.setTo(0.18,0.18);
    endscreen.fixedToCamera=true;
    restart_label=game.add.text(400,475,'RECOMMENCER', { font: '24px Arial', fill: '#fff' });
    restart_label.fixedToCamera=true;
    restart_label.inputEnabled =true;
    restart_label.events.onInputUp.add(function () {


            this.game.state.restart();



            });


}
function updateShadowTexture(){    

        shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';    
        shadowTexture.context.fillRect(0, 0, game.width, game.height);

        var radius = lumsize + game.rnd.integerInRange(1,10);
        var heroX = player.x - game.camera.x;       
        var heroY = player.y - game.camera.y;       
        // Draw circle of light with a soft edge    
        var gradient = shadowTexture.context.createRadialGradient(heroX, heroY, 100 * 0.75, heroX, heroY, radius);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");    
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");    
        shadowTexture.context.beginPath();    
        shadowTexture.context.fillStyle = gradient;    
        shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI*2, false);   
        shadowTexture.context.fill();    
        // This just tells the engine it should update the texture cache    
        shadowTexture.dirty = true;
}

function render() {

    game.debug.soundInfo(cave, 20, 32);
    //smokeEmitter.debug(432, 522);
    //flameEmitter.debug(10, 522);
    game.debug.body(aura);
}

function trappegestion(player ,trappe){



    if (trappe.frame==0) {
    trappe.animations.play('open',5, false);
    game.time.events.add(500, trappeopen, this, trappe);
    
}

function trappeopen(){
    trappe.body.enable=false;
}
    

}

function checkdistance(player, ennemy){
    dist= Math.distance(player.x,player.y,ennemy.x,ennemy.y);     
}       

function reactionfoe(aura, ennemy){
    ennemy.animations.play('static');
    if(player.x-ennemy.x>0){
        ennemy.animations.play('right',5,true);
        ennemy.body.velocity.x=SPEED-100;
    }
    else
    {
        ennemy.animations.play('left',5,true);
        ennemy.body.velocity.x=-SPEED+100;
    } 
}

function killPlayer(){
    player.kill();
}