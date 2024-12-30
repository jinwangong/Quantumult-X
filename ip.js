if ($response.statusCode != 200) {
    $done(null);
}

var body = $response.body;
var obj = JSON.parse(body);

function hasChinese(str) {
    if (!str) return false;
    return /[\u4e00-\u9fa5]/.test(str);
}

function getFlagEmoji(countryCode) {
    if (!countryCode) return ""; 
    if (countryCode.toUpperCase() === 'TW') {
        return "🇨🇳";
    }
    return countryCode.toUpperCase().replace(/./g, char => 
        String.fromCodePoint(127397 + char.charCodeAt())
    );
}

var country = obj['country'];
var countryCode = obj['countryCode'];
var regionName = obj['regionName'];
var city = obj['city'];
var timezone = obj['timezone'];
var isp = obj['isp'] || "未知 ISP";
var org = obj['org'] || "未知组织";
var asn = obj['as'] || "";
var ip = obj['query'];

var flag = getFlagEmoji(countryCode);
var titleParts = [flag];

if (hasChinese(country)) {
    titleParts.push(country);
}
if (hasChinese(regionName) && regionName !== country) {
    titleParts.push(regionName);
}
if (hasChinese(city) && city !== regionName && city !== country) {
    titleParts.push(city);
}

if (titleParts.length === 1) {
    if (country) titleParts.push(country);
    if (regionName && regionName !== country) titleParts.push(regionName);
    if (city && city !== regionName && city !== country) titleParts.push(city);
}

var title = titleParts.filter(Boolean).join(" ");
var timezone_name = timezone.split('/').pop().replace(/_/g, ' ');
var isp_name = asn.split(' ')[1] || isp;
var subtitle = [timezone_name, isp_name, ip].filter(Boolean).join(" · ");

var description = "-----------------------------------" + "\n\n" +
                 "国家: " + country + "\n" +
                 "地区: " + (regionName || "未知") + "\n" +
                 "城市: " + (city || "未知") + "\n" + 
                 "ISP: " + isp + "\n" +
                 "数据中心: " + org + "\n" +
                 "经纬度: " + obj['lat'] + ", " + obj['lon'];

$done({title, subtitle, ip, description});
