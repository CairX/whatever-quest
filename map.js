/* global Game, State, Resources, Connection, Cookie */
/* exported GameMap */

'use strict';

var Direction = {
    'UP': 0,
    'DOWN': 1,
    'LEFT': 2,
    'RIGHT': 3
};

function Character() {
    this.name = Cookie.get('username');
    this.image = Resources.character;

    this.animationduration = 250;
    this.elapsed = 0;
    this.animating = false;

    this.speed = 16 / this.animationduration;
    this.position = { 'x': 0, 'y': 0 };
    this.target = { 'x': 0, 'y': 0 };

    this.color = '#FF0000';
    this.frames = 3;
    this.frameduration = this.animationduration / this.frames;
    this.frame = 0;
}
Character.prototype.draw = function(context) {
    context.drawImage(this.image, (this.frame * 64), 0, 64, 64, (Game.center.x - 32), (Game.center.y - 32), 64, 64);

    context.fillStyle = this.color;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.fillText(this.name, Game.center.x, (Game.center.y - 48));
};
Character.prototype.update = function(interval) {
    if (this.animating) {
        //console.log();
        this.elapsed += interval;

        //console.log('E: ' + this.elapsed);
        //console.log('D: ' + this.frameduration);
        var frame = Math.floor(this.elapsed / this.frameduration);
        //console.log(frame);
        // Check this because sometimes the duration can be
        // more then wanted so then the frame would overshot.
        // TODO: Try and find a way to prevent this.
        if (frame < this.frames) {
            this.frame = frame;
        }

        // TODO: Make a cleaner design pattern for diffrent directions
        // and animations. Example a dict with functions that can be used
        // as a switch, like Python. Then use that ambigious method and call
        // it here.
        switch (this.direction) {
            case Direction.UP:
                if (this.position.y > this.target.y) {
                    this.position.y -= this.speed * interval;
                    this.color = '#0000FF';
                } else {
                    this.stop();
                }
                break;
            case Direction.DOWN:
                if (this.position.y < this.target.y) {
                    this.position.y += this.speed * interval;
                    this.color = '#0000FF';
                } else {
                    this.stop();
                }
                break;
            case Direction.LEFT:
                if (this.position.x > this.target.x) {
                    this.position.x -= this.speed * interval;
                    this.color = '#0000FF';
                } else {
                    this.stop();
                }
                break;
            case Direction.RIGHT:
                if (this.position.x < this.target.x) {
                    this.position.x += this.speed * interval;
                    this.color = '#0000FF';
                } else {
                    this.stop();
                }
                break;
        }
    }
    //console.log(this.position.y);
};
Character.prototype.move = function(direction) {
    if (!this.animating) {
        switch (direction) {
            case Direction.UP:
                this.target.y -= 16;
                break;
            case Direction.DOWN:
                this.target.y += 16;
                break;
            case Direction.LEFT:
                this.target.x -= 16;
                break;
            case Direction.RIGHT:
                this.target.x += 16;
                break;
        }

        this.direction = direction;
        this.animating = true;
    }
};
Character.prototype.stop = function() {
    this.color = '#FF0000';
    this.animating = false;
    this.elapsed = 0;
    this.frame = 0;
};

var GameMap = (function() {
    var self = {};

    var tiles;

    //var posCharX = 2;
    //var posCharY = 2;

    var player;
    var characters = {};


    /* Private
    /**********************************/
    var relativeX = function(position) {
        return (Game.center.x - player.position.x + (position * 64));
        //return (((position - posCharX - 0.5) * 64) + Game.center.x);
    };
    var relativeY = function(position) {
        return (Game.center.y - player.position.y + (position * 64));
        //return (((position - posCharY - 0.5) * 64) + Game.center.y);
    };


    /* Public
    /**********************************/
    self.init = function() {
        tiles = [
            [Resources.grass, Resources.stone, Resources.grass, Resources.stone, Resources.grass],
            [Resources.stone, Resources.grass, Resources.stone, Resources.grass, Resources.stone],
            [Resources.grass, Resources.stone, Resources.grass, Resources.stone, Resources.grass],
            [Resources.stone, Resources.grass, Resources.stone, Resources.grass, Resources.stone],
            [Resources.grass, Resources.stone, Resources.grass, Resources.stone, Resources.grass]
        ];

        player = new Character();
    };

    self.draw = function(context) {
        // Tiles
        for (var y = 0; y < tiles.length; y++) {
            for (var x = 0; x < tiles[y].length; x++) {
                context.drawImage(tiles[y][x], relativeX(x), relativeY(y));
            }
        }

        // Draw order will become important to fix.
        for (var character in characters) {
            // Character
            context.drawImage(Resources.character, relativeX(characters[character].x), relativeY(characters[character].y));

            // Character name
            context.fillStyle = '#FF0000';
            context.font = '16px Arial';
            //context.textAlign = 'center';
            context.fillText(character, relativeX(characters[character].x), relativeY(characters[character].y) - 16);
        }

        player.draw(context);
    };

    self.update = function(interval) {
        player.update(interval);
    };

    self.up = function() {
        //if (posCharY - 1 >= 0) {
            //posCharY -= 1;
            //Connection.send({ 'action': 'move', 'username': Cookie.get('username'), 'user': { 'x': posCharX, 'y': posCharY }});
        //}
        player.move(Direction.UP);
    };
    self.down = function() {
        //if (player.position.y + 1 < (tiles.length * 64)) {
            //posCharY += 1;
            //Connection.send({ 'action': 'move', 'username': Cookie.get('username'), 'user': { 'x': posCharX, 'y': posCharY }});
        //}
        player.move(Direction.DOWN);
    };
    self.left = function() {
        //if (posCharX -1 >= 0) {
        //    posCharX -= 1;
            //Connection.send({ 'action': 'move', 'username': Cookie.get('username'), 'user': { 'x': posCharX, 'y': posCharY }});
        ///}
        player.move(Direction.LEFT);
    };
    self.right = function() {
        //if (posCharX + 1 < tiles[posCharY].length) {
        //    posCharX += 1;
        console.log("Test");
            player.move(Direction.RIGHT);
            //Connection.send({ 'action': 'move', 'username': Cookie.get('username'), 'user': { 'x': posCharX, 'y': posCharY }});
        //}
    };

    self.activate = function() {
        document.addEventListener('keydown', keydown, true);
        document.addEventListener('keypress', keypress, true);
    };
    self.deactivate = function() {
        document.removeEventListener('keydown', keydown, true);
        document.removeEventListener('keypress', keypress, true);
    };

    var keydown = function(event) {
        switch(event.which) {
            case 87:
                self.up();
                break;

            case 83:
                self.down();
                break;

            case 65:
                self.left();
                break;

            case 68:
                self.right();
                break;
        }
    };
    var keypress = function(event) {
        switch(event.which) {
            case 13:
                Game.setState(State.CHAT);
                break;
        }
    };

    self.character = function(username, character) {
        characters[username] = character;
    };

    return self;
})();
