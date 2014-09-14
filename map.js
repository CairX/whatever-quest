var Map = (function() {
    var self = {};

    var tiles;

    var posCharX = 2;
    var posCharY = 2;

    var characters = {};


    /* Private
    /**********************************/
    var relativeX = function(position) {
        return (((position - posCharX - 0.5) * 100) + Game.center.x);
    };
    var relativeY = function(position) {
        return (((position - posCharY - 0.5) * 80) + Game.center.y) - 50;
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
    };

    self.draw = function(context) {
        // Tiles
        for (var y = 0; y < tiles.length; y++) {
            for (var x = 0; x < tiles[y].length; x++) {
                context.drawImage(tiles[y][x], relativeX(x), relativeY(y));
            }
        }

        // Draw order will become important to fix.
        for (character in characters) {
            // Character
            context.drawImage(Resources.character, relativeX(characters[character].x), relativeY(characters[character].y) - 40);

            // Character name
            context.fillStyle = '#FF0000';
            context.font = '16px Arial';
            //context.textAlign = 'center';
            context.fillText(character, relativeX(characters[character].x), relativeY(characters[character].y));
        }

        // Character
        context.drawImage(Resources.character, relativeX(posCharX), relativeY(posCharY) - 40);

        // Character name
        context.fillStyle = '#FF0000';
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillText(Cookie.get('username'), Game.center.x, relativeY(posCharY));
    };

    self.up = function() {
        if (posCharY - 1 >= 0) {
            posCharY -= 1;
            Connection.send({ 'action': 'move', 'username': Cookie.get('username'), 'user': { 'x': posCharX, 'y': posCharY }});
        }
    };
    self.down = function() {
        if (posCharY + 1 < tiles.length) {
            posCharY += 1;
            Connection.send({ 'action': 'move', 'username': Cookie.get('username'), 'user': { 'x': posCharX, 'y': posCharY }});
        }
    };
    self.left = function() {
        if (posCharX -1 >= 0) {
            posCharX -= 1;
            Connection.send({ 'action': 'move', 'username': Cookie.get('username'), 'user': { 'x': posCharX, 'y': posCharY }});
        }
    };
    self.right = function() {
        if (posCharX + 1 < tiles[posCharY].length) {
            posCharX += 1;
            Connection.send({ 'action': 'move', 'username': Cookie.get('username'), 'user': { 'x': posCharX, 'y': posCharY }});
        }
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
                Map.up();
                break;

            case 83:
                Map.down();
                break;

            case 65:
                Map.left();
                break;

            case 68:
                Map.right();
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
