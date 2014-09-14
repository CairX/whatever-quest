var Connection = (function() {
    var socket;
    var status = '';

    var open = function() {
        return (socket.readyState == 1);
    };

    var self = {};

    self.init = function() {
        socket = new WebSocket("ws://localhost:8765");

        socket.onopen = function() {
            console.log('Connection opened.');
            status = 'Connection opened.';
            Game.setState(State.LOGIN);
        };
        socket.onmessage = function (message) {
            Game.received(JSON.parse(message.data));
        };
        socket.onclose = function() {
            console.log('Connection closed.');
            status = "Connection closed.";
            Game.setState(State.CONNECTION);
        };
        socket.onerror = function(error) {
            console.log(error);
            console.log('Connection error.');
            status = 'Connection error.';
        };
    };

    self.send = function(data) {
        if (open()) {
            socket.send(JSON.stringify(data));
        }
    };

    self.draw = function(context) {
        context.font = '48px Arial';
        context.fillStyle = '#e91e63';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(status, Game.center.x, Game.center.y);
    };

    return self;
})();
