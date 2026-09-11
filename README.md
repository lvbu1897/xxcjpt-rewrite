# xxcjpt-rewrite

存放 Quantumult X 重写配置，用于 sixth.xxcjpt.com 的会员状态修改。

## 使用方法（本地）

1. 把 `xxcjpt-vip.js` 放进 QX 的 Scripts 目录。
2. snippet 里的脚本路径改成 `xxcjpt-vip.js`（只写文件名）。
3. MitM 添加 `hostname = sixth.xxcjpt.com`。

## 使用方法（远程）

1. QX → 设置 → 重写 → 规则资源 → +。
2. 填入 `https://raw.githubusercontent.com/lvbu1897/xxcjpt-rewrite/main/xxcjpt-vip.snippet`。

## 加解密说明

原始字符串是「Base64 编码后再整体反转」，解码时先反转再 Base64 解码。这只是编码混淆，不是加密。

工具脚本见 `tools/encode_decode.py`，运行：

```bash
python3 tools/encode_decode.py
```

## 免责声明

仅用于学习交流，请勿滥用；pps8678.com 为可疑链接，请勿访问。
