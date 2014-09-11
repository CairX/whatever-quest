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
            //Game.received(data);
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




var Login = (function() {
    var self = {};
    var width = 364;
    var height = 120;

    var username = '';

    self.draw = function (context) {
        context.fillStyle = '#e1f5fe';
        context.fillRect((Game.center.x - width / 2), (Game.center.y - height / 2), width, height);

        context.fillStyle = 'white';
        context.fillRect((Game.center.x - 300 / 2), (Game.center.y - height / 2 + 64), 300, 24);

        context.font = '16px Arial';
        context.fillStyle = '#01579b';
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText('Username', Game.center.x, (Game.center.y - height / 2 + 32));

        context.fillText(username + '|', Game.center.x, ((Game.center.y - height / 2 + 68)));
    };

    self.listener = function(event) {
        switch(event.which) {
            // Escape
            case 0:
                break;

            // Enter
            case 13:
                Connection.send({ 'action': 'login', 'username': username })
                Cookie.set('username', username);
                Chat.add('Welcome to Whatever Quest!');
                Game.setState(0);
                break;

            // Backspace
            case 8:
                username = username.substring(0, (username.length - 1));
                break;

            default:
                console.log(event);
                username += String.fromCharCode(event.charCode);
                event.stopPropagation();
                break;
        }
    };

    return self;
})();

var Game = (function() {
    var state;
    var canvas;
    var context;


    var self = {};
    self.size = { width: 0, height: 0 };
    self.center = { x: 0, y: 0 };

    self.init = function() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        canvas.style.backgroundColor = "#b3e5fc";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        self.size.width = canvas.width;
        self.size.height = canvas.height;

        self.center.x = Math.floor(canvas.width / 2);
        self.center.y = Math.floor(canvas.height / 2);

        // Display message asking for name if not set.
        Cookie.set('username', 'cairns');
        Resources.init();
        Connection.init();

        self.setState(4);

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

                    self.size.width = canvas.width;
                    self.size.height = canvas.height;

                    self.center.x = Math.floor(canvas.width / 2);
                    self.center.y = Math.floor(canvas.height / 2);
                };
                self.setState(2);
                break;
            case 2:
                context.clearRect(0, 0, canvas.width, canvas.height);
                Map.draw(context);
                Chat.draw(context);

                /*context.beginPath();
                context.moveTo(self.center.x, 0);
                context.lineTo(self.center.x, canvas.height);
                context.closePath();
                context.stroke();

                context.beginPath();
                context.moveTo(0, self.center.y);
                context.lineTo(canvas.width, self.center.y);
                context.closePath();
                context.stroke();*/

                break;
            case 3:
                context.clearRect(0, 0, canvas.width, canvas.height);
                Map.draw(context);
                Chat.draw(context);
                break;

            case 4:
                context.clearRect(0, 0, canvas.width, canvas.height);
                Login.draw(context);
                break;
        }
    };

    self.setState = function(s) {
        switch(s) {
            case 0:
                document.removeEventListener('keypress', Login.listener, true);
                break;
            case 2:
                console.log('TWO');
                document.removeEventListener('keypress', Chat.listener, true);
                document.addEventListener('keydown', Map.listener, true);
                break;
            case 3:
                console.log('THREE');
                document.removeEventListener('keydown', Map.listener, true);
                document.addEventListener('keypress', Chat.listener, true);
                break;
            case 4:
                document.addEventListener('keypress', Login.listener, true);
                break;
        }
        state = s;
    };

    self.received = function(data) {

    };

    return self;
})();

window.addEventListener('load', Game.init);

// TODO Implement call of the position.



