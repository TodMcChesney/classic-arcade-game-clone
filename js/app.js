// Enemy class
var Enemy = function(x, y, speed, sprite) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = sprite;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply movement by the dt parameter
    this.x += this.speed * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Random number generator
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Now instantiate your enemy objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// IIFE that creates an enemy instance every 2 seconds
(function createEnemy() {
    // Pick random row of stones for enemy to cross on
    var row = (getRandomNumber(1, 4) * 83) - 24;

    // Pick random speed for enemy to move at
    var speed = getRandomNumber(50, 350);

    // Set bug image based on speed
    var sprite;
    if (speed <= 150) {
        sprite = 'images/enemy-bug.png';
    } else if (speed >= 151 && speed <= 250) {
        sprite = 'images/green-enemy-bug.png';
    } else {
        sprite = 'images/purple-enemy-bug.png';
    }

    // Create enemy instance
    var enemy = allEnemies.push(new Enemy(-100, row, speed, sprite));

    // Keep calling createEnemy function every 2 seconds
    setTimeout(createEnemy, 2000);
})();

// Player class
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

// Resets game after winning
Player.prototype.reset = function () {
    this.x = 303;
    this.y = 487;
    for (var i = 0; i < allEnemies.length; i++) {
        allEnemies.pop();
    }
};

// Updates player's position when border or water is reached.
Player.prototype.update = function() {
    if (this.x < 0) {
        this.x = 0;
    } else if (this.x > 606) {
        this.x = 606;
    } else if (this.y > 487) {
        this.y = 487;
    } else if (this.y === -11) {
        player.reset();
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handles input from arrow keys and moves player.
Player.prototype.handleInput = function(direction) {
    if (direction === 'up') {
        this.y -= 83;
    } else if (direction === 'down') {
        this.y += 83;
    } else if (direction === 'left') {
        this.x -= 101;
    } else if (direction === 'right') {
        this.x += 101;
    }
};

// Now instantiate your player objects.
// Place the player object in a variable called player
var player = new Player(303, 487);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
