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

// Start game creating an enemy every 2 seconds
var createEnemyDelay = 2000;

// IIFE that creates an enemy instance based on delay value
(function createEnemy() {
    // Pick random row of stones for enemy to cross on
    var row = (getRandomNumber(1, 5) * 83) - 24;

    // Pick random speed for enemy to move at
    var speed = getRandomNumber(100, 400);

    // Set bug image based on speed
    var sprite;
    if (speed <= 200) {
        sprite = 'images/enemy-bug.png';
    } else if (speed >= 201 && speed <= 300) {
        sprite = 'images/green-enemy-bug.png';
    } else {
        sprite = 'images/purple-enemy-bug.png';
    }

    // Create enemy instance
    var enemy = allEnemies.push(new Enemy(-100, row, speed, sprite));

    // Create multiple enemies with time delay between instances
    setTimeout(createEnemy, createEnemyDelay);
})();

// Player class
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
    this.level = 1;
    this.score = 0;
};

// Resets game play
Player.prototype.reset = function () {
    this.x = 303;
    this.y = 487;
    for (var i = 0; i < allEnemies.length; i++) {
        allEnemies.pop();
    }
};

// Check for collision accounting for transparent pixels
Player.prototype.checkCollision = function(target, yAlpha, wid, hgt) {
    for (var i = 0; i < target.length; i++) {
        if (player.x +  85 > target[i].x &&
            player.x +  17 < target[i].x + wid &&
            player.y + 140 > target[i].y + yAlpha &&
            player.y +  63 < target[i].y + yAlpha + hgt) {

            // Collision is true
            return true;
        }
    }
};

// Check for events and update game status
Player.prototype.update = function() {

    //Player completes level by getting to the water
    if (this.y === -11) {

        // Increment level and score
        this.level += 1;
        this.score += 100;

        // Increase difficulty by creating enemies faster (.2 sec min)
        if (createEnemyDelay > 200) {
            createEnemyDelay -= 100;
        }

        // Reset game play for next level
        this.reset();
    }

    // Check for enemy collision
    if (this.checkCollision(allEnemies, 77, 98, 66) === true) {

        // If true then reset stats and start game over
        this.level = 1;
        this.score = 0;
        this.reset();
    }
};

// Draw the player and their stats on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Set font style
    ctx.font = '16pt Chango';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';

    // Draw player's level
    ctx.fillText('Level: ' + this.level, 70, 80);

    // Draw player's score
    ctx.fillText('Score: ' + this.score, 353, 80);
};

// Handles input from arrow keys and moves player inside field of play
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

    // Keep player within boundaries of playing field
    if (this.x < 0) {
        this.x = 0;
    } else if (this.x > 606) {
        this.x = 606;
    } else if (this.y > 487) {
        this.y = 487;
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
