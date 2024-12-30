if ($response.statusCode != 200) {
  $done(Null);
}

var body = $response.body;
var obj = JSON.parse(body);

// 检测字符串中是否包含中文
function hasChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str);
}

// 获取国家对应的 Emoji 国旗
function getFlagEmoji(countryCode) {
  if (!countryCode) return ""; // 如果没有国家代码，返回空字符串
  // 将国家代码转换为 Unicode 码点
  return countryCode.toUpperCase().replace(/./g, char => 
    String.fromCodePoint(127397 + char.charCodeAt())
  );
}

// 处理标题（包括国旗）
var country = obj['country'];
var countryCode = obj['countryCode']; // 通常返回 ISO 国家代码，如 "CN"、"US"
var flag = getFlagEmoji(countryCode); // 动态生成国旗 Emoji
var title = flag + " " + country; // 标题中显示国旗和国家名称

// 处理副标题和其他信息
var regionName = hasChinese(obj['regionName']) ? obj['regionName'] : ""; 
var city = obj['city'] ? obj['city'] : "未知城市"; // 如果城市为空则显示“未知城市”
var isp = obj['isp'] ? obj['isp'] : "未知运营商"; // 如果ISP为空则显示“未知运营商”
var subtitle = [regionName, city, isp].filter(Boolean).join(' '); // 副标题拼接

// 获取 IP 地址
var ip = obj['query'];

// 构建详细描述
var description = [
  "国家" + ": " + country,
  "洲" + ": " + (regionName || "未知"),
  "城市" + ": " + city,
  "运营商" + ": " + isp,
  "数据中心" + ": " + (obj['org'] || "未知组织") // 如果 org 字段为空则显示“未知组织”
].join('\n');

$done({title, subtitle, ip, description});
