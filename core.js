
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

var Message = (function() {
    var message = '';
    var self = {};

    self.draw = function(context) {
        context.font = '16px Arial';
        context.fillStyle = '#0000FF';
        context.fillText(message, 200, 200);
    };

    self.listener = function(e) {
        switch(e.which) {
            case 13:
                message = '';
                Game.setState(2);
                break;

            case 8:
                message = message.substring(0, (message.length - 1));
                break;

            default:
                console.log(e);
                message += String.fromCharCode(e.charCode);
                e.stopPropagation();
                break;
        }
    };

    return self;
})();

var Game = (function() {
    var state = 0;
    var canvas;
    var context;

    var self = {};

    self.init = function() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        canvas.style.backgroundColor = "#000000";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Display message asking for name if not set.
        Cookie.set('username', 'cairns');
        Resources.init();

        // Want a draw loop that considers execution time for smoother effect.
        window.setInterval(self.run, 33);
    };

    self.run = function() {
        // TODO Place the most common call at the top and least common at the bottom.
        switch(state) {
            case 0:
                if (Loader.done()) {
                    self.setState(1);
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
                self.setState(2);
                break;
            case 2:
                Map.draw();
                break;
            case 3:
                Map.draw();
                Message.draw(context);
                break;
        }
    };

    self.setState = function(s) {
        switch(s) {
            case 2:
                console.log('TWO');
                document.removeEventListener('keypress', Message.listener, true);
                document.addEventListener('keydown', Map.listener, true);
                break;
            case 3:
                console.log('THREE');
                document.removeEventListener('keydown', Map.listener, true);
                document.addEventListener('keypress', Message.listener, true);
                break;
        }
        state = s;
    };

    return self;
})();

window.addEventListener('load', Game.init);

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

