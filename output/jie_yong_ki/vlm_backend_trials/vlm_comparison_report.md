# VLM Backend Comparison

| Backend | Status | Runtime sec | Rows | Hanzi rows | Review rows | Tone resolved | Tone unresolved | Invalid tone | Note |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| paddleocr_vl | cached_existing |  | 22 | 19 | 22 | 0 | 22 | 0 | loaded_existing_rows_tsv |
| qwen_vl | ok | 0.00 | 22 | 19 | 22 | 19 | 3 | 7 | parsed_cached_raw_output |

## Validity Policy

- Tone number must be `1-8` or blank.
- Tone base must be `平`, `上`, `去`, `入`, or blank.
- Tone register must be `yin`, `yang`, `unknown`, or blank.
- Review rows are acceptable; confident invalid tone values are not.