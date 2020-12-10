import {GmailHandler} from "./gmailHandler";
import {PaidLeaveHandler} from "./paidLeaveHandler";

export class Handler {
    paidLeaveHandler:PaidLeaveHandler;
    gmailHandler:GmailHandler;

    constructor(paidLeaveHandler,gmailHandler){
        this.paidLeaveHandler = paidLeaveHandler;
        this.gmailHandler = gmailHandler;
    }
}