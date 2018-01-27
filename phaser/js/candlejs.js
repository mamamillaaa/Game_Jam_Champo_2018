var game = new Phaser.Game(1000, 600, Phaser.CANVAS, 'CandleGuy', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('ground', 'assets/platform_01.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('dudebougie', 'assets/dudebougie.png', 283, 247);
    game.load.spritesheet('testsprite', 'assets/testsprite.png', 64, 64);
    game.load.image('bougie', 'assets/bougie.png');
    game.load.image('bullet', 'assets/flamme.png');
    game.load.image('background', 'assets/michel-galaup.jpg');
    game.load.spritesheet('spritewall', 'assets/spritesheetwall.png', 64,64);
    game.load.image('caissesprite', 'assets/star.png');
    game.load.image('spikesprite', 'assets/diamong.png');
}


/*
Code de la map
' ': vide
1: sol
2: plateforme tombante
4: ennemi
5: flamme
6: rebondissante
7: caisse
8: plateforme destructible double saut
9: trou de petit
t: trappe
a: piques
b: porte 
d: plateforme doublesaut
0: end

*/

var map = [
'                                                      r',
'                                           gggggggggggn',
' gg                                        9999       r',
'                             ggttggttgggggggggg       r',
'           p                                          r',
'   ggg   ggggg  gggttggggggg                          r',
'                        m                           ggm',
<<<<<<< HEAD
'                      m                               r',
'       gg wgggggggggggggggggggggggggg    wg88gggggggn9r',
'   dd     l                              l     m    r9r',
'          l  p             m             l     m   0r9r',
=======
>>>>>>> 4d3fb85596db8a862744103731dd8efe930308fe
'          l  gg            m             l    gm   mr9r',
'     gg   l                9             l     m   mr9r',
'          9           abbbbbbbbbbbbb     l     m   mr9r',
' ggg      sbbbbbbbbbbbb                  l         mr9r',
'      gg                                 l      7 6mr9r',
'                                         sbbbbbbbbbbe9r',
'  ddd                      w88111111n                 r',
'         gg           gg   l        r                 r',
'                           l        r                 r',
'    ggg                    9     p  r                 r',
'                wggg88gggggmmbbbbbbbe                 r',
=======
>>>>>>> 4d3fb85596db8a862744103731dd8efe930308fe
'                l           r                         r',
'   wg88gggggggn sbb88bababbbe                         r',
'   l          r                                       r',
<<<<<<< HEAD
'   l          r                                       r',
'g  sb88bbbbbbbe       gggggggg                        r',
'    l    r                                            r',
'    9 p  r                                            r',
'ggggggggggggggggggttttggggggtttggggggggggggggtttggggggg',
=======
>>>>>>> 4d3fb85596db8a862744103731dd8efe930308fe
];

var dictiowall = {
    'g':4,
    'n':0,
    's':2,
    'e':1,
    'w':3,
    'l':7,
    'r':5,
    'b':6,
    'm':8,
    't':10,
    'a':11,
    'd':12,
};

//==Joueur et caractéristiques==
var player;
//Puissance d'attaque :
var MIGHT = 3;
//Grosse armure et vitesse de déplacement :
var ARMOR = true;
var SPEED = 100;
var JUMPSPEED = 300;
var DOUBLEJUMPSPEED = 150;
//Flame :
var FLAME = true;

//Double saut :
var JUMPS = 2;
var doublejumpok=true;
//Taille
var SIZE = 2;
//Vie
var LIFE = 10;
//Arme
var weapon;

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

var caissegroup;
var caisse;

var spikegroup;
var spike;


function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'background');

    breakablegroup=game.add.group();
    breakablegroup.enableBody = true;

    caissegroup=game.add.group();
    caissegroup.enableBody=true;

	platforms = game.add.group();
	platforms.enableBody = true;
    game.world.setBounds(0, 0, 4000, map.width*64);

    npcgroup = game.add.group();
    npcgroup.enableBody = true;

    spikegroup=game.add.group();
    spikegroup.enableBody=true;

    createMap();

	player = game.add.sprite(100, 1750, 'dudebougie');
    player.scale.setTo(0.20,0.20);
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
	player.animations.add('left', [2, 3], 10, true);
    player.animations.add('right', [0, 1], 10, true);
    this.jumping = false;
    game.camera.follow(player);

    ennemygroup = game.add.group();
    ennemygroup.enableBody = true;
    ennemygroup.physicsBodyType = Phaser.Physics.ARCADE;


    /*npcDoubleJump = npcgroup.create(200, 1800, 'dude');*/


    ennemy=ennemygroup.create(200, 1800, 'bougie');
    ennemy.scale.setTo(0.25,0.25);
    ennemy.body.bounce.y = 0.2;
    ennemy.body.gravity.y = 300;
    ennemy.body.collideWorldBounds = true;

    weapon = game.add.weapon(30, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    weapon.bulletSpeed = 300;
    weapon.fireRate = 500;
    game.physics.arcade.enable(weapon.bullets);

    weapon.trackSprite(player, 0, 0, true);

    //==Controles==
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
}

function update() {
    //==Physique==
	game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(npcgroup, platforms);
    game.physics.arcade.collide(ennemygroup, platforms);
    game.physics.arcade.collide(weapon.bullets, platforms, destroybullet, null, this);
    game.physics.arcade.collide(player, ennemygroup, loseLife, null, this);
    game.physics.arcade.collide(player, breakablegroup, checkifbroken, null, this);
    game.physics.arcade.collide(player, caissegroup);
    game.physics.arcade.collide(player, spikegroup, loseLife, null, this);

    game.physics.arcade.overlap(player, npcSuperForce, npcTab[0], null, this);
    game.physics.arcade.overlap(player, npcArmor, npcTab[1], null, this);
    game.physics.arcade.overlap(player, npcFlame, npcTab[2], null, this);
    game.physics.arcade.overlap(player, npcDoubleJump, npcTab[3], null, this);
    game.physics.arcade.overlap(player, npcSize, npcTab[4], null, this);


    //==Déplacements==
	player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -SPEED;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = SPEED;
        player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        player.frame = 4;
    }
    if (fireButton.isDown)
    {
        if(cursors.right.isDown){
            weapon.fire();
        }
        if(cursors.left.isDown){
            
            weapon.fireAtXY(player.x-1,player.y);
        }
        else{
            weapon.fire();
        }
        
    }

    //==Saut / Double saut==
    var onTheGround = player.body.touching.down;
    if (onTheGround) {
        this.jumps = JUMPS;
        this.jumping = false;
    }
    if (this.jumps == 2 && cursors.up.isDown && cursors.up.duration < 200 && onTheGround) {
        player.body.velocity.y = -JUMPSPEED;
        this.jumping = true;
    }
    if (this.jumps == 1 && cursors.up.isDown && cursors.up.duration < 200) {
        player.body.velocity.y = -DOUBLEJUMPSPEED;
        this.jumping = true;
    }
    if (this.jumping && cursors.up.isUp) {
        this.jumps--;
        this.jumping = false;
    }
}

//==Création de la TileMap==

function createMap(){
    for (var i=0; i<map.length; i++){
        for (var j=0; j<map[i].length; j++){
            if (map[i][j] != ' '){
                if(map[i][j]==8){
                 var breakable=breakablegroup.create(j*64,i*64,'testsprite');
                breakable.body.immovable=true;
                breakable.frame=dictiowall[8];

                }
                else if(map[i][j]==7){
                caisse=caissegroup.create(j*64,i*64,'caissesprite');
                

                }
                else if(map[i][j]=='p'){
                    var npc=npcgroup.create(j*64,i*64,'bougie');
                    npc.scale.setTo(0.25,0.25);
                    npc.body.bounce.y = 0.2;
                    npc.body.gravity.y = 300;
                    npc.body.immovable=true;
                }
                else if(map[i][j]=='t'){
                spike=spikegroup.create(j*64,i*64,'spikesprite');
                spike.body.immovable=true;

                }
                else{
                        var ground=platforms.create(j*64, i*64, 'spritewall');
                        ground.body.immovable = true;
                        ground.frame=dictiowall[map[i][j]];
                
            }
            }

        }
    }
}

//==Fonction de don de capacité==
function giveSuperForce(){
    MIGHT = 1;
    caissegroup.body.immovable=true;
}

function giveArmor(){
    ARMOR = false;
    SPEED = 200;
}

function giveFlame(){
    FLAME = false;
}

function giveDoubleJump(){
    console.log('give double jump');
    JUMPS = 1;
}

function giveSize(){
    SIZE = 1;
}

//==Création d'ennemis (à partir d'une position)

function createFoe(x,y){
    ennemy=ennemygroup.create(x*64,y*64,'ennemy');
    ennemy.enableBody=true;
    ennemy.scale.setTo(0.25,0.25);
    ennemy.body.bounce.y = 0.2;
    ennemy.body.gravity.y = 300;
    ennemy.body.collideWorldBounds = true;
}

//==Perte de vie==

function loseLife(){
    LIFE--;
}

//==Destruction des flames==

function destroybullet(bullet,platform){
    bullet.kill();
}

function checkifbroken(player,platform){

    if (doublejumpok==false){
        platform.kill();
    }
}