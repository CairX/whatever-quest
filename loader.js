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
        self.progress += 1;
        console.log("Loaded: " + self.progress);
    }

    return self;
})();
