import {GasSheet, EmployeeList, ApproveList} from "./domain/gasSheet";
import {Const} from "./const/const";
import {PaidLeaveHandler} from "./handler/paidLeaveHandler";
import {GmailHandler} from "./handler/gmailHandler";
import {Handler} from "./handler/handler";
import PaidLeaveDate from "./domain/paidLeaveDate";

function doGet(e) {
    let sheetName;
    const SHEETS = SpreadsheetApp.openById(Const.Sheet.MST_SHEET_ID);
    let SHEET;
    if (e === undefined || e.parameter == undefined) {
        sheetName = Const.Sheet.EMPLOYEE_LIST;
    } else if (e.parameter.sheet == Const.Sheet.EMPLOYEE_LIST) {
        sheetName = Const.Sheet.EMPLOYEE_LIST;
    } else if (e.parameter.sheet == Const.Sheet.APPROVE_LIST) {
        console.log(e.parameter);
        sheetName = Const.Sheet.APPROVE_LIST;
    }

    SHEET = SHEETS.getSheetByName(sheetName);
    const gasSheet = new GasSheet(SHEET);
    let responseText;
    const out = ContentService.createTextOutput();
    const callback = e.parameter.callback;
    if (callback) {
        responseText = callback + "(" + JSON.stringify(gasSheet.data) + ")";
        //Mime Typeをapplication/javascriptに設定
        out.setMimeType(ContentService.MimeType.JAVASCRIPT);

    } else {
        responseText = JSON.stringify(gasSheet.data);
        //Mime Typeをapplication/jsonに設定
        out.setMimeType(ContentService.MimeType.JSON);
    }
    //JSONPテキストをセットする
    out.setContent(responseText);

    return out;
}

function getData(id, sheetName) {
    let sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
    console.log(sheet);
    const rows = sheet.getDataRange().getValues();
    const keys = rows.splice(0, 1)[0];
    return rows.map(function (row) {
        let obj = {};
        row.map(function (item, index) {
            obj[keys[index]] = item;
        });
        return obj;
    });
}

function doPost(e) {
    try{
        const params = JSON.parse(e.postData.getDataAsString());

        const SHEETS = SpreadsheetApp.openById(Const.Sheet.MST_SHEET_ID);
        const employeeList = new EmployeeList(SHEETS.getSheetByName(Const.Sheet.EMPLOYEE_LIST));
        const approveList = new ApproveList(SHEETS.getSheetByName(Const.Sheet.APPROVE_LIST));

        const employeeData = employeeList.findById(params.employeeId);
        const approveData = approveList.findById(params.approveId);

        const year = params.year;

        const spreadSheet = SpreadsheetApp.openById(employeeData.spread_id);
        const paidLeaveSheet = spreadSheet.getSheetByName(year);

        let pls = new PaidLeaveHandler(spreadSheet,paidLeaveSheet);
        const g = new GmailHandler();
        let handler = new Handler(pls,g);

        if(params.type === Const.Mode.UPDATE_PAID_LEAVE_SHEET){
            try{
                const balancePaidLeave = handler.paidLeaveHandler.getBalancePaidLeave();
                const paidLeaveCurrentYear = handler.paidLeaveHandler.getPaidLeaveCurrentYear(employeeData.joining_date);

                const nextYear = params.nextYear;
                const templateSheet = SpreadsheetApp.openById(Const.Sheet.TEMPLATE_SHEET_ID).getSheetByName(Const.Sheet.FORMAT);
                const copySheet = handler.paidLeaveHandler.copySheet(templateSheet,nextYear.toString());

                // 新しく作成した有給申請シートを更新するので、再宣言
                pls = new PaidLeaveHandler(spreadSheet,copySheet);
                handler = new Handler(pls,g);

                handler.paidLeaveHandler.updateCurrentYearPaidLeaveSheet(balancePaidLeave,paidLeaveCurrentYear,employeeData.name,nextYear);
                const body = handler.gmailHandler.generateGrantPaidLeave(employeeData.name,balancePaidLeave,paidLeaveCurrentYear,employeeData.spread_id);
                handler.gmailHandler.sendMail(employeeData.mail_address,Const.Gmail.SUBJECT,body.plain,body.html);

            }catch(error){
                return ContentService.createTextOutput(`エラー発生 ${error}`);
            }

            return ContentService.createTextOutput(employeeData.name + "の有給休暇申請シートの更新に成功しました。");
        }

        let output = ContentService.createTextOutput();
        output.setMimeType(ContentService.MimeType.JSON);

        const paidLeave = [];

        let paidLeaveText = '';
        params.paidLeave.map((it) => {
            if (it !== undefined && it !== null) {
                const paidLeaveDate = new PaidLeaveDate(it);
                if (!(paidLeaveDate.isHoliday() || paidLeaveDate.isWeekend())) {
                    handler.paidLeaveHandler.updatePaidTimeSheet(paidLeaveDate.getDateString());
                    paidLeave.push(it);

                    paidLeaveText += it + " ";
                }
            }
        });

        // 申請者に送る
        const balancePaidLeave = handler.paidLeaveHandler.getBalancePaidLeave();
        const body = handler.gmailHandler.generateEmployeeBodies(employeeData.name,paidLeaveText,balancePaidLeave,employeeData.spread_id);
        handler.gmailHandler.sendMail(employeeData.mail_address,Const.Gmail.SUBJECT,body.plain,body.html);

        // 承認者に送る
        handler.gmailHandler.sendMail(approveData.mail_address,Const.Gmail.SUBJECT,body.plain,body.html);

        output.setContent(JSON.stringify({
            type: params.type,
            employeeData: employeeData,
            approveData: approveData,
            paidLeave: paidLeave,
        }));

        return output;
    }catch (error) {
        // エラー処理は後ほど
        return ContentService.createTextOutput(`エラー発生 ${error}`);
    }
}
