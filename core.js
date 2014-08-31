var Cookie = (function () {
    var self = {};

    self.set = function (name, value) {
        document.cookie = name + '=' + value + ';';
    };

    self.get = function (name) {
        name += '=';
        var s = document.cookie;

        var i = s.indexOf(name);
        if (i > -1) {
            i += name.length;
            s = s.substring(i);
            if (s.indexOf(';') > -1) {
                s = s.substring(0, s.indexOf(';'));
            }
            return s;
        } else {
            return null;
        }
    };

    self.has = function (name) {
        return (self.get(name) != null);
    };

    self.remove = function (name) {
        document.cookie = name + '=;';
    };

    return self;
})();

var Loader = (function() {
    var self = {};
    self.progress = 0;
    self.end = 0;

    self.add = function(value) {
        self.end += value;
    };

    self.done = function() {
        return (self.progress == self.end);
    };

    self.update = function() {
        console.log("LOADER UPDATE");
        self.progress += 1;
    }

    return self;
})();

var Resources = (function() {
    var self = {};

    // TODO Make this more dynamic.
    self.init = function() {
        Loader.add(3);

        self.grass = new Image();
        self.grass.src = 'grass.png';
        self.grass.onload = Loader.update;

        self.stone = new Image();
        self.stone.src = 'stone.png';
        self.stone.onload = Loader.update;

        self.character = new Image();
        self.character.src = 'character.png';
        self.character.onload = Loader.update;
    };

    return self;
})();

var Map = (function() {
    var self = {};

    var canvas;
    var context;

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
        context = canvas.getContext('2d');

        tiles = [
            [Resources.grass, Resources.stone, Resources.grass, Resources.stone, Resources.grass],
            [Resources.stone, Resources.grass, Resources.stone, Resources.grass, Resources.stone],
            [Resources.grass, Resources.stone, Resources.grass, Resources.stone, Resources.grass],
            [Resources.stone, Resources.grass, Resources.stone, Resources.grass, Resources.stone],
            [Resources.grass, Resources.stone, Resources.grass, Resources.stone, Resources.grass]
        ];

        self.resize();
    };

    self.draw = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var a = 0; a < tiles.length; a++) {
            for (var b = 0; b < tiles[a].length; b++) {
                context.drawImage(tiles[a][b], x(b), y(a));
            }
        }

        context.drawImage(Resources.character, x(posCharX), y(posCharY) - 40);

        /*context.beginPath();
        context.moveTo(xCenter, 0);
        context.lineTo(xCenter, canvas.height);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(0, yCenter);
        context.lineTo(canvas.width, yCenter);
        context.closePath();
        context.stroke();*/
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

    return self;
})();

window.addEventListener('load', function() {

    var canvas = document.getElementById('canvas');
    canvas.style.backgroundColor = "#000000";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    Resources.init();
    Map.init(canvas);

    if (Cookie.has('username') && Loader.done()) {

    }



    //var context = canvas.getContext('2d');

    //context.fillStyle = "#00FF00";
    //context.fillRect(10, 10, 10, 10);

    //console.log(window.innerWidth + " x " + window.innerHeight);

    /*grass.onload = function() {

        console.log(grass.height);

        for (var y = 0; y < (canvas.height - 175); y += (grass.height - 90)) {
            for (var x = 0; x < canvas.width; x += grass.width) {
                context.drawImage(grass, x, y);
            }
        }
        //context.drawImage(grass, 100, 100)
        //context.drawImage(grass, 150, 200)
        //context.drawImage(grass, 50, 50)
    };*/
    /*var grass = new Image();
    grass.src = 'grass.png';
    var stone = new Image();
    stone.src = 'stone.png';
    var character = new Image();
    character.src = 'character.png';*/


    console.log(Map);
    Map.draw();

    document.addEventListener('keydown', function(e) {
        switch(e.keyCode) {
            case 87:
                console.log("UP");
                Map.up();
                Map.draw();
                break;
            case 83:
                console.log("DOWN");
                Map.down();
                Map.draw();
                break;
            case 65:
                console.log("LEFT");
                Map.left();
                Map.draw();
                break;
            case 68:
                console.log("RIGHT");
                Map.right();
                Map.draw();
                break;
        }
    });
});


