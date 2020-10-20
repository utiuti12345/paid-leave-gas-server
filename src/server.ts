function doGet(e) {
    let sheetName = 'employee_list';
    if(e.parameter == undefined){
        sheetName = 'employee_list';
    }else if(e.parameter.sheet == "employee_list"){
        sheetName = 'employee_list';
    }else if(e.parameter.sheet == "approve_list"){
        console.log(e.parameter);
        sheetName = 'approve_list';
    }

    const data = getData('1DlOSTwbJAquJP4uWeqbow_qgAuxTAPMv8L8-VcfwZj0', sheetName);
    var responseText;
    const out = ContentService.createTextOutput();
    const callback = e.parameter.callback;
    if (callback) {
        responseText = callback + "(" + JSON.stringify(data) + ")";
        //Mime Typeをapplication/javascriptに設定
        out.setMimeType(ContentService.MimeType.JAVASCRIPT);

    } else {
        responseText = JSON.stringify(data);
        //Mime Typeをapplication/jsonに設定
        out.setMimeType(ContentService.MimeType.JSON);
        console.log("aaaaa");
    }
    //JSONPテキストをセットする
    out.setContent(responseText);

    return out;
}

function getData(id, sheetName) {
    var sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
    console.log(sheet);
    var rows = sheet.getDataRange().getValues();
    var keys = rows.splice(0, 1)[0];
    return rows.map(function(row) {
        var obj = {}
        row.map(function(item, index) {
            obj[keys[index]] = item;
        });
        return obj;
    });
}

function doPost(e) {
    var params = JSON.parse(e.postData.getDataAsString());
    console.log(params);

    let output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    if(params.type === "default"){
        output.setContent(JSON.stringify({ type: params.type,employeeId:params.employeeId,approveId:params.approveId, paidLeave:params.paidLeave }));
    }else{
        output.setContent(JSON.stringify({ type: params.type,employeeId:params.employeeId,approveId:params.approveId, startDate:params.startDate,endDate:params.endDate }));
    }

    return output;
}