// 脚本功能：xxcjpt 去会员限制 + 去广告
// 参考：https://github.com/WeiGiegie/666/blob/main/elskl.js
// 使用声明：仅供学习交流，请勿滥用

// ============ 工具函数 ============
function reverseStr(s) { return String(s).split('').reverse().join(''); }

function base64Decode(input) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var str = String(input).replace(/=+$/, '');
    var binaryStr = '';
    if (str.length % 4 === 1) throw new Error('Invalid base64');
    for (var bc = 0, bs, buffer, idx = 0; (buffer = str.charAt(idx++)); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? binaryStr += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        buffer = chars.indexOf(buffer);
    }
    return binaryStr;
}

function base64Encode(input) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var str = String(input);
    var output = '';
    for (var block, charCode, idx = 0, map = chars; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = str.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) throw new Error("'btoa' failed");
        block = block << 8 | charCode;
    }
    return output;
}

// 非 ASCII 字符转义回 \\uXXXX，保持整个字符串是纯 ASCII
function stringifyASCII(obj) {
    var s = JSON.stringify(obj);
    return s.replace(/[\x7f-￿]/g, function (c) {
        return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
    });
}

// ============ 解码：密文 → JSON ============
function decodeBody(body) {
    var trimmed = String(body).trim();

    // 明文直接解析（容错）
    if (trimmed.charAt(0) === '{' || trimmed.charAt(0) === '[') {
        console.log('[xxcjpt] 明文响应');
        return JSON.parse(trimmed);
    }

    // 1) 整体反转
    var rev = reverseStr(trimmed);

    // 2) 若反转后开头有 '='，搬到末尾（兼容保留 padding 的服务端）
    var pad = '';
    while (rev.charAt(0) === '=') { pad += '='; rev = rev.slice(1); }

    // 3) 清洗：URL-safe → 标准
    rev = rev.replace(/-/g, '+').replace(/_/g, '/').replace(/[^A-Za-z0-9+/]/g, '');

    // 4) 补回 padding
    rev = rev + pad;
    while (rev.length % 4 !== 0) rev += '=';

    // 5) Base64 → UTF-8 → JSON
    var bin = base64Decode(rev);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder('utf-8').decode(bytes));
}

// ============ 编码：JSON → 密文 ============
function encodeBody(jsonData, originalBody) {
    var trimmed = String(originalBody).trim();
    if (trimmed.charAt(0) === '{' || trimmed.charAt(0) === '[') {
        return JSON.stringify(jsonData);
    }

    var text = stringifyASCII(jsonData);
    var bytes = new TextEncoder().encode(text);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);

    var b64 = base64Encode(bin).replace(/=+$/, '');  // 去 padding
    return reverseStr(b64);                          // 整体反转
}

// ============ 主逻辑 ============
var url = $request.url;
var body = $response.body;

var jsonData;
try {
    jsonData = decodeBody(body);
} catch (e) {
    console.log('[xxcjpt] 解码失败，放行: ' + e.message);
    $done({});
}

if (jsonData && jsonData.data) {

    // ---------- 个人页面 ----------
    if (url.indexOf('/java/user/my') !== -1) {
        jsonData.data.vip = 1;
        jsonData.data.exp = false;
        jsonData.data.expdate = "2099.09.09";
        jsonData.data.unclaimed = 999;
        jsonData.data.today_max = 999;
        jsonData.data.today_left = 999;
        jsonData.data.money = "9999.00";
        jsonData.data.feedback_unread = 0;
    }

    // ---------- 播放页面 ----------
    else if (url.indexOf('/java/show/') !== -1) {
        jsonData.data.fullvideo = true;
        jsonData.data.today_max = 999;
        jsonData.data.today_left = 999;
        jsonData.data.vip = 1;
        jsonData.data.exp = false;

        if (jsonData.data.video) {
            jsonData.data.video.free = true;
            jsonData.data.video.unlock = true;
        }

        if (Array.isArray(jsonData.data.guess)) {
            for (var i = 0; i < jsonData.data.guess.length; i++) {
                jsonData.data.guess[i].free = true;
                jsonData.data.guess[i].unlock = true;
            }
        }

        // ---------- 播放广告 ----------
        jsonData.data.popup = null;
        jsonData.data.banner = [];
        jsonData.data.button = [];
    }
}

$done({ body: encodeBody(jsonData, body) });
