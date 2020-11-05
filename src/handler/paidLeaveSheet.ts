import {IPaidLeaveHandler} from './handler';
import {Const} from "../const/const";

export class PaidLeaveHandler implements IPaidLeaveHandler{
    sheet: any; // SheetClass from GAS

    constructor(sheet) {
        this.sheet = sheet;
    }

    findRow = (val, col) => {
        const lastRow = this.sheet.getDataRange().getLastRow(); //対象となるシートの最終行を取得
        for (let i = 1; i <= lastRow; i++) {
            if (this.sheet.getRange(i, col).getValue() === val) {
                return i;
            }
        }
        return 0;
    };

    findColumn = (val, row) => {
        const lastColumn = this.sheet.getDataRange().getLastColumn(); //対象となるシートの最終列を取得
        for (let i = 1; i <= lastColumn; i++) {
            if (this.sheet.getRange(row, i).getValue() === val) {
                return i;
            }
        }
        return 0;
    };

    updatePaidTimeSheet = (paidDateTime) => {
        const date = new Date(paidDateTime);
        const row = this.findRow((date.getMonth() + 1) + "月", 2);
        const col = this.findColumn(date.getDate(), 8);
        this.sheet.getRange(row, col).setValue(Const.PaidStatus.DIGE1STION);
    };
}