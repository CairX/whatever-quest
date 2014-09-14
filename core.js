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

        self.setState(5);

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

            case 5:
                context.clearRect(0, 0, canvas.width, canvas.height);
                Connection.draw(context);
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
                Chat.deactivate();
                document.addEventListener('keydown', Map.listener, true);
                break;
            case 3:
                console.log('THREE');
                document.removeEventListener('keydown', Map.listener, true);
                Chat.activate();
                break;
            case 4:
                document.addEventListener('keypress', Login.listener, true);
                break;
        }
        state = s;
    };

    self.received = function(data) {
        console.log(data);
        switch (data.action) {
            case 'login':
                Login.received(data);
                break;
            case 'chat':
                Chat.received(data);
                break;
            case 'connected':
                Chat.add(data.username, 'Has connected.');
                break;
            case 'move':
                Map.character(data.username, data.user);
                break;
        }
    };

    return self;
})();

window.addEventListener('load', Game.init);
