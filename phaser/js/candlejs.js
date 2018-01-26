var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'CandleGuy', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('ground', 'assets/platform_01.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var player;
var platforms;
var cursors;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	platforms = game.add.group();
	platforms.enableBody = true;

    createMap();

	player = game.add.sprite(32, game.world.height - 150, 'dude');
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

	player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
	game.physics.arcade.collide(player, platforms);
	player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        player.frame = 4;
    }
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
}

function createMap(){
    for (var i=0; i<map.length; i++){
        for (var j=0; j<map[i].length; j++){
            if (map[i][j] == 1){
                var ground = platforms.create(j*64, i*64, 'ground');
                ground.scale.setTo(2, 2);
                ground.body.immovable = true;
            }
        }
    }
}