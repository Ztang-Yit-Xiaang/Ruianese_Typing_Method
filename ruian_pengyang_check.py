# ===== Rui'an dialect dictionary checker (Enhanced) =====

import os
import re
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TSV_PATH = os.path.join(SCRIPT_DIR, "ruian_legal_pairs.tsv")

# ===== 1. 聲調 =====

tones = ["1", "2", "3", "4", "5", "6", "7", "8"]


# ===== 2. 生成合法音節（來自 ruian_legal_pairs.tsv） =====

valid_syllables = set()

with open(TSV_PATH, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) < 2:
            continue
        initial, final = parts[0], parts[1]
        initial_str = "" if initial == "Ø" else initial
        for t in tones:
            valid_syllables.add(initial_str + final + t)

print(f"✅ Generated {len(valid_syllables)} valid syllables\n")


# ===== 3. normalize =====

NORMALIZE = {
    "xy": "zs",

    # 常見錯誤
    "ju": "jyu",
    "qu": "qyu",
    "xu": "xyu",
}

def normalize(p):
    for k, v in NORMALIZE.items():
        p = p.replace(k, v)
    return p


# ===== 4. suspicious 檢測 =====

def is_suspicious(p):

    # v 濫用（gvu、kvu 是瑞安話 哥、姑、苦 的讀法，合法）
    if "v" in p and not p.startswith(("v", "f", "hh", "gvu", "kvu")):
        return True

    return False


# ===== 5. 檢查 dict =====

def check_dict(file_path):
    errors = []
    suspicious = []

    in_header = False
    with open(file_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            raw = line.strip()

            if raw == "---":
                in_header = True
                continue

            if in_header:
                if raw == "...":
                    in_header = False
                continue

            if raw == "...":
                continue

            if not raw or raw.startswith("#"):
                continue

            parts = re.split(r"\s+", raw)

            if len(parts) < 2:
                continue

            char = parts[0]
            pinyin = parts[1]

            pinyin_norm = normalize(pinyin)

            # ❌ 非法
            if pinyin_norm not in valid_syllables:
                errors.append((line_num, char, pinyin))

            # ⚠️ 可疑
            if is_suspicious(pinyin):
                suspicious.append((line_num, char, pinyin))

    return errors, suspicious


# ===== 6. 執行 =====

dict_file = sys.argv[1] if len(sys.argv) > 1 else "ruianese.character_01.dict.yaml"
if not os.path.isabs(dict_file) and not os.path.exists(dict_file):
    alt = os.path.join(SCRIPT_DIR, dict_file)
    if os.path.exists(alt):
        dict_file = alt

errors, suspicious = check_dict(dict_file)

# ===== 7. 輸出 =====
print("❌ 非法拼音（不在音節系統）:")
for e in errors[:50]:
    print(e)

print(f"\nTotal errors: {len(errors)}\n")

print("⚠️ 可疑拼音（建議人工檢查）:")
for s in suspicious[:50]:
    print(s)

print(f"\nTotal suspicious: {len(suspicious)}")


# ===== 8. Debug（可選） =====

print("\n🔍 Sample valid syllables:")
for s in list(valid_syllables)[:20]:
    print(s)
