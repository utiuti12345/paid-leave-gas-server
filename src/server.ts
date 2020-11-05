import GasSheet from "./domain/gasSheet";
import {Const} from "./const/const";
import {PaidLeaveHandler} from "./handler/paidLeaveSheet";

function doGet(e) {
    let sheetName;
    const SHEETS = SpreadsheetApp.openById(Const.Sheet.SHEET_ID);
    let SHEET;
    if (e.parameter == undefined) {
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
        console.log("aaaaa");
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
    const params = JSON.parse(e.postData.getDataAsString());

    const SHEETS = SpreadsheetApp.openById(Const.Sheet.SHEET_ID);
    const employeeList = new GasSheet(SHEETS.getSheetByName(Const.Sheet.EMPLOYEE_LIST));
    const approveList = new GasSheet(SHEETS.getSheetByName(Const.Sheet.APPROVE_LIST));

    //const employeeData = employeeList.findWhere({name: params.employeeId});
    // const approveData = approveList.findWhere({id: params.approveId});
    //const handler = new PaidLeaveHandler();

    let output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    if (params.type === "default") {
        output.setContent(JSON.stringify({
            type: params.type,
            employeeList: employeeList,
            employeeData: "",
            approveList: approveList,
            approveData: "",
            paidLeave: params.paidLeave
        }));
    } else {
        output.setContent(JSON.stringify({
            type: params.type,
            employeeData: "",
            approveData: "",
            startDate: params.startDate,
            endDate: params.endDate
        }));
    }

    return output;
}