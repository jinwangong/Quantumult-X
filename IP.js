if ($response.statusCode != 200) {
  $done(null);
}

var body = $response.body;
var obj = JSON.parse(body);


function getFlag(countryCode) {
  const codePoints = countryCode.toUpperCase().split('').map(char => 
    0x1F1A5 + char.charCodeAt()
  );
  if (String.fromCodePoint(...codePoints) == '🇹🇼') {
    return '🇨🇳';
  }
  return String.fromCodePoint(...codePoints);
}


var title = getFlag(obj.countryCode) + " " + obj.country;
if (obj.regionName && obj.regionName !== obj.country) {
  title += " " + obj.regionName;
}
if (obj.city && obj.city !== obj.regionName) {
  title += " " + obj.city;
}


var subtitle = obj.timezone.replace(/(\_|\-)/g, ' ');
if (obj.as) {
  subtitle += " · " + obj.as.split(' ')[0];
}
subtitle += " · " + obj.query;


var ip = obj.query;


var description = "-----------------------------------\n\n";
description += obj.country;
if (obj.regionName && obj.regionName !== obj.country) {
  description += " " + obj.regionName;
}
if (obj.city && obj.city !== obj.regionName) {
  description += " " + obj.city;
}
description += "\n\n" + obj.timezone;
description += "\n\n" + obj.query;
description += "\n\n" + "经度:" + obj.lon + "  " + "纬度:" + obj.lat;
description += "\n\n" + obj.isp;
if (obj.org && obj.org !== obj.isp) {
  description += "\n\n" + obj.org;
}

$done({
  title: title,
  subtitle: subtitle, 
  ip: ip,
  description: description
});
