var Connection = (function() {
    var socket;

    var open = function() {
        return (socket.readyState == 1);
    };

    var self = {};

    self.init = function() {
        socket = new WebSocket("ws://localhost:8765");

        socket.onerror = function(error) {
            console.log(error);
            console.log('Connection error.')
        };
        socket.onopen = function() {
            console.log('Connection opened.')
        };
        socket.onmessage = function (message) {
            Game.received(JSON.parse(message.data));
        };
        socket.onclose = function() {
            console.log("Connection closed.");
        };
    };

    self.send = function(data) {
        if (open()) {
            socket.send(JSON.stringify(data));
        }
    };

    return self;
})();
