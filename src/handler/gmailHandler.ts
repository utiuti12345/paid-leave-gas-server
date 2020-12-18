interface IGmailHandler{
    sendMail(mailAddress:string,subject:string,plainBody:string,htmlBody:string):void;

    generateEmployeeBodies(employeeName:string,paidLeaveText:string,balancePaidLeave:string,spreadId:string):{plain:string,html:string};
    generateApproveBodies(employeeName:string,paidLeaveText:string):{plain:string,html:string};

    generateGrantPaidLeave(employeeName:string,balancePaidLeave:string,paidLeaveCurrentYear:string,spreadId:string):{plain:string,html:string};
}

export class GmailHandler implements IGmailHandler {
    sendMail = (mailAddress,subject,plainBody,htmlBody) => GmailApp.sendEmail(mailAddress, subject, plainBody,{ htmlBody:htmlBody });

    generateEmployeeBodies = (employeeName,paidLeaveText,balancePaidLeave,spreadId) => {
        let plain = '';
        plain += '有給休暇申請がありました。\n\n';
        plain += '・社員名: ' + employeeName + '\n';
        plain += '・取得日時: ' + paidLeaveText + '\n';
        plain += '・残り有給日数: ' +  balancePaidLeave + '\n';
        plain += '・有給確認シート: ' + 'https://docs.google.com/spreadsheets/d/' + spreadId + '\n';

        let html = '';
        html += '<h1>有給休暇申請のお知らせ</h1>';
        html += '<p>有給休暇申請がありました。</p>';
        html += '<ul>';
        html += '<li>社員名: ' + employeeName + '</li>';
        html += '<li>取得日時: ' + paidLeaveText + '</li>';
        html += '<li>残り有給日数: ' +  balancePaidLeave + '</li>';
        html += '<li>有給確認シート: ' + 'https://docs.google.com/spreadsheets/d/' + spreadId + '</li>';
        html += '</ul>';

        return {
            plain: plain,
            html: html
        };
    };

    generateApproveBodies = (employeeName,paidLeaveText) => {
        let plain = '';
        plain += '有給休暇申請がありました。\n\n';
        plain += '・社員名: ' + employeeName + '\n';
        plain += '・取得日時: ' + paidLeaveText + '\n';

        let html = '';
        html += '<h1>有給休暇申請のお知らせ</h1>';
        html += '<p>有給休暇申請がありました。</p>';
        html += '<ul>';
        html += '<li>社員名: ' + employeeName + '</li>';
        html += '<li>取得日時: ' + paidLeaveText + '</li>';
        html += '</ul>';

        return {
            plain: plain,
            html: html
        };
    };

    generateGrantPaidLeave = (employeeName,balancePaidLeave,paidLeaveCurrentYear,spreadId) => {
        let plain = '';
        plain += '有給休暇が付与されました。\n\n';
        plain += '・社員名: ' + employeeName + '\n';
        plain += '・付与日数: ' + paidLeaveCurrentYear + '\n';
        plain += '・繰越日数: ' + balancePaidLeave + '\n';
        plain += '・今年度有給日数: ' + (balancePaidLeave + paidLeaveCurrentYear) + '\n';
        plain += '・有給確認シート: ' + 'https://docs.google.com/spreadsheets/d/' + spreadId + '\n';


        let html = '';
        html += '<h1>有給休暇申請のお知らせ</h1>';
        html += '<p>有給休暇が付与されました。</p>';
        html += '<ul>';
        html += '<li>社員名: ' + employeeName + '</li>';
        html += '<li>付与日数: ' + paidLeaveCurrentYear + '</li>';
        html += '<li>繰越日数: ' + balancePaidLeave + '</li>';
        html += '<li>今年度有給日数: ' + (balancePaidLeave + paidLeaveCurrentYear) + '</li>';
        html += '<li>有給確認シート: ' + 'https://docs.google.com/spreadsheets/d/' + spreadId + '</li>';
        html += '</ul>';

        return {
            plain: plain,
            html: html
        };
    };
}