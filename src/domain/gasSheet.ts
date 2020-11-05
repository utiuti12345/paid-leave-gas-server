export default class GasSheet {
    sheet: any; // SheetClass from GAS
    columns: { columnNum: number; name: string }[]
    data: {}[];
    constructor(sheet) {
        this.sheet = sheet;
        const rawColumns: any[] = sheet
            .getRange(1, 1, 1, sheet.getLastColumn())
            .getValues()[0];
        const columns: { columnNum: number; name: string }[] = [];
        rawColumns.forEach((dataOfColumn, idx) => {
            columns.push({ columnNum: idx + 1, name: dataOfColumn })
        });
        const rawData: any[][] = sheet
            .getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn())
            .getValues();
        const data: {}[] = [];
        rawData.forEach((dataOfRow, idx) => {
            const obj = { rowNum: idx + 1 + 1 }; // 行番号は1スタート + HEADERの行
            columns.forEach((column, i) => {
                obj[column.name] = dataOfRow[i]
            });
            data.push(obj)
        });
        this.columns = columns;
        this.data = data;
    }
}