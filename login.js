var Login = (function() {
    var self = {};
    var width = 364;
    var height = 120;

    var username = '';
    var status = '';

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

        context.fillText(username + '|', Game.center.x, (Game.center.y - height / 2 + 68));

        if (status) {
            context.fillText(status, Game.center.x, (Game.center.y - height / 2 + (68 + 4 + 16 + 16)));
        }
    };

    self.listener = function(event) {
        switch(event.which) {
            // Escape
            case 0:
                break;

            // Enter
            case 13:
                Connection.send({ 'action': 'login', 'username': username })
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

    self.received = function(data) {
        switch (data.status) {
            case 'success':
                Cookie.set('username', username);
                Chat.add('Welcome to Whatever Quest!');
                Game.setState(0);
                break;
            case 'exists':
                status = 'Username already taken.'
                break;
        }
    };

    return self;
})();
