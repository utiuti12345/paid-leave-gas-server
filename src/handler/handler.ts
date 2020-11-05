class Handler{
    paidLeaveHandler:any;

    constructor(paidLeaveHandler){
        this.paidLeaveHandler = paidLeaveHandler;
    }
}

export interface IPaidLeaveHandler{
    findRow(string,number):number;
    findColumn(string,number):number;

    updatePaidTimeSheet(any):void;
}