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
        self.character.src = 'character-sprite.png';
        self.character.onload = Loader.update;
    };

    return self;
})();
