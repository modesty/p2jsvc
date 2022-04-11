'use strict';
import log from "npmlog";
import { plugins, pre, createServer, Response } from "restify";
import { SvcContext } from './svccontext';
import { SvcResponse } from './svcresponse';
import PDFParser, { PDFDataReady, PDFFormImage, PDFParserError } from 'pdf2json';


export class PDFFORMService {
    // private static
    private static _nextId = 1;
    private static _name = 'PDFFORMServer';
    private static _pdfPathBase = "";

    get_id: () => number;
    get_name: () => string;
    get_version: () => string;

    // constructor
    constructor() {
        // private, only accessible within this constructor
        let _id = PDFFORMService._nextId++;
        let _name = PDFFORMService._name;
	    const _version = "0.0.1";

        // public (every instance will have their own copy of these methods, needs to be lightweight)
        this.get_id = function() { return _id; };
        this.get_name = function() { return _name + _id; };
        this.get_version = function() {return _version; };
    };

    // public static
    public static get_nextId() {
        return this._name + this._nextId;
    };

    //private
    private _onPFBinDataReady(context: SvcContext , evtData: PDFFormImage) {
        log.info(this.get_name(), " completed response.");
        var resData = new SvcResponse(200, "OK", "data", evtData);
        context.completeResponse(resData);
        resData.destroy();
        evtData = null;
        return context.next();
    };

    private _onPFBinDataError(context: SvcContext, error: PDFParserError) {
        log.info(this.get_name() + " 500 Error: ",  JSON.stringify(error));
        var resData = new SvcResponse(500, JSON.stringify(error), undefined, undefined)
        context.completeResponse(resData);
        resData.destroy();
        resData = null;
        return context.next();
    };

    _customizeHeaders(res: Response) {
        // Resitify currently has a bug which doesn't allow you to set default headers
        // This headers comply with CORS and allow us to server our response to any origin
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Cache-Control", "no-cache, must-revalidate");
    };

    // public (every instance will share the same method, but has no access to private fields defined in constructor)
    start() {
        //private function within this public method
        const version = this.get_version();
        const _gfilter = (svcContext: SvcContext) => {
            var req = svcContext.request;
            var folderName = req.params.folderName;
            var pdfId = req.params.pdfId;
            log.info(this.get_name(), " received request:" + req.method + ":" + folderName + "/" + pdfId);

            var pdfParser = new PDFParser();

            this._customizeHeaders(svcContext.response);
        
            pdfParser.on("pdfParser_dataReady", (data: PDFFormImage) => this._onPFBinDataReady(svcContext, data));
            pdfParser.on("pdfParser_dataError", (error: PDFParserError) => this._onPFBinDataError(svcContext, error));

            pdfParser.loadPDF(PDFFORMService._pdfPathBase + folderName + "/" + pdfId + ".pdf", 0);
        };

        const server = createServer({
            name: this.get_name(),
            version: this.get_version()
        });

        server.use(plugins.acceptParser(server.acceptable));
        server.use(plugins.authorizationParser());
        server.use(plugins.dateParser());
        server.use(plugins.queryParser());
        server.use(plugins.bodyParser());
        server.use(plugins.jsonp());
        server.use(plugins.gzipResponse());
        server.pre(pre.userAgentConnection());

        server.get('/p2jsvc/:folderName/:pdfId', function(req, res, next) {
            _gfilter(new SvcContext(req, res, next));
        });

        server.post('/p2jsvc', function(req, res, next) {
            _gfilter(new SvcContext(req, res, next));
        });

        server.get('/p2jsvc/status', function(req, res, next) {
            var jsObj = new SvcResponse(200, "OK", server.name, version);
            res.send(200, jsObj);
            return next();
        });

        server.listen(7799, function() {
            log.info(server.name, ' listening at ' + server.url);
        });
    };
};



