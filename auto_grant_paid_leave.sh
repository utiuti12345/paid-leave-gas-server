#bin/sh

#
# 自動で次年度の有給休暇申請のシートを作成するシェルスクリプト
# curl で特定のパラメーターで送信する

curl -L -H 'Content-Type:application/json' -d '{"mode":"update_paid_leave_sheet", "employeeId":3, "approveId":1, "year":2020, "nextYear":2021}' $API_URL
curl -L -H 'Content-Type:application/json' -d '{"type":"update_paid_leave_sheet", "employeeId":5, "approveId":1, "year":2020, "nextYear":2021}' $API_URL

