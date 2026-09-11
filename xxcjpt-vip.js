var body = $response.body;
try {
    var obj = JSON.parse(body);
    if (obj.data) {
        obj.data.vip = 1;
        obj.data.is_vip = 1;
        obj.data.vip_status = 1;
        obj.data.vip_expire_time = "2027-09-11 23:59:59";
        obj.data.vip_expire = "2027-09-11";
        obj.data.expire_time = "2027-09-11 23:59:59";
        obj.data.expire = "2027-09-11";
    }
    body = JSON.stringify(obj);
} catch (e) {
    console.log("parse error: " + e.message);
}
$done({ body: body });
