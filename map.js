var Map = (function() {
    var self = {};

    var canvas;

    var offset = {};

    // TODO Make more dynamic.
    var width = 5 * 100;
    var height = 5 * 80;

    var tiles;

    var posCharX = 2;
    var posCharY = 2;


    /* Private
    /**********************************/
    var x = function(position) {
        return (position * 100) + offset.x;
    };
    var y = function(position) {
        return (position * 80) + offset.y;
    };


    /* Public
    /**********************************/
    self.init = function(c) {
        canvas = c;

        tiles = [
            [Resources.grass, Resources.stone, Resources.grass, Resources.stone, Resources.grass],
            [Resources.stone, Resources.grass, Resources.stone, Resources.grass, Resources.stone],
            [Resources.grass, Resources.stone, Resources.grass, Resources.stone, Resources.grass],
            [Resources.stone, Resources.grass, Resources.stone, Resources.grass, Resources.stone],
            [Resources.grass, Resources.stone, Resources.grass, Resources.stone, Resources.grass]
        ];

        self.resize();
    };

    self.draw = function(context) {
        // Tiles
        for (var a = 0; a < tiles.length; a++) {
            for (var b = 0; b < tiles[a].length; b++) {
                context.drawImage(tiles[a][b], x(b), y(a));
            }
        }

        // Character
        context.drawImage(Resources.character, x(posCharX), y(posCharY) - 40);

        // Character name
        context.fillStyle = '#FF0000';
        context.font = '16px Arial';
        context.fillText(Cookie.get('username'), 25 + x(posCharX), y(posCharY));
    };
    self.up = function() {
        if (posCharY - 1 >= 0) {
            offset.y += 80;
            posCharY -= 1;
        }
    };
    self.down = function() {
        if (posCharY + 1 < tiles.length) {
            offset.y -= 80;
            posCharY += 1;
        }
    };
    self.left = function() {
        if (posCharX -1 >= 0) {
            offset.x += 100;
            posCharX -= 1;
        }
    };
    self.right = function() {
        if (posCharX + 1 < tiles[posCharY].length) {
            offset.x -= 100;
            posCharX += 1;
        }
    };

    self.resize = function() {
        offset.x = Math.floor(canvas.width / 2) - Math.floor(width / 2);
        offset.y = Math.floor(canvas.height / 2) - Math.floor(height / 2) - 50;
    };

    self.listener = function(event) {
        console.log(event);
        switch(event.which) {
            case 87:
            //case 119:
                console.log("UP");
                Map.up();
                break;
            case 83:
            //case 115:
                console.log("DOWN");
                Map.down();
                break;
            case 65:
            //case 97:
                console.log("LEFT");
                Map.left();
                break;
            case 68:
            //case 100:
                console.log("RIGHT");
                Map.right();
                break;
            //case 13:
            case 84:
                event.stopPropagation();
                Game.setState(3);
                console.log("ENTER");
                break;
        }
    }

    return self;
})();