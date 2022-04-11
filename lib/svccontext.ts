'use strict';
import {Request, Response, Next} from 'restify';

export class SvcContext {
    request: Request;
    response: Response;
    next: Next;
    // constructor
    constructor(req: Request, res: Response, next: Next) {
        // public, this instance copies
        this.request = req;
        this.response = res;
        this.next = next;
    };

    public completeResponse(jsObj) {
        this.response.send(200, jsObj);
        this.next();
    };

    public destroy() {
        this.request = null;
        this.response = null;
        this.next = null;
    };
}
