'use strict';

var nodeUtil = require("util"),
    restify = require('restify'),
    _ = require('underscore'),
    SvcResponse = require('./svcresponse'),
    SvcContext = require("./svccontext"),
    PFParser = require("pdf2json");

var PDFFORMService = (function () {
    // private static
    var _nextId = 1;
    var _name = 'PDFFORMServer';
    var _pdfPathBase = "";

    // constructor
    var cls = function () {
        // private, only accessible within this constructor
        var _id = _nextId++;
		var _version = "0.0.1";

        // public (every instance will have their own copy of these methods, needs to be lightweight)
        this.get_id = function() { return _id; };
        this.get_name = function() { return _name + _id; };
        this.get_version = function() {return _version; };
    };

    // public static
    cls.get_nextId = function () {
        return _name + _nextId;
    };

    //private
    var _onPFBinDataReady = function(evtData) {
        var resData = new SvcResponse(200, "OK", evtData.pdfFilePath, "FormImage JSON");
        resData.formImage = evtData.data;
        evtData.context.completeResponse(resData);

        evtData.destroy();
        evtData = null;
    };

    var _onPFBinDataError = function(evtData){
        nodeUtil.log(this.get_name() + " 500 Error: " +  JSON.stringify(evtData.data));
        evtData.context.completeResponse(new SvcResponse(500, JSON.stringify(evtData.data)));

        evtData.destroy();
        evtData = null;
    };

    var _customizeHeaders = function(res) {
        // Resitify currently has a bug which doesn't allow you to set default headers
        // This headers comply with CORS and allow us to server our response to any origin
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Cache-Control", "no-cache, must-revalidate");
    };

    // public (every instance will share the same method, but has no access to private fields defined in constructor)
    cls.prototype.start = function () {
        var self = this;

        //private function within this public method

        var _gfilter = function(svcContext) {
            var req = svcContext.req;
            var folderName = req.params.folderName;
            var pdfId = req.params.pdfId;
            nodeUtil.log(self.get_name() + " resceived request:" + req.method + ":" + folderName + "/" + pdfId);

            var pdfParser = new PFParser(svcContext);

            _customizeHeaders.call(this, svcContext.res);

            pdfParser.on("pdfParser_dataReady", _.bind(_onPFBinDataReady, self));
            pdfParser.on("pdfParser_dataError", _.bind(_onPFBinDataError, self));

            pdfParser.loadPDF(_pdfPathBase + folderName + "/" + pdfId + ".pdf");
        };

        var server = restify.createServer({
            name: self.get_name(),
            version: self.get_version()
        });

        server.use(restify.acceptParser(server.acceptable));
        server.use(restify.authorizationParser());
        server.use(restify.dateParser());
        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        server.use(restify.jsonp());
        server.use(restify.gzipResponse());
        server.pre(restify.pre.userAgentConnection());

        server.get('/pdfform/:folderName/:pdfId', function(req, res, next) {
            _gfilter(new SvcContext(req, res, next));
        });

        server.post('/pdfform', function(req, res, next) {
            _gfilter(new SvcContext(req, res, next));
        });

        server.get('/pdfform/status', function(req, res, next) {
            var jsObj = new SvcResponse(200, "OK", server.name, server.version);
            res.send(200, jsObj);
            return next();
        });

        server.listen(8001, function() {
            nodeUtil.log(nodeUtil.format('%s listening at %s', server.name, server.url));
        });
    };

    return cls;
})();

module.exports = new PDFFORMService();



