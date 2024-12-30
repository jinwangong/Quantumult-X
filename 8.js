if ($response.statusCode != 200) {
    $done(null);
}

var body = $response.body;
var obj = JSON.parse(body);

// 检测字符串中是否包含中文
function hasChinese(str) {
    if (!str) return false;
    return /[\u4e00-\u9fa5]/.test(str);
}

// 获取国家对应的 Emoji 国旗，台湾特殊处理
function getFlagEmoji(countryCode) {
    if (!countryCode) return ""; 
    // 如果是台湾，返回中国国旗
    if (countryCode.toUpperCase() === 'TW') {
        return "🇨🇳";
    }
    return countryCode.toUpperCase().replace(/./g, char => 
        String.fromCodePoint(127397 + char.charCodeAt())
    );
}

// 提取主要字段
var country = obj['country'];
var countryCode = obj['countryCode'];
var regionName = obj['regionName'];
var city = obj['city'];
var isp = obj['isp'] || "未知 ISP";
var org = obj['org'] || "未知组织";
var asn = obj['asname'] || "";
var ip = obj['query'];

// 构建标题
var flag = getFlagEmoji(countryCode);
var titleParts = [flag];

// 只添加包含中文的部分
if (hasChinese(country)) {
    titleParts.push(country);
}
if (hasChinese(regionName) && regionName !== country) {
    titleParts.push(regionName);
}
if (hasChinese(city) && city !== regionName && city !== country) {
    titleParts.push(city);
}

// 如果没有任何中文部分，则添加英文部分
if (titleParts.length === 1) {  // 只有国旗
    if (country) titleParts.push(country);
    if (regionName && regionName !== country) titleParts.push(regionName);
    if (city && city !== regionName && city !== country) titleParts.push(city);
}

var title = titleParts.filter(Boolean).join(" ");

// 构建简化后的副标题：只显示 ISP 和 IP
var isp_name = asn.split(' ')[1] || isp;
var subtitle = [isp_name, ip].filter(Boolean).join(" · ");

// 构建描述
var description = "-----------------------------------" + "\n\n" +
                 "国家: " + country + "\n" +
                 "地区: " + (regionName || "未知") + "\n" +
                 "城市: " + (city || "未知") + "\n" + 
                 "ISP: " + isp + "\n" +
                 "数据中心: " + org + "\n" +
                 "经纬度: " + obj['lat'] + ", " + obj['lon'];

$done({title, subtitle, ip, description});
