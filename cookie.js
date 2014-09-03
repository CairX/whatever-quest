var Cookie = (function () {
    var self = {};

    self.set = function (name, value) {
        document.cookie = name + '=' + value + ';';
    };

    self.get = function (name) {
        name += '=';
        var s = document.cookie;

        var i = s.indexOf(name);
        if (i > -1) {
            i += name.length;
            s = s.substring(i);
            if (s.indexOf(';') > -1) {
                s = s.substring(0, s.indexOf(';'));
            }
            return s;
        } else {
            return null;
        }
    };

    self.has = function (name) {
        return (self.get(name) != null);
    };

    self.remove = function (name) {
        document.cookie = name + '=;';
    };

    return self;
})();
