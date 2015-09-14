// Initial score
var score = 0;

// Value of the gem, this is defined in setGemLocation()
var gemValue;

// Boolean values for updating the score.
var up = false;
var collide = false;
var hasGem = false;

// This will be multiplied with a random number between 1 and 10 to set the speed of the enemy.
// Change this number to increase or lower difficulty.
var speedMultiply = 80;

// Enemies our player must avoid
var Enemy = function(enemyX, enemyY, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
	 this.x = enemyX;
	 this.y = enemyY;
	 this.speed = speed;
	 
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/small/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	 this.x += this.speed * dt;
	 
	 // Resets enemy with a new speed after it goes off canvas.
	 if (this.x > 505) {
		  this.x = -105;
		  this.speedGenerator();
	 }
	
	// Sets the edges of the enemy.
	var enemyUp = this.y - 37;
	var enemyDown = this.y + 37;
	var enemyLeft = this.x - 50;
	var enemyRight = this.x + 50;
	
	// Detects if the player character is touching any of the enemy edges.
    // Updates score and resets with updateScore() if it does.
	if (player.y > enemyUp && player.y < enemyDown && player.x > enemyLeft && player.x < enemyRight) {
	    collide = true;
	    updateScore();
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Sets a random speed to the enemy.
Enemy.prototype.speedGenerator = function() {
	 this.speed = speedMultiply * (Math.floor(Math.random() * 10) + 1);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var playerX = 219;
var playerY = 450;

// The player character
var Player = function() {
	 this.x = playerX;
	 this.y = playerY;
	
	 this.sprite = 'images/small/char-boy.png';
};

// Empty, does not need to update at the moment.
Player.prototype.update = function() {
};

// Draw the player on the screen.
Player.prototype.render = function() {
	 ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
   
     ctx.font = '30pt Courier New';
     ctx.fillStyle = 'orange';
     ctx.fillText('Score' + ' ' + score , 0, 30);
};

// Moves the player character.
Player.prototype.handleInput = function(keyDown) {
	var moveVertical = 85;
	var moveHorizontal = 100;
	
	// Moves the player character and makes sure it doesn't go out of bounds.
	// If player moves up in the water, updates score and resets with updateScore().
	// Change these values if another row or column is added to the game.
	if (keyDown === 'up') {
		if (this.y === 110) {
			up = true;
			updateScore();
		}
		else {
			this.y -= moveVertical;
		}
	}
	else if (keyDown === 'down') {
		if (this.y === playerY) {
			return null;
		}
		else {
			this.y += moveVertical;
		}
	}
	else if (keyDown === 'left') {
		if (this.x === 19) {
			return null;
		}
		else {
			this.x -= moveHorizontal;
		}
	}
	else if (keyDown === 'right') {
		if (this.x === 419) {
			return null;
		}
		else {
			this.x += moveHorizontal;
		}
	}
	else {
		return null;
	}
};

// When called, resets player character to original position.
Player.prototype.playerReset = function() {
	this.x = playerX;
	this.y = playerY;
};

// Creates a gem and places it on a random stone block.
var Gem = function() {
	this.setGemLocation();
};

// Sets the location of a gem.
// Blue will apprea most often, then green, then orange.
Gem.prototype.setGemLocation = function() {
	var random = Math.floor(Math.random() * 100) + 1;
	
	if (random >= 60) {
		this.sprite = 'images/small/Gem Blue.png';
		this.x = (Math.floor(Math.random() * 5)) * 100 + 25;
		this.y = (Math.floor(Math.random() * 3) + 1) * 85 + 60;
		gemValue = 20;
	}
	else if (random < 60 && random > 10) {
		this.sprite = 'images/small/Gem Green.png';
		this.x = (Math.floor(Math.random() * 5)) * 100 + 25;
		this.y = (Math.floor(Math.random() * 3) + 1) * 85 + 60;
		gemValue = 50;
	}
	else {
		this.sprite = 'images/small/Gem Orange.png';
		this.x = (Math.floor(Math.random() * 5)) * 100 + 25;
		this.y = (Math.floor(Math.random() * 3) + 1) * 85 + 60;
		gemValue = 100;
	}
};

// Detects if the player has caught a gem.
Gem.prototype.update = function() {
	// Sets the edges of the gem.
	var gemUp = this.y - 37;
	var gemDown = this.y + 37;
	var gemLeft = this.x - 50;
	var gemRight = this.x + 50;
	
	// Detects if the player character is touching any of the gem edges.
	if (player.y > gemUp && player.y < gemDown && player.x > gemLeft && player.x < gemRight) {
	    hasGem = true;
		this.x = 0;
		this.y = 600;
	}
};

// Draw the gem on the screen.
Gem.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

// Sets maximum number of enemies on screen to 3 (number of rows of rock).
// Be sure to change this if another row of rocks and enemies is to be added.
for (var i = 0; i < 3; i++) {
	 var initialSpeed = speedMultiply * (Math.floor(Math.random() * 10) + 1);
	 allEnemies.push(new Enemy(-105, 135 + 85 * i, initialSpeed));
}

// Creates the player character.
var player = new Player();

// Creates the gem.
var gem = new Gem();

// Updates the score
function updateScore() {
	 ctx.clearRect(0, 0, 500, 500);
	// If the player reaches the water with a gem, update score accordingly.
	 if (up === true && hasGem === true) {
		score += gemValue;
		up = false;
		hasGem = false;
		player.playerReset();
		ctx.clearRect(0, 600, 500, 500);
		gem.setGemLocation();
	 }
	// If the player reaches the water without a gem, increase score by 1.
	 else if (up === true) {
		score++;
		up = false;
		player.playerReset();
	 }
     
	 // If player has collision with enemy, reduce score by half of the gem value carrying.
	 // If not carryin a gem, reduce score by 5.
     if (collide === true) {
		if (hasGem === true) {
			ctx.clearRect(0, 600, 500, 500);
			score -= gemValue / 2;
			hasGem = false;
		}
		else {
			score -= 5;
		}
		collide = false; 
		gem.setGemLocation();
		player.playerReset();
	 }
};

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