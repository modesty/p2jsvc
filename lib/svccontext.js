'use strict';
var SvcContext = (function () {
    // constructor
    var cls = function (req, res, next) {
        // public, this instance copies
        this.req = req;
        this.res = res;
        this.next = next;
    };

    cls.prototype.completeResponse = function(jsObj) {
        this.res.send(200, jsObj);
        this.next();
    };

    cls.prototype.destroy = function() {
        this.req = null;
        this.res = null;
        this.next = null;
    };

    return cls;
})();

module.exports = SvcContext;
