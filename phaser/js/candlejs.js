var game = new Phaser.Game(1000, 600, Phaser.CANVAS, 'CandleGuy', { preload: preload, create: create, update: update});


function preload() {
    
	game.load.image('ground', 'assets/platform_01.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('dudebougie', 'assets/dudebougie.png', 283, 247);
    game.load.spritesheet('testsprite', 'assets/testsprite.png', 64, 64);
    game.load.image('bougie', 'assets/bougie.png');
    game.load.image('bullet', 'assets/flamme.png');
    game.load.image('background', 'assets/background.png');
    game.load.spritesheet('spritewall', 'assets/spritesheetwall.png', 64, 64);
    game.load.image('cratesprite', 'assets/star.png');
    game.load.image('spikesprite', 'assets/diamond.png');
    game.load.image('candleguy', 'assets/candleguy.png');
    game.load.spritesheet('life', 'assets/life.png', 58, 53);
    game.load.spritesheet('npc', 'assets/npc.png', 32, 64);
    game.load.spritesheet('foe', 'assets/foe.png', 32, 32);
    game.load.spritesheet('plateform', 'assets/plateform.png', 64, 64);

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
'                                                    2 r',
'                                                    2 r',
'                                                    2 r',
'                                           gggggggggggn',
' gg                                        9999       r',
'           3          aa     ggttggttgggggggggg       r',
'   ggg   ggggg  gggttggggggg                          r',
'                        m                           ggm',
'      d               m                               r',
'          wgggggggggggggggggggggggggg    wg88gggggggn9r',
'         dl                              l     m    r9r',
' d        l                9             l     m   mr9r',
'          9           abbbbbbbbbbbbb     l     m   mr9r',
' ggg      sbbbbbbbbbbbb                  l         mr9r',
'                                         l      7 6mr9r',
'      gg                                 sbbbbbbbbbbe9r',
'                           w88ggggggn                 r',
'         d            gg   l        r                 r',
'   ddd    gg              dl        r                 r',
'                           9     0  r                 r',
'    ggg         wggg88gggggmmbbbbbbbe                 r',
'          d     l           r                         r',
'                l           r                         r',
'   wg88gggggggn sbb88bababbbe                         r',
'dddl          r                                       r',
'   l          r                                       r',
'g  sb88bbbbbbbe                                       r',
'    l    7            gggggggg                        r',
'    9 4  7                                            r',
'gggggggggggggggggttttttgggggttttgggggggggggggtttggggggm'
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
var LIFE = 6;
var lifeBar;
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

var crategroup;
var crate;

var spikegroup;
var spike;


function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'background');

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
    player.animations.add('left', [2, 3], 10, true);
    player.animations.add('right', [0, 1], 10, true);
    this.jumping = false;
    game.camera.follow(player);
    //game.worldScale += 0.5

    lifeBar = game.add.group();

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
}

function update() {
    //==Lumiere==
    lightSprite.reset(game.camera.x, game.camera.y);    
    updateShadowTexture();
    //==Physique==
    game.physics.arcade.collide(player, platforms);
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

    game.physics.arcade.overlap(player, npcSuperForce, npcTab[0], null, this);
    game.physics.arcade.overlap(player, npcArmor, npcTab[1], null, this);
    game.physics.arcade.overlap(player, npcFlame, npcTab[2], null, this);
    game.physics.arcade.overlap(player, npcDoubleJump, npcTab[3], null, this);
    game.physics.arcade.overlap(player, npcSize, npcTab[4], null, this);


    key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key1.onDown.add(platforme, this);
    //==Déplacements==
    player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -SPEED;
        //player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = SPEED;
        //player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        player.frame = 4;
    }
    if ((fireButton.isDown)&&(FLAME))
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
    
    lightSprite.reset(game.camera.x, game.camera.y);
}

//==Création de la TileMap==
function createMap(){
    for (var i=0; i<map.length; i++){
        for (var j=0; j<map[i].length; j++){
            if (map[i][j] != ' '){
                if (map[i][j]==8){
                    var breakable=breakablegroup.create(j*64,i*64,'testsprite');
                    breakable.body.immovable=true;
                    breakable.frame=dictiowall[8];
                }
                else if (map[i][j]==7){
                    crate=crategroup.create(j*64,i*64,'cratesprite');
                    crate.body.gravity.y = 300;
                }
                else if (map[i][j]=='t'){
                    spike=spikegroup.create(j*64,i*64,'spikesprite');
                    spike.body.immovable=true;


                }
                else if(map[i][j]=='d'){
                    
                    console.log("d");
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
                npcSuperForce = npcgroup.create(j*64,i*64,'npc');
                npcSuperForce.anchor.y -= 0.075;
                npcSuperForce.animations.add('giveAbility', [1, 2, 3, 4], 2, false);
            }
            if (map[i][j] == '1'){
                npcArmor = npcgroup.create(j*64,i*64,'npc');
                npcArmor.anchor.y -= 0.075;
                npcArmor.animations.add('giveAbility', [1, 2, 3, 4], 2, false);
            }
            if (map[i][j] == '2'){
                npcFlame = npcgroup.create(j*64,i*64,'npc');
                npcFlame.anchor.y -= 0.075;
                npcFlame.animations.add('giveAbility', [1, 2, 3, 4], 2, false);
            }
            if (map[i][j] == '3'){
                npcDoubleJump = npcgroup.create(j*64,i*64,'npc');
                npcDoubleJump.anchor.y -= 0.075;
                npcDoubleJump.animations.add('giveAbility', [1, 2, 3, 4], 2, false);
            }
            if (map[i][j] == '4'){
                npcSize = npcgroup.create(j*64,i*64,'npc');
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
    ARMOR = false;
    SPEED = 200;
}

function giveFlame(){
    console.log('give flame');
    npcFlame.animations.play('giveAbility');
    FLAME = false;
}

function giveDoubleJump(){
    console.log('give double jump');
    npcDoubleJump.animations.play('giveAbility');
    JUMPS = 1;
    DOUBLEJUMPSPEED = 300;
    doublejumpok = false;
    placeMoreGround();
}

function giveSize(){
    console.log('give size');
    npcSize.animations.play('giveAbility');
    SIZE = 0.5;
    player.scale.setTo(SIZE, SIZE);
}

//==Création d'ennemis (à partir d'une position)
function createFoe(x,y){
    console.log('foe');
    ennemy = ennemygroup.create(y*64, x*64,'foe');
    ennemy.enableBody = true;
    ennemy.body.bounce.y = 0.2;
    ennemy.body.gravity.y = 300;
    ennemy.body.collideWorldBounds = true;
}

//==Perte de vie==
function loseLife(){
    LIFE--;
    player.y=player.y-50;
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
    //jumps == 2
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

function updateShadowTexture(){    
        // Draw shadow    
        console.log ("test");
        shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';    
        shadowTexture.context.fillRect(0, 0, game.width, game.height);    
        var radius = 100 + game.rnd.integerInRange(1,10);
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