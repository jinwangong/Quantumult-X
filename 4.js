if ($response.statusCode != 200) {
    $done(null);
}

var body = $response.body;
var obj = JSON.parse(body);

// 转换国家代码为旗帜emoji
function countryCodeToFlag(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

// 格式化标题
var flag = countryCodeToFlag(obj['countryCode']);
var title = flag + " " + obj['country'] + " " + obj['regionName'] + " " + obj['city'];

// 格式化副标题
var subtitle = obj['timezone'].split('/').pop().replace(/_/g, ' ') + ' · ' + 
               (obj['as'].split(' ')[1] || obj['isp']) + ' · ' + 
               obj['query'];

var ip = obj['query'];

// 格式化描述
var description = "-----------------------------------" + '\n\n' +
                 obj['country'] + " " + obj['regionName'] + " " + obj['city'] + '\n\n' +
                 obj['timezone'] + '\n\n' +
                 obj['query'] + '\n\n' +
                 "Longitude:" + obj['lon'] + "  " + "Latitude:" + obj['lat'] + '\n\n' +
                 obj['isp'] + '\n\n' + 
                 obj['org'];

$done({title, subtitle, ip, description});
