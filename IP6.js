if ($response.statusCode != 200) {
  $done(Null);
}

var body = $response.body;
var obj = JSON.parse(body);

// 检测字符串中是否包含中文
function hasChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str);
}

// 对标题和副标题的处理
var title = obj['country'];
var regionName = hasChinese(obj['regionName']) ? obj['regionName'] : ""; 
var city = obj['city'] ? obj['city'] : "未知城市"; // 如果城市为空则显示“未知城市”
var isp = obj['isp'] ? obj['isp'] : "未知运营商"; // 如果ISP为空则显示“未知运营商”

// 构建副标题，处理可能的空值情况
var subtitle = [regionName, city, isp].filter(Boolean).join(' ');

// 获取IP地址
var ip = obj['query'];

// 构建详细描述信息
var description = [
  "国家" + ": " + obj['country'],
  "洲" + ": " + (regionName || "未知"),
  "城市" + ": " + city,
  "运营商" + ": " + isp,
  "数据中心" + ": " + (obj['org'] || "未知组织") // 如果org字段为空则显示“未知组织”
].join('\n');

$done({title, subtitle, ip, description});
