var Connection = (function() {
    var socket;

    var self = {};

    self.init = function() {
        socket = new WebSocket("ws://localhost:8765");

        socket.onopen = function() {
            console.log('Connection opened.')
        };
        socket.onmessage = function (evt) {
            var received_msg = evt.data;
            console.log("MESSAGE: " + received_msg);
            var data = JSON.parse(received_msg);
            console.log(data);
            console.log(data.action);
            Game.received(data);
        };
        socket.onclose = function() {
            console.log("Connection closed.");
        };
    };

    self.send = function(data) {
        socket.send(JSON.stringify(data));
    };

    return self;
})();
