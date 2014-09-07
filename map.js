var Map = (function() {
    var self = {};

    var tiles;

    var posCharX = 2;
    var posCharY = 2;


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
        }
    };
    self.down = function() {
        if (posCharY + 1 < tiles.length) {
            posCharY += 1;
        }
    };
    self.left = function() {
        if (posCharX -1 >= 0) {
            posCharX -= 1;
        }
    };
    self.right = function() {
        if (posCharX + 1 < tiles[posCharY].length) {
            posCharX += 1;
        }
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
