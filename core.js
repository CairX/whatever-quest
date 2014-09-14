var State = {
    PLAYING: 0,
    CHAT: 1,
    LOGIN: 2,
    CONNECTION: 3,
    MAP: 4,
    LOADER: 5
};

var Game = (function() {
    var state;
    var canvas;
    var context;

    var self = {};
    self.size = { width: 0, height: 0 };
    self.center = { x: 0, y: 0 };

    var resize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        self.size.width = canvas.width;
        self.size.height = canvas.height;

        self.center.x = Math.floor(canvas.width / 2);
        self.center.y = Math.floor(canvas.height / 2);
    };

    self.init = function() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        canvas.style.backgroundColor = "#b3e5fc";
        window.onresize = resize;
        resize();

        // Display message asking for name if not set.
        Cookie.set('username', 'cairns');
        Resources.init();
        Connection.init();

        // Want a draw loop that considers execution time for smoother effect.
        window.setInterval(self.run, 33);
    };

    self.run = function() {
        switch(state) {
            case State.PLAYING:
            case State.CHAT:
                context.clearRect(0, 0, canvas.width, canvas.height);
                Map.draw(context);
                Chat.draw(context);
                break;

            case State.LOGIN:
                context.clearRect(0, 0, canvas.width, canvas.height);
                Login.draw(context);
                break;

            case State.CONNECTION:
                context.clearRect(0, 0, canvas.width, canvas.height);
                Connection.draw(context);
                break;

            case State.MAP:
                Map.init(canvas);
                self.setState(State.PLAYING);
                break;

            case State.LOADER:
                if (Loader.done()) {
                    self.setState(State.MAP);
                }
                break;
        }
    };

    self.setState = function(s) {
        switch(s) {
            case State.PLAYING:
                Chat.deactivate();
                Map.activate();
                break;

            case State.CHAT:
                Map.deactivate();
                Chat.activate();
                break;

            case State.LOGIN:
                Login.activate();
                break;

            case State.LOADER:
                Login.deactivate();
                break;
        }
        state = s;
    };

    self.received = function(data) {
        console.log(data);
        switch (data.action) {
            case 'move':
                Map.character(data.username, data.user);
                break;

            case 'chat':
                Chat.received(data);
                break;

            case 'login':
                Login.received(data);
                break;

            case 'connected':
                Chat.add(data.username, 'Has connected.');
                break;
        }
    };

    return self;
})();

window.addEventListener('load', Game.init);
