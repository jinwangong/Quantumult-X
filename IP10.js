// 中文
// geo_location_checker=http://ip-api.com/json/?lang=zh-CN, https://raw.githubusercontent.com/I-am-R-E/Functional-Store-Hub/Master/GeoLocationChecker/QuantumultX/IP-API.js

// 英文
// geo_location_checker=http://ip-api.com/json/, https://raw.githubusercontent.com/I-am-R-E/Functional-Store-Hub/Master/GeoLocationChecker/QuantumultX/IP-API.js

// Only QX
// Version 1.3
// Telegram频道 https://t.me/Functional_Store_Hub
// Taiwanese flag becomes Chinese flag

if ($response['statusCode'] != 200) {
  $done(null);
}

function isChinese(text) {
  return /[\u4E00-\u9FA5]+/.test(text);
}

function replaceFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 0x1f1a5 + char.charCodeAt());
  return String.fromCodePoint(...codePoints) === '🇹🇼' ? '🇨🇳' : String.fromCodePoint(...codePoints);
}

function combineLocation(city, region) {
  if (city === region || !isChinese(region)) return city || region || '';
  return city && region ? `${city} ${region}` : city || region;
}

// 示例逻辑展示最终输出格式
const countryCode = "US"; // ISO国家代码
const countryName = "美国"; // 国家名称
const regionName = "纽约州"; // 区域
const city = "水牛城"; // 城市
const isp = "AS36352"; // ISP名称
const ip = "107.175.57.184"; // IP地址

const flag = replaceFlag(countryCode);
const title = `${flag} ${countryName} ${regionName} ${city}`;
const subtitle = `${regionName.toUpperCase()} · ${isp} · ${ip}`;

console.log(`标题：${title}`);
console.log(`副标题：${subtitle}`);
