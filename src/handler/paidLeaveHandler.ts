import {Const} from "../const/const";
import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

interface IPaidLeaveHandler{
    findRow(val:string,col:number):number;
    findColumn(val:string,col:number):number;

    updatePaidTimeSheet(paidDateTime:any):void;
    getBalancePaidLeave():string;
    copySheet(destSpreadSheet:any,sheetName:string);

    getPaidLeaveCurrentYear(joiningDate:string):number;
    updateCurrentYearPaidLeaveSheet(balancePaidLeave:number,paidLeaveCurrentYear:number,employeeName:string,year:string):void;
}

export class PaidLeaveHandler implements IPaidLeaveHandler {
    spreadSheet:Spreadsheet;
    sheet: Sheet; // SheetClass from GAS

    constructor(spreadSheet,sheet) {
        this.spreadSheet = spreadSheet;
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

    // 有給休暇の残日数取得(6,14で固定)
    getBalancePaidLeave = () => this.sheet.getRange(6, 14).getValue();

    // シートをコピーの内容をする
    copySheet = (destSpreadSheet,sheetName) => {
        // コピー処理
        const copySheet = destSpreadSheet.copyTo(this.spreadSheet);

        // リネーム
        copySheet.setName(sheetName);

        return copySheet;
    };

    // 勤続年数から今年度付与する日数を取得する
    getPaidLeaveCurrentYear = (joiningDate) => {
        let jd = new Date(joiningDate);
        let now = new Date();
        let ms = now.getTime() - jd.getTime();
        let serviceYears = Math.floor(ms / (1000*60*60*24*30.417));

        if(serviceYears > 0 && serviceYears < 6){
            return 0;
        }else if(serviceYears > 6 && serviceYears < 18){
            return 10;
        }else if(serviceYears > 18 && serviceYears < 30){
            return 11;
        }else if(serviceYears > 30 && serviceYears < 42){
            return 12;
        }else if(serviceYears > 42 && serviceYears < 54){
            return 14;
        }else if(serviceYears > 54 && serviceYears < 66){
            return 16;
        }else if(serviceYears > 66 && serviceYears < 78){
            return 18;
        }else{
            return 20;
        }
    };

    // 有給休暇シートの繰越分,本年度を更新
    updateCurrentYearPaidLeaveSheet = (balancePaidLeave,paidLeaveCurrentYear,employeeName,year) => {
        // 繰越分
        this.sheet.getRange(6, 8).setValue(balancePaidLeave);
        // 本年度
        this.sheet.getRange(6, 10).setValue(paidLeaveCurrentYear);
        // タイトル修正
        this.sheet.getRange(2,2).setValue(year + "年度 有給休暇管理表");
        // 名前修正
        this.sheet.getRange(6,5).setValue(employeeName);
    };
}
