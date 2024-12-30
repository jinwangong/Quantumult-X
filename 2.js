if ($response.statusCode != 200) {
  $done(null);
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
  return countryCode.toUpperCase().replace(/./g, char => 
    String.fromCodePoint(127397 + char.charCodeAt())
  );
}

// 提取主要字段
var country = obj['country'];
var countryCode = obj['countryCode']; // 国家代码
var regionName = obj['regionName'] || ""; // 洲名称（无需检测中文）
var city = obj['city'];
var continent = obj['continent'];
var isp = obj['isp'] || "未知 ISP";
var ip = obj['query']; // IP 地址

// 判断标题的组合逻辑
var flag = getFlagEmoji(countryCode); // 国旗 Emoji
var titleParts = [flag, country]; // 初始化标题部分

// 添加洲信息（若和国家重复则忽略）
if (regionName && regionName !== country) {
  titleParts.push(regionName); // 添加洲（带中文）
}

// 添加城市信息（若和洲重复则忽略）
if (city && city !== regionName && city !== country) {
  titleParts.push(city);
}

// 构建标题
var title = titleParts.filter(Boolean).join(" ");

// 构建副标题：区域名称、ISP 和 IP 地址
var subtitle = [regionName, isp, ip].filter(Boolean).join(" · ");

// 构建详细描述
var description = [
  "国家: " + country,
  "洲: " + (regionName || "未知"),
  "城市: " + (city || "未知"),
  "ISP: " + isp,
  "ORG: " + (obj['org'] || "未知组织")
].join("\n");

$done({title, subtitle, ip, description});
