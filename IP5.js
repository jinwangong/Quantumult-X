if ($response['statusCode'] != 200) {  
  $done(null);  
}  

function containsChinese(text) {  
  const regex = /[\u4E00-\u9FA5]+/;  
  return regex.test(text);  
}  

function replaceFlag(text) {  
  const codePoints = text.split('').map(char => 0x1F1A5 + char.charCodeAt(0));  
  const flag = String.fromCodePoint(...codePoints);  
  return flag === '🇹🇼' ? '🇨🇳' : flag;  
}  

function combineTexts(text1, text2) {  
  const regex = /\ or\ /g;  
  if (text1.match(regex)) text1 = '';  
  if (text1 === text2) text1 = '';  
  return text1 && text2 ? `${text1} ${text2}` : text1 || text2;  
}  

function simplifyText(primary, secondary) {  
  const regex = /\ or\ /g;  
  if (primary.match(regex)) primary = '';  
  if (primary === secondary) primary = '';  
  return primary && secondary ? `${primary}  ${secondary}` : primary || secondary;  
}  

function modifyLocation(country) {  
  if (country === '中华民国' || country === '中華民國') {  
    return '台湾';  
  } else if (country === '中国') {  
    return '';  
  } else {  
    return country;  
  }  
}  

$done({ responseBody: modifiedData });
