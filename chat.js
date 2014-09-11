var Chat = (function() {
    var log = [];
    var message = '';
    var self = {};

    self.add = function(string) {
        log.push(string);
    };

    self.draw = function(context) {
        context.font = '16px Arial';
        context.fillStyle = '#01579b';
        context.textAlign = 'left';

        var latest = log.length < 10 ? log : log.slice(log.length - 10);
        for (var i = 0; i < latest.length; i ++) {
            context.fillText(latest[i], 200, (200+(20*i)));
        }

        context.fillText(message, 200, 800);
    };

    self.listener = function(event) {
        switch(event.which) {
            // Escape
            case 0:
                message = '';
                Game.setState(2);
                break;

            // Enter
            case 13:
                self.add(message);
                message = '';
                Game.setState(2);
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

    return self;
})();
