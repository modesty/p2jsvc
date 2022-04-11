'use strict';
import log from "npmlog";

type Status = {
    code: number;
    message: string;
    fieldName?: string;
    fieldValue?: any;
}

export class SvcResponse {
    private static readonly _svcStatusMsg = {200: "OK", 400: "Bad Request", 404: "Not Found"};
    public status: Status;
    constructor(code: number, message: string, fieldName?: string, fieldValue?: any) {
        this.status = {
            code: code,
            message: message || SvcResponse._svcStatusMsg[code],
            fieldName: fieldName,
            fieldValue: fieldValue
        }
    }

    public setStatus(code: number, message: string, fieldName: string, fieldValue: string) {
        this.status.code = code;
        this.status.message = message || SvcResponse._svcStatusMsg[code];
        this.status.fieldName = fieldName;
        this.status.fieldValue = fieldValue;
    };

    public destroy() {
        this.status = null;
    };
};
