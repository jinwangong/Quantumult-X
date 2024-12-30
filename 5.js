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
    if (!countryCode) return ""; 
    return countryCode.toUpperCase().replace(/./g, char => 
        String.fromCodePoint(127397 + char.charCodeAt())
    );
}

// 提取主要字段
var country = obj['country'];
var countryCode = obj['countryCode'];
var regionName = obj['regionName'];
var city = obj['city'];
var timezone = obj['timezone'];
var isp = obj['isp'] || "未知 ISP";
var org = obj['org'] || "未知组织";
var asn = obj['as'] || "";
var ip = obj['query'];

// 构建标题
var flag = getFlagEmoji(countryCode);
var titleParts = [flag];

// 添加国家
if (country) titleParts.push(country);

// 添加地区（如果与国家不同）
if (regionName && regionName !== country) {
    titleParts.push(regionName);
}

// 添加城市（如果与地区和国家不同）
if (city && city !== regionName && city !== country) {
    titleParts.push(city);
}

var title = titleParts.filter(Boolean).join(" ");

// 构建副标题
var timezone_name = timezone.split('/').pop().replace(/_/g, ' ');
var isp_name = asn.split(' ')[1] || isp;
var subtitle = [timezone_name, isp_name, ip].filter(Boolean).join(" · ");

// 构建描述
var description = "-----------------------------------" + "\n\n" +
                 "国家: " + country + "\n" +
                 "地区: " + (regionName || "未知") + "\n" +
                 "城市: " + (city || "未知") + "\n" + 
                 "ISP: " + isp + "\n" +
                 "数据中心: " + org + "\n" +
                 "经纬度: " + obj['lat'] + ", " + obj['lon'];

$done({title, subtitle, ip, description});
