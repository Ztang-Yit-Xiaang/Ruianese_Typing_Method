# Ruianese Typing Method

瑞安話輸入法是一套基於 Rime 的瑞安話（浙南吳語溫州片）拼音輸入方案。方案以現有 schema 與人工校訂規則為準，參考 `ruian_pinyin_scheme_v2 (1).docx`，並參考張永愷《瑞安方言讀音字典》聲韻配合表整理可輸入音節。

**Website:** https://ztang-yit-xiaang.github.io/Ruianese_Typing_Method/ (try typing in the browser, install guide)

Contact: [ztangyitxiaang@gmail.com](mailto:ztangyitxiaang@gmail.com)

## Features

- Ready-to-install Rime keyboard in [`rime/`](rime/) (see [Installation](#installation))
- Rime schema for Rui'an dialect romanization
- Initial, final, and tone spelling based on the project pinyin scheme
- Syllable dictionary generated from legal initial-final pairs
- Expandable character dictionary workflow through TSV files

## Pinyin Policy

This repository uses the document scheme:

- IPA `o` is written `o`.
- IPA `ɔ` is written `oe`.
- IPA `ɛ` is written `ee` on this branch (`eh` on `main`).
- IPA `æ` is written `eh` on this branch (`ae` on `main`): 好 heh2.
- IPA `uɔ` is written `uoe`.
- IPA `yɔ` is written `yoe`.
- IPA `ts` is written `z`.
- IPA `z` is written `ss`.
- IPA `ʑ` / `z̠` is written `y` on this branch (`zs` on `main`): 有 yau6, 羊 yeh5.
- The older repository note `ɔ -> o, o -> oo` is no longer the official spelling.
- Checked-tone codas `-p/-t/-k` are not required in ordinary input; tones are typed with suffix numbers `1` to `8`.

## Initials

| IPA | Code | Notes |
|---|---|---|
| p | b | unaspirated voiceless stop |
| pʰ | p | aspirated voiceless stop |
| b | bb | voiced stop |
| m | m | nasal |
| f | f | voiceless fricative |
| v | v | voiced fricative |
| t | d | unaspirated voiceless stop |
| tʰ | t | aspirated voiceless stop |
| d | dd | voiced stop |
| n | n | nasal |
| l | l | lateral |
| k | g | unaspirated voiceless stop |
| kʰ | k | aspirated voiceless stop |
| g | gg | voiced stop |
| ŋ | ng | nasal |
| h | h | voiceless fricative |
| ɦ | hh | voiced fricative |
| tɕ | j | unaspirated affricate |
| tɕʰ | q | aspirated affricate |
| dʑ | jj | voiced affricate |
| ȵ | nj | palatal nasal |
| ɕ | x | voiceless fricative |
| ts | z | unaspirated affricate |
| tsʰ | c | aspirated affricate |
| dz | zz | voiced affricate |
| s | s | voiceless fricative |
| z | ss | voiced fricative |
| z̠ / ʑ | y (`main`: zs) | voiced fricative, said as a y glide |

## Finals

> **daily-speech branch.** This branch spells everyday Ruianese rather than the
> dictionaries. Differences from `main`:
>
> | main (dictionaries) | daily-speech | Examples |
> |---|---|---|
> | go, ko, hho, ho, ngo, o | gu, ku, hhu, hu, ngu, u | 光 gu1, 康 ku1, 黃 hhu5, 牙 ngu5, 亞 u3 |
> | gu, ku | gvu, kvu | 哥 gvu1, 古 gvu2, 苦 kvu2 |
> | eu / ou | ou / eu (swapped) | 頭 ddou5, 收 sou1 / 書 seu1, 度 ddeu7 |
> | leu | lou | 路 lou7, 爐 lou5 |
> | ao, iao | au, iau | 狗 gau2 |
> | ae | eh | 好 heh2, 刀 deh1, 老 leh6, 高 geh1 (看 ke3 keeps e; 海 hee2 is ee) |
> | oe | o | 方 fo1, 飯 vo7, 三 so1 |
> | yo | yu | 王 yu5, 用 yu7 |
> | uoe | uo | 料 luo7, 條 dduo5 |
> | ie | i | 天 ti1, 錢 jji5, 年 nji5 |
> | iae | ieh (yeh with no initial) | 張 jieh1, 香 xieh1, 涼 lieh5, 羊 yeh5, 央 yeh1 |
> | z, c, zz, s before i+vowel or y | j, q, jj, x | 張 jie1, 雪 xyu4, 照 jyu3 (plain zi/ci/si keep z/c/s) |
> | yue | yu | 月 njyu8, 雪 syu4, 燒 syu1, 照 zyu3, 要 yu1 |
> | ioe | io | 腳 jio4, 削 xio4 |
> | zs | y | 前 yi5, 有 yau6, 羊 yeh5, 容 yong5, 王 yu5, 藥 yo8 |
> | eh | ee | 開 kee1, 菜 cee3, 黑 hee4, 色 see4 (also sei4) |
> | i, ia, iau, ie, iang… (no initial) | yi, ya, yau, ye, yang… | 衣 yi1, 一 ya4, 優 yau1, 央 yeh1, 因 yang1; pairs like 優 yau1 / 有 yau6 differ only by tone |
>
> Single-character readings: 他 to1, 橋 jjia5, 轎 jjia7, 小 xyu2, 笑 xyu3, 叫 jyu3, 雨 vyu6, 鳥 nio2, 跳 tuo3, 要 yu (文) / yi3 (白), 人 ssang5 (文) / nang5 (白), 心 sang1, 姐 姊 za1 (白) / 姐 zei2, 姊 zi2 (文), 綠 lu8, 肉 njiou8, 囡 nang5, 兒 ng5, 媽 ma6, 兩 la6 (lieh6 is the Wenzhou city reading), 廿 njieh8, 面 mai7 for places and directions (上面, 後面, 外面; mi7 for face and noodles), 顏色 ngo5 sei4, 得 dei4 (覺得 gu4 dei4, 曉得), 還 hhuo5, 在 ssi6, 把 bu2, 幫 bu1, 從 yu8, 算 蒜 syu3 (打算 da2 syu3, 算命, 大蒜), 票 pi3 (鈔票 co1 pi3, said pi2 by sandhi), 鉛 ka1, 往 mu6, 牀 yu5, 合 hhee8, 夥 fu2, 剪 jji6 (剪刀 jji6 deh1), 蚊 mang5 (蚊蟲 mang5 jjiong7, 耳朵 ng6 du2, 手指頭 sou2 zi2 ddong5, 朵 deu2 (一朵), 馬 mu6 (馬上 mu6 yeh6, 馬甲 mu6 gu4), 甲 gu4 (年甲, 指甲), 烏 vu1 (烏龜, 眼烏珠), 胸脯 xyu1 pu5, 眼烏珠兒 ngo6 vu1 zeu1 ng5, 眉毛 mei5 me7, 晝 zou3 (日晝 nee8 zou3), 黃昏 o7 xyu1, 禮拜 lei6 bba3, 該年 gee1 nji5 (more common than 今年), 天色 ti1 sei4, 打雷 da2 lai5, 卵 lang6 (雞卵 ji1 lang6), 饅 meu5, 薯 ssei7 (番薯 fo1 ssei7), 肚臍兒 ddeu6 ssei5 ng5, 豆 ddou7 (豆腐 ddou7 veu6), 豬肉 zei1 njiou8, 茶 zzu5, 屋 vu4, 樓 lau5 (樓上 lau5 yeh6), 天井 ti3 zeng2, 凳 ddang3, 細 sai3, 便宜 bbi7 yi5 (lazily bbee7 yi5), 乾淨 geu1 zzeng7, 支 zi1 (一支 yi8 zi1, not 一隻 yi8 zei4), 阿爸 a1 bba6, 阿嬭 a7 na1 (older speakers; 阿媽 is more common now), 老安 leh6 e1 (over 老公 / 老婆), 姊妹 zi2 mi7 (siblings of any gender: 兩姊妹, 三姊妹), 小人兒 sai3 nang5 ng5, 阿娘 a1 njieh5 (grandma, Ruian town; 阿婆 a1 bbeu5 in 莘塍), 坐 ssu6, 望 hhuo7, 聽 teng1, 活 hhuo8 (做生活 zou3 sa1 hhuo8), 嬉嬉 xi4 xi1, 好嬉 heh2 xi1, 歡喜 xyu1 xi2, 生好 sa1 heh2 / 生毛 sa1 meh5 (good-looking / ugly, of people; 毛 used for its sound), 好眙 heh2 ci3 / 孬眙 feh8 ci3 (of scenery; 孬 feh8 = 不 + 好 run together), 好望 heh2 hhuo7, 難望 no5 hhuo7, 睏覺 kang3 gu3, 不曉得 fu2 xio2 dei4 (also spoken xiao2 dei4), 走出 zau2 qyu4 (over 出去 qyu4 qyu3), 走底 zau2 dei2 (over 進來 zang3 lei5), 轉來 jyu2 lei5, 話 hhu7 (講話 gu2 hhu7), 湯 tu1 (湯圓 tu1 yu5), 魚兒 njyu5 ng5, 蝦兒 hu1 ng5, 閃電 so2 ddi7, 日頭 nee8 ddou5 (over 熱頭), 上半日 yeh6 beu3 nee8 / 下半日 hhu6 beu3 nee8 (more common than 上晝 / 下晝), 今日 jiang1 nee8 (該日 gee1 nee8 is more common), 呤喉 leng5 hhau5 (more common than 喉嚨 hhau5 long5)), 刷 seu4 (牙刷 ngu5 seu4), 好過 heh2 gvu3 (more common than 舒服), 鬧熱 no7 njee8, 肥皂 vei5 sseh6, 怕 pu3, 蒼 cu1, 昨 ssu8 (昨夜 ssu8 yi7), 半 beu3, 爽 su2, 漂亮 pi3 lieh7, 一 yi8 (一個, 一下, 一百) / ya4 when counting or reading digits (一二三, 第一, 初一, 廿一, 五十一, 110 ya ya leng), 節 ji4, 換 hhuo7, 窗 qyu1 (窗簾 qyu1 lee5), 巴 bu1, 茄 ga4 (番茄), 花 hu1, 睡 ssai7, 館 gyu2, 睏 kyu3 (白) / kang3 (文), 明 mang8 (明朝, 明年), 眼睛 ngo6 zzeng5, 若 yo8, 前 yi5, 上 像 yeh, 全 yu5, 俗 yu8 (no ss readings), 不 fu2 (spoken) / ba4 (literary: 不過; 不近 is fu2 jjiang6), 來 lei5 / lei2, 跑 po2, 河 vu5, 船 yu5, 熱 nji8, 大 ddou7 (白) / dda7 (文).
> The OCR pipeline keeps the dictionary spelling, since it transcribes the books.

- Simple finals: `a`, `o`, `e`, `eh`, `i`, `u`, `yu`
- Compound finals: `au`, `ai`, `ou`, `eu`, `ei`, `ia`, `iau`, `iou`, `ie`, `iae`, `io`, `uai`, `uo`, `yoe`
- Nasal finals: `ang`, `eng`, `ong`, `iang`, `iong`
- Special finals: `ng`, `i` for the apical vowel, `vu` after g and k (`gvu`: 哥、歌、姑、古、過; `kvu`: 苦、科、哭 — a lip-pressed u; plain `gu` is 光、家、價)

## Tones

Tone numbers are typed after the syllable:

| Tone | Category |
|---|---|
| 1 | 陰平 |
| 2 | 陰上 |
| 3 | 陰去 |
| 4 | 陰入 |
| 5 | 陽平 |
| 6 | 陽上 |
| 7 | 陽去 |
| 8 | 陽入 |

Example: `boe`, `boe1`, `boe8`.

## 文獻 / IPA 轉寫規則

本節用於將張永愷《瑞安方言讀音字典》等文獻的記音轉寫為本方案拼音。拼寫以 `ruian_pinyin_scheme_v2 (1).docx` 與 `ruian_legal_pairs.tsv` 為準。

### 轉寫順序

1. 先判聲調（陰 / 陽）
2. 再判聲母
3. 最後判韻母

聲調判定的優先級高於拼音與 IPA。

### 聲調判定

- 調號標在音節四角：左下、左上、右上、右下分別為平、上、去、入。
- 調號下方**沒有橫線** → 陰調（1–4）；**有一橫線** → 陽調（5–8）。調號數字見上方 Tones 表。
- 出現在音標左下角、字形較小的符號（如 `c`），優先視為聲調標記，不得誤判為聲母。

### 聲母

按上方 Initials 表轉寫。`ts → z` 等合併只發生在拉丁拼寫層，IPA 層仍分別保存，不影響音系分析對 /ts/ 的描述。

### 韻母

| IPA | 拼寫 | 備註 |
|---|---|---|
| ə | e | 硬規則：kə → ge、tsəŋ → zeng、dzə → zze |
| y / ʉ | yu | 輸入碼層合併，IPA 音值仍可分別保存 |
| ɔ | oe | |
| o | o | |
| ɛ | eh | |
| æ | ae | |
| əʉ / iəʉ | ou / iou | 頭、讀、收、他 |
| （瑞安口語） | eu | 書、度、杜、兔：與 ou 不同韻 |
| iæ / iɔ | iae / io | |
| uɔ / uo | uoe / uo | |
| yɛ / yə | yue | |
| yɔ / yo | yoe / yo | |
| ɿ（舌尖元音） | i | |

舊稿中的 `ɔ → o`、`o → oo`、`əu → eu`、`uo → uou` 已不再使用。本分支的 `eu` 是另一個韻：書、度、杜。

### 示例

- 于：ʉ，陰平 → `yu1`
- 上：陽上 → `zsiae6`（本分支寫 `yeh6`）
- 乾：kə，陰平 → `ge1`
- 幹：kəʔ，陰入 → `ge4`

## Dictionary Generation

Run the full pipeline, including Jie Yong Ki / 張永愷 book-page OCR after page 058:

```powershell
python tools/run_all.py
```

Raw OCR text, OCR TSV confidence data, combined OCR text, and validation reports are written to `output/jie_yong_ki/book_ocr/`. Table-aware OCR writes cell-level review files to `output/jie_yong_ki/book_ocr_structured/`.

If PaddleOCR-VL raw output for page 059 already exists, `run_all.py` also builds clean VLM rows with Zhang Yongkai tone-glyph parsing under `output/jie_yong_ki/vlm_backend_trials/`.

For a fast smoke test on the first dictionary page only:

```powershell
python tools/run_all.py --limit 1 --structured-limit 1
```

`ruian_pinyin.dict.yaml` is generated from `ruian_legal_pairs.tsv`.

```powershell
python tools/generate_ruian_pinyin_dict.py
```

The generator creates one bare syllable plus eight tone-number forms for every legal initial-final pair.

## IPA Closed-Set Recognition

The Zhang Yongkai dictionary IPA cells are handled as a closed-set image recognition task, not as general OCR. The authoritative training labels are `ipa_initial`, `ipa_final`, and `tone`; Rime fields such as `rime_initial`, `rime_final`, and `romanization` are derived from the IPA layer unless a documented override is supplied.

The detailed workflow lives in `tools/ocr/README_ipa_pipeline.md`. The normal flow is:

```text
extract -> cluster -> api-label -> promote-labels -> review-labels -> apply-review -> build-labels -> train -> predict
```

OpenAI API labeling is only a weak-label assistant for cluster contact sheets. It does not perform image cropping, clustering, or final dictionary promotion. The local CNN training path uses reviewed or gold IPA-layer labels, keeps same-cluster images out of both train and validation splits, and records mapping/schema hashes in checkpoints.

API secrets should stay in environment variables or ignored local files such as `API_KEY.txt` and `API_BASE_URL.txt`. Do not copy keys into TSV files, prompts, README text, or committed output.

Character entries can be maintained in `ruianese_characters_template.tsv` with:

```text
字<TAB>code<TAB>weight
```

Then generate the character dictionary with:

```powershell
python tools/build_ruianese_dict_from_tsv.py ruianese_characters_template.tsv ruianese.character_01.dict.yaml
```

## Jie Yong Ki Workflow

Jie Yong Ki / 張永愷 review artifacts are written under `output/jie_yong_ki/`.

Seed the legal-pair review files from the curated table:

```powershell
python tools/ocr/ocr_ruian_table.py --from-official
```

Run OCR on `tools/ocr/p437.png`, `tools/ocr/p438.png`, and `tools/ocr/p439.png` after installing the optional OCR dependencies:

```powershell
python -m pip install opencv-python pytesseract
python tools/ocr/ocr_ruian_table.py
```

Run table-aware OCR on Jie Yong Ki / 張永愷 dictionary pages with the Tesseract CLI:

```powershell
python tools/ocr/ocr_jie_yong_ki_book_table.py --page 059
python tools/ocr/ocr_jie_yong_ki_book_table.py
```

The structured OCR keeps every low-confidence cell for review. Per-page files such as `page_059_cells.tsv` use `page`, `row`, `column`, `column_name`, `text`, `confidence`, `bbox`, `status`, and `note`; `dictionary_rows.tsv` reconstructs entry rows for proofreading.

Compare the current Tesseract cell OCR with a modern PaddleOCR backend on a single page:

```powershell
python tools/ocr/compare_ocr_backends.py --page 059
```

If PaddleOCR is not installed, the comparison script still writes the Tesseract baseline and reports the install command:

```powershell
python -m pip install paddleocr paddlepaddle
```

Run high-accuracy VLM trials on a single page. This is validity-first and may take a long time while models download or run:

```powershell
python tools/ocr/compare_vlm_backends.py --backend paddle --page 059
python tools/ocr/compare_vlm_backends.py --backend qwen --page 059
```

The VLM trial writes raw model output, validated row TSV files, and a comparison report under `output/jie_yong_ki/vlm_backend_trials/`.

Build the clean page-059 rows from PaddleOCR-VL's table output and the scanned IPA cell glyphs:

```powershell
python tools/ocr/build_clean_vlm_rows.py --page 059
```

The clean rows use `mandarin_pinyin` only as lookup metadata. Rui'an tone numbers come from the printed half-circle tone glyph in the `瑞安方音 / 国际音标` cell: left-lower, left-upper, right-upper, and right-lower map to 平、上、去、入; a lower bar marks 陽調, and no lower bar marks 陰調. OCR artifacts such as `2`, `²`, `₂`, and `)` are not accepted as tone numbers.

When VLM output contains OCR artifacts in the IPA field, keep the raw value in `ruian_ipa_raw_vlm` and correct it through `output/jie_yong_ki/vlm_backend_trials/ipa_overrides.tsv`. In particular, `\theta` is treated as an OCR artifact, not as a formal Zhang Yongkai IPA token. Empty hanzi cells inherit the nearest previous hanzi because they usually mark an additional reading of the same character.

Run the IPA-aware review layer after clean rows are generated:

```powershell
python tools/ocr/review_ipa_with_llm.py --clean-rows output/jie_yong_ki/vlm_backend_trials/page_059_clean_rows.tsv
```

This writes `llm_ipa_review_prompts.jsonl`, `llm_ipa_review_candidates.tsv`, and `llm_ipa_review_clusters.tsv`. The reviewer is advisory only: it never writes to `ipa_overrides.tsv` or the formal dictionaries. Human-confirmed suggestions can later be copied into `ipa_overrides.tsv`.

To use OpenAI as the reviewer, set the key in the current PowerShell session and start with a one-row smoke test:

```powershell
$env:OPENAI_API_KEY="..."
python tools/ocr/review_ipa_with_llm.py --api-smoke-test --use-openai --limit 1
python tools/ocr/review_ipa_with_llm.py --use-openai --limit 1
```

The script reads only `OPENAI_API_KEY` from the environment. Do not put API keys in TSV files, command history, README, or prompts.

Convert the existing Jie Yong Ki / 張永愷 character readings to the current pinyin policy:

```powershell
python tools/convert_jie_yong_ki_character_dict.py
```

Review `output/jie_yong_ki/unresolved_codes.tsv` before promoting converted readings into a formal Rime dictionary. The converter changes only readings that can be validated against `ruian_pinyin.dict.yaml`; uncertain readings are preserved for manual review.

Generate the formal validated Rime dictionary:

```powershell
python tools/generate_jie_yong_ki_dict.py
```

This writes `ruianese.jie_yong_ki.dict.yaml` with only `ok` and `converted` readings. Unresolved rows stay in `output/jie_yong_ki/unresolved_codes.tsv`.

## Installation

The keyboard runs on [Rime](https://rime.im/), a free input-method engine. You install Rime once, then add the Ruianese layout from the [`rime/`](rime/) folder. Two layouts are included:

| Layout | Input |
|---|---|
| `瑞安話` (`ruianese`) | Type without tones: `ssang` → 人 |
| `瑞安話（帶調）` (`ruianese_tone`) | Tones optional: `ssang5` → 人 |

### 1. Install Rime

| System | Rime app | Rime user folder |
|---|---|---|
| macOS | [Squirrel 鼠鬚管](https://rime.im/download/) | `~/Library/Rime` |
| Windows | [Weasel 小狼毫](https://rime.im/download/) | `%APPDATA%\Rime` |
| Linux (Fcitx5) | `fcitx5-rime` from your package manager | `~/.local/share/fcitx5/rime` |
| Linux (IBus) | `ibus-rime` from your package manager | `~/.config/ibus/rime` |

**macOS only:** after installing Squirrel, add it as an input source, or no icon appears in the menu bar. Open **System Settings → Keyboard → Text Input → Edit… → +**, choose **Chinese, Simplified** (or Traditional), select **Squirrel**, and click **Add**. If Squirrel is not listed, log out and back in first.

On Windows, open the user folder from the Start menu: **小狼毫輸入法 → 【小狼毫】用戶文件夾**.

### 2. Copy the layout files

Download [ruianese-rime.zip](https://ztang-yit-xiaang.github.io/Ruianese_Typing_Method/ruianese-rime.zip) (or take the files from the `rime/` folder of this repository), unzip it, and copy every file into your Rime user folder:

```text
ruian.ico
ruianese.schema.yaml
ruianese_tone.schema.yaml
ruianese.dict.yaml
ruianese.zhang_yongkai.dict.yaml
ruianese.chen_haifang.dict.yaml
ruianese.yunshu.dict.yaml
ruianese.wenzhou_words.dict.yaml
ruianese.customize.dict.yaml
```

### 3. Turn the layout on

In the same Rime user folder, open `default.custom.yaml` (create it if it does not exist) and list the layouts:

```yaml
patch:
  schema_list:
    - schema: ruianese
    - schema: ruianese_tone
    - schema: luna_pinyin
```

This list replaces Rime's default one, so keep any other layouts you use. `luna_pinyin` (Mandarin pinyin) is optional, but the Ruianese layouts use it for reverse lookup, so it should stay installed. Squirrel and Weasel include it. On Linux, install your distribution's `rime-data` package if it is missing.

### 4. Deploy

Rime reads new files only when you deploy:

- **macOS:** click the Squirrel icon in the menu bar → **Deploy (重新部署)**.
- **Windows:** Start menu → **小狼毫輸入法 → 【小狼毫】重新部署**.
- **Linux:** Fcitx5: right-click the tray icon → **Deploy**. IBus: click the Rime menu → **Deploy**, or run `ibus restart`.

The first deploy builds the dictionary and can take up to a minute.

### 5. Type

Switch to Rime (Squirrel, Weasel or Rime in your input menu), click into any text box, and type a reading:

| Type | Choose |
|---|---|
| `ssang` | 人 |
| `ssou` | 瑞 |
| `e` | 安 |
| `hho` or `va` | 話 |

- **Choose a candidate:** press **Space** for the first one, or its number.
- **Switch layouts:** press **Ctrl+`** or **F4** to open the 方案選單 and pick `瑞安話` or `瑞安話（帶調）`.
- **English mode:** if plain letters come out, press **Shift** once to toggle Rime between English and Chinese.

### Troubleshooting

- **No icon on macOS:** Squirrel has not been added as an input source (see step 1).
- **No candidate window:** deploy again (step 4). If you installed or edited files while Rime was running, it keeps using the old build until you deploy.
- **The layout is missing from Ctrl+`:** check `default.custom.yaml` (step 3), then deploy.

## Contributing

Useful contributions include:

- Proofreading legal initial-final pairs against Jie Yong Ki / 張永愷's table
- Adding verified character readings to the TSV character dictionary
- Testing the Rime schema on different platforms

## Development Checks

Run lint and focused tests before committing pipeline changes:

```powershell
python -m ruff check tools tests
python -m pytest tests\ocr -q
```

If the default `python` command is not configured on Windows, use the installed interpreter directly, for example:

```powershell
& "C:\Path\To\Python\python.exe" -m ruff check tools tests
```

## References

Readings and words in this project are based on the following works:

- 张永恺《瑞安方言读音字典》，上海社会科学院出版社，2003。ISBN 9787806813126
- 陈海芳《瑞安话语音研究》，硕士学位论文。Digitized homophone list via [MCPDict 汉字音典](https://github.com/osfans/MCPDict).
- 沈克成、何克识《瑞安方言曲艺韵书》，宁波出版社，2017。ISBN 9787552630299
- 郑张尚芳《温州方言志》，中华书局，2008。ISBN 9787101060362
- 游汝杰、杨乾明 编纂《温州方言词典》（李荣 主编《现代汉语方言大词典》分卷），江苏教育出版社，1998。ISBN 9787534334337
- 沈克成、沈迦《温州话》第一册，宁波出版社，2004。ISBN 9787806028117
- 钱志熙《温州文史论丛》，上海三联书店，2013。ISBN 9787542642493
- 金柏东 编《温州历代碑刻集》，上海社会科学院出版社，2002。ISBN 9787806810910
- [ZWolken/rime-wenzhounese](https://github.com/ZWolken/rime-wenzhounese): Wenzhounese Rime input method (AGPL-3.0); word list and schema structure.

## License

[GNU AGPL-3.0](LICENSE). The keyboard's 溫州話常用詞 dictionary (`rime/ruianese.wenzhou_words.dict.yaml`) includes words from [ZWolken/rime-wenzhounese](https://github.com/ZWolken/rime-wenzhounese), which is also AGPL-3.0.
