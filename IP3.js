if ($response.statusCode != 200) {
  $done(Null);
}

var body = $response.body;
var obj = JSON.parse(body);

function hasChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str);
}

var title = obj['country'];
var regionName = hasChinese(obj['regionName']) ? obj['regionName'] : ""; 
var subtitle = regionName + ' ' + obj['city'] + ' ' + obj['isp'];
var ip = obj['query'];
var description = "国家" + ":" + obj['country'] + '\n' + 
                  "洲" + ":" + regionName + '\n' + 
                  "城市" + ":" + obj['city'] + '\n' + 
                  "运营商" + ":" + obj['isp'] + '\n' + 
                  "数据中心" + ":" + obj['org'];

$done({title, subtitle, ip, description});