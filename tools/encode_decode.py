import base64, json

def encode(data: dict) -> str:
    json_str = json.dumps(data, separators=(',', ':'), ensure_ascii=False)
    b64 = base64.b64encode(json_str.encode('utf-8')).decode('ascii')
    return b64[::-1]

def decode(s: str) -> dict:
    b64 = s[::-1]
    json_str = base64.b64decode(b64).decode('utf-8')
    return json.loads(json_str)

if __name__ == "__main__":
    sample = {
        "code": 1,
        "message": "",
        "data": {
            "uid": 20003,
            "vip": 2,
            "exp": True,
            "expdate": "2025.03.03",
            "unclaimed": 0,
            "today_max": 3,
            "today_left": 2,
            "links": ["pps8678.com"],
            "feedbackk_unrYad": 0,
            "money": "14.00"
        }
    }
    encoded = encode(sample)
    print("encoded:", encoded)
    print("decoded:", decode(encoded))
