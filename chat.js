var Chat = (function() {
    var log = [];
    var message = '';
    var active = false;

    var displayed = 10;
    var textHeight = 12;
    var padding = 4;

    var height = function(position) {
        return ((textHeight + padding * 2) * position);
    };

    var vertical = function(position) {
        return ((Game.size.height - height(displayed + 1)) + height(position));
    };

    var textVertical = function(position) {
        return (vertical(position) + padding);
    };

    var textHorizontal = function(position) {
        return (position + padding);
    };

    var self = {};

    self.add = function(username, string) {
        log.push({ 'username': username, 'message': string });
    };

    self.draw = function(context) {
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, vertical(0), 400, height(displayed));

        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(0, vertical(displayed), 400, height(1));

        context.font = textHeight + 'px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'left';
        context.textBaseline = 'top';

        var latest = log.length < displayed ? log : log.slice(log.length - displayed);
        for (var i = 0; i < latest.length; i ++) {
            var m = '[' + latest[i].username + ']: ' + latest[i].message;
            context.fillText(m, textHorizontal(0), textVertical(i));
        }

        if (active) {
            context.fillText(message + '|', textHorizontal(0), textVertical(displayed));
        }
    };

    self.activate = function() {
        active = true;
        document.addEventListener('keypress', self.listener, true);
    };
    self.deactivate = function() {
        active = false;
        document.removeEventListener('keypress', self.listener, true);
    };

    self.listener = function(event) {
        switch(event.which) {
            // Escape
            case 0:
                message = '';
                Game.setState(State.PLAYING);
                break;

            // Enter
            case 13:
                Connection.send({ 'action': 'chat', 'username': Cookie.get('username'), 'chat': message });
                message = '';
                Game.setState(State.PLAYING);
                break;

            // Backspace
            case 8:
                message = message.substring(0, (message.length - 1));
                break;

            default:
                console.log(event);
                message += String.fromCharCode(event.charCode);
                event.stopPropagation();
                break;
        }
    };

    self.received = function(data) {
        self.add(data.username, data.chat);
    };

    return self;
})();
