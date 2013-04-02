'use strict';
var SvcResponse = (function () {
    // private static
    var _svcStatusMsg = {200: "OK", 400: "Bad Request", 404: "Not Found"};

    // constructor
    var cls = function (code, message, fieldName, fieldValue) {
        // public, this instance copies
        this.status = {
            code: code,
            message: message || _svcStatusMsg[code],

            fieldName: fieldName,
            fieldValue: fieldValue
        };
    };

    cls.prototype.setStatus = function(code, message, fieldName, fieldValue) {
        this.status.code = code;
        this.status.message = message || _svcStatusMsg[code];
        this.status.fieldName = fieldName;
        this.status.fieldValue = fieldValue;
    };

    cls.prototype.destroy = function() {
        this.status = null;
    };

    return cls;
})();

module.exports = SvcResponse;