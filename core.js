
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

window.addEventListener('load', function() {

    var STATE = 0;

    var canvas = document.getElementById('canvas');
    canvas.style.backgroundColor = "#000000";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    Cookie.set('username', 'cairns');
    Resources.init();

    var loop = function() {
        // TODO Place the most common call at the top and least common at the bottom.
        switch(STATE) {
            case 0:
                if (Loader.done()) {
                    STATE = 1;
                }
                break;
            case 1:
                Map.init(canvas);
                // TODO Maybe possible to make some better timing with the redraw.
                // TODO Move to it's own function.
                // TODO Map resize and canvas resize might not bee needed to be called at the same time. For exampel if the user resizes while resources are beeing loaded.
                window.onresize = function() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    Map.resize();
                };
                STATE = 2;
                break;
            case 2:
                Map.draw();
                break;
        }
    };
    // Want a draw loop that considers execution time for more stable
    window.setInterval(loop, 33);

    document.addEventListener('keydown', function(e) {
        switch(e.keyCode) {
            case 87:
                console.log("UP");
                Map.up();
                break;
            case 83:
                console.log("DOWN");
                Map.down();
                break;
            case 65:
                console.log("LEFT");
                Map.left();
                break;
            case 68:
                console.log("RIGHT");
                Map.right();
                break;
        }
    });
});

// TODO Implement call of the position.
/*
var ws = new WebSocket("ws://localhost:8765");
ws.onopen = function() {
    // Web Socket is connected, send data using send()
    ws.send("Cairns");
    console.log("Message is sent...");
};
ws.onmessage = function (evt) {
    var received_msg = evt.data;
    console.log("Message is received...");
    console.log("MESSAGE: " + received_msg);
};
ws.onclose = function() {
    // websocket is closed.
    console.log("Connection is closed...");
};
*/

