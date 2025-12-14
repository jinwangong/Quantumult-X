let url = "http://ip-api.com/json";

$httpClient.get(url, function(error, response, data) {
    if (error || response.status != 200) {
        $done(null);
        return;
    }
    
    let obj = JSON.parse(data);
    
    // 检查字符串是否包含中文
    function hasChinese(str) {
        if (!str) return false;
        return /[\u4e00-\u9fa5]/.test(str);
    }
    
    // 获取国旗 emoji
    function getFlagEmoji(countryCode) {
        if (!countryCode) return ""; 
        if (countryCode.toUpperCase() === 'TW') {
            return "🇨🇳";
        }
        return countryCode.toUpperCase().replace(/./g, char => 
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }
    
    let country = obj['country'];
    let countryCode = obj['countryCode'];
    let regionName = obj['regionName'];
    let city = obj['city'];
    let timezone = obj['timezone'];
    let isp = obj['isp'] || "未知 ISP";
    let org = obj['org'] || "未知组织";
    let asn = obj['as'] || "";
    let ip = obj['query'];
    let flag = getFlagEmoji(countryCode);
    
    // 构建标题（优先显示中文地名）
    let titleParts = [flag];
    if (hasChinese(country)) {
        titleParts.push(country);
    }
    if (hasChinese(regionName) && regionName !== country) {
        titleParts.push(regionName);
    }
    if (hasChinese(city) && city !== regionName && city !== country) {
        titleParts.push(city);
    }
    
    // 如果没有中文地名，则使用英文
    if (titleParts.length === 1) {
        if (country) titleParts.push(country);
        if (regionName && regionName !== country) titleParts.push(regionName);
        if (city && city !== regionName && city !== country) titleParts.push(city);
    }
    
    let title = titleParts.filter(Boolean).join(" ");
    
    // 构建副标题（ISP 和 IP）
    let isp_name = asn.split(' ')[1] || isp;
    
    // 构建详细内容
    let content = "-----------------------------------\n\n" +
                  "国家: " + country + "\n" +
                  "地区: " + (regionName || "未知") + "\n" +
                  "城市: " + (city || "未知") + "\n" + 
                  "ISP: " + isp + "\n" +
                  "数据中心: " + org + "\n" +
                  "经纬度: " + obj['lat'] + ", " + obj['lon'] + "\n\n" +
                  "IP地址: " + ip + "\n" +
                  "运营商: " + isp_name;
    
    let body = {
        title: title,
        content: content,
        icon: "globe.asia.australia.fill"
    };
    
    $done(body);
});
