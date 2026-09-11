function b64Decode(str) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = '';
    str = String(str).replace(/[=]+$/, '');
    for (var bc = 0, bs, buffer, idx = 0; buffer = str.charAt(idx++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        buffer = chars.indexOf(buffer);
    }
    return output;
}

var body = $response.body;

try {
    // 1. 先反转字符串
    var reversed = body.split('').reverse().join('');

    // 2. Base64 解码
    var decoded = b64Decode(reversed);

    // 3. 解析 JSON
    var obj = JSON.parse(decoded);

    if (obj.data) {
        obj.data.vip = 1;
        obj.data.is_vip = 1;
        obj.data.vip_status = 1;
        obj.data.exp = false;
        obj.data.vip_expire_time = "2027-12-31 23:59:59";
        obj.data.vip_expire = "2027-12-31";
        obj.data.expire_time = "2027-12-31 23:59:59";
        obj.data.expire = "2027-12-31";
        obj.data.expdate = "2027-12-31";
    }

    // 4. 重新编码回去：JSON → Base64 → 反转
    var newJson = JSON.stringify(obj);
    var newB64 = btoa(newJson);
    var newBody = newB64.split('').reverse().join('');

    $done({ body: newBody });
} catch (e) {
    console.log("xxcjpt error: " + e.message);
    $done({ body: body });
}
