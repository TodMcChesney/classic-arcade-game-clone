/**
* @description Enemy bug
* @constructor
* @param {number} x - x canvas coordinates
* @param {number} y - y canvas coordinates
* @param {number} speed
* @param {string} sprite - image of enemy bug
*/
var Enemy = function(x, y, speed, sprite) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = sprite;
};

/**
* @description Update the enemy's position
* @param {number} dt - a time delta between ticks
*/
Enemy.prototype.update = function(dt) {
    // Multiply movement by the dt parameter
    this.x += this.speed * dt;
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Random number generator from MDN documentation
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
// Global_Objects/Math/random
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Instantiate enemy objects
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// Start game creating an enemy every 3 seconds
var createEnemyDelay = 3000;

// IIFE that creates an enemy instance based on delay value
(function createEnemy() {
    // Pick random row of stones for enemy to cross on
    var row = (getRandomNumber(1, 5) * 83) - 24;
    // Pick random speed for enemy to move at
    var speed = getRandomNumber(100, 550);
    // Set bug image based on speed
    var sprite;
    if (speed <= 250) {
        sprite = 'images/enemy-bug.png';
    } else if (speed >= 251 && speed <= 400) {
        sprite = 'images/green-enemy-bug.png';
    } else {
        sprite = 'images/purple-enemy-bug.png';
    }
    // Create enemy instance
    var enemy = allEnemies.push(new Enemy(-100, row, speed, sprite));
    // Create multiple enemies with time delay between instances
    setTimeout(createEnemy, createEnemyDelay);
})();

/**
* @description Bonus points gem
* @constructor
* @param {number} x - x canvas coordinates
* @param {number} y - y canvas coordinates
* @param {string} sprite - image of gem
*/
var Gem = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

// Draw the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Instantiate gem objects
// Place all gem objects in an array called allGems
var allGems = [];

// Creates an array of 3 gem instances
function createGems() {
    for (var i = 0; i < 3; i++) {
        // Pick random col for gem to be on
        var col = getRandomNumber(0, 6) * 101;
        // Pick random row of stones for gem to be on
        var row = (getRandomNumber(1, 5) * 83) - 24;
        // Assign gem image
        if (i === 0) {
            sprite = 'images/blue-gem.png';
        } else if (i === 1) {
            sprite = 'images/green-gem.png';
        } else {
            sprite = 'images/orange-gem.png';
        }
        // Create gem instance
        var gem = allGems.push(new Gem(col, row, sprite));
    }
}

createGems();

/**
* @description Player
* @constructor
* @param {number} x - x canvas coordinates
* @param {number} y - y canvas coordinates
*/
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
    this.level = 1;
    this.score = 0;
    this.gems = 0;
};

// Resets game play
Player.prototype.reset = function () {
    this.x = 303;
    this.y = 487;
    // Remove all enemy instances
    var enemiesArrayLength = allEnemies.length;
    for (var i = 0; i < enemiesArrayLength; i++) {
        allEnemies.pop();
    }
    // Remove all gem instances
    var gemsArrayLength = allGems.length;
    for (var x = 0; x < gemsArrayLength; x++) {
        allGems.pop();
    }
    createGems();
};

/**
* @description Check for collision accounting for transparent pixels
* @param {array} target - all instances of target being checked
* @param {number} yAlpha - offset for transparent px above the target
* @param {number} wid - width of target
* @param {number} hgt - height of target
* @this Player
* @returns {boolean} true if there is a collision
*/
// Based on: 2D collision detection - MDN documentation
// https://developer.mozilla.org/en-US/docs/Games/Techniques/
// 2D_collision_detection
Player.prototype.checkCollision = function(target, yAlpha, wid, hgt) {
    for (var i = 0; i < target.length; i++) {
        if (this.x +  85 > target[i].x &&
            this.x +  17 < target[i].x + wid &&
            this.y + 140 > target[i].y + yAlpha &&
            this.y +  63 < target[i].y + yAlpha + hgt) {
            // Collision is true, move target out of field of play
            target[i].y += 1000;
            return true;
        }
    }
};

// Check for events and update game status
Player.prototype.update = function() {
    // Player completes level by getting to the water
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
        // If true then reset everything and start game over
        this.level = 1;
        this.score = 0;
        this.gems = 0;
        createEnemyDelay = 3000;
        this.reset();
    }
    // Check for gem collision
    if (this.checkCollision(allGems, 77, 58, 66) === true) {
        this.score += 20;
        this.gems += 1;
    }
};

// Draw the player and their stats on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Set font style for stats
    ctx.font = '16pt Chango';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    // Draw player's game level
    ctx.fillText('Level: ' + this.level, 70, 80);
    // Draw player's score
    ctx.fillText('Score: ' + this.score, 353, 80);
    // Draw player's number of gems
    ctx.fillText('Gems: ' + this.gems, 630, 80);
};

// Handles input from arrow keys and moves player inside field of play
Player.prototype.handleInput = function(direction) {
    if (direction === 'up') {
        this.y -= 83;
    } else if (direction === 'down' && this.y < 487) {
        this.y += 83;
    } else if (direction === 'left' && this.x > 0) {
        this.x -= 101;
    } else if (direction === 'right' && this.x < 606) {
        this.x += 101;
    }
};

// Instantiate player object
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
