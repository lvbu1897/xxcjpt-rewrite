// UTF-8 安全的 Base64 编解码，不依赖 btoa/atob（QX 环境兼容）
function b64Decode(str) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = '';
    str = String(str).replace(/[^A-Za-z0-9+/]/g, '');
    for (var bc = 0, bs, buffer, idx = 0; buffer = str.charAt(idx++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        buffer = chars.indexOf(buffer);
    }
    return decodeURIComponent(escape(output));
}

function b64Encode(str) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var input = unescape(encodeURIComponent(str));
    var output = '';
    for (var i = 0; i < input.length; i += 3) {
        var b1 = input.charCodeAt(i) & 0xff;
        var b2 = i + 1 < input.length ? input.charCodeAt(i + 1) & 0xff : NaN;
        var b3 = i + 2 < input.length ? input.charCodeAt(i + 2) & 0xff : NaN;
        output += chars.charAt(b1 >> 2);
        output += chars.charAt(((b1 & 3) << 4) | (isNaN(b2) ? 0 : b2 >> 4));
        output += isNaN(b2) ? '=' : chars.charAt(((b2 & 15) << 2) | (isNaN(b3) ? 0 : b3 >> 6));
        output += isNaN(b3) ? '=' : chars.charAt(b3 & 63);
    }
    return output;
}

// 非ASCII字符转 \uXXXX 转义，保持和原始格式一致
function escapeUnicode(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (code > 127) {
            result += '\\u' + ('0000' + code.toString(16)).slice(-4);
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}

var body = $response.body;

try {
    console.log("xxcjpt 原始body长度: " + body.length);

    var reversed = body.split('').reverse().join('');
    var decoded = b64Decode(reversed);
    var obj = JSON.parse(decoded);
    var hasData = obj.data ? "是" : "否";
    console.log("xxcjpt JSON解析成功, data是否存在: " + hasData);

    if (obj.data) {
        console.log("xxcjpt 修改前 vip=" + obj.data.vip + " exp=" + obj.data.exp + " fullvideo=" + obj.data.fullvideo + " today_left=" + obj.data.today_left);
        obj.data.vip = 1;
        obj.data.is_vip = 1;
        obj.data.vip_status = 1;
        obj.data.exp = false;
        obj.data.vip_expire_time = "2027-12-31 23:59:59";
        obj.data.vip_expire = "2027-12-31";
        obj.data.expire_time = "2027-12-31 23:59:59";
        obj.data.expire = "2027-12-31";
        obj.data.expdate = "2027-12-31";
        // /java/show/ 接口特有：完整视频权限 + 观看次数
        if (obj.data.fullvideo !== undefined) obj.data.fullvideo = true;
        if (obj.data.today_max !== undefined) obj.data.today_left = obj.data.today_max;
        console.log("xxcjpt 修改后 vip=" + obj.data.vip + " exp=" + obj.data.exp + " fullvideo=" + obj.data.fullvideo + " today_left=" + obj.data.today_left);
    }

    // 重新编码：JSON.stringify -> 转义非ASCII -> Base64 -> 反转
    var newJson = escapeUnicode(JSON.stringify(obj));
    var newB64 = b64Encode(newJson);
    var newBody = newB64.split('').reverse().join('');
    console.log("xxcjpt 最终body长度: " + newBody.length);

    $done({ body: newBody });
} catch (e) {
    console.log("xxcjpt error: " + e.message);
    $done({ body: body });
}
