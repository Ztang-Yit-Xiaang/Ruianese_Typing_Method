#!/usr/bin/env python3
"""
Build site/data/lexicon.json from rime/ruianese*.dict.yaml files.
Standard library only.
"""
import glob
import json
import os
import sys

def parse_dict_file(filepath):
    entries = []
    with open(filepath, 'r', encoding='utf-8') as f:
        in_body = False
        for line in f:
            line_str = line.rstrip('\r\n')
            if not in_body:
                if line_str == '...':
                    in_body = True
                continue

            # Skip blank lines and lines starting with #
            stripped = line_str.strip()
            if not stripped or stripped.startswith('#'):
                continue

            # Split on TAB
            parts = line_str.split('\t')
            if not parts:
                continue

            def clean_field(val):
                return val.split('#', 1)[0].strip()

            text = clean_field(parts[0])
            if not text:
                continue

            code = clean_field(parts[1]) if len(parts) > 1 else ''

            weight = 0
            if len(parts) > 2:
                weight_str = clean_field(parts[2])
                if weight_str:
                    try:
                        weight = int(weight_str)
                    except ValueError:
                        # In case weight is expressed with percent or float, parse or default to 0
                        try:
                            weight = int(float(weight_str.rstrip('%')))
                        except ValueError:
                            weight = 0

            entries.append((text, code, weight))
    return entries

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    rime_dir = os.path.join(base_dir, 'rime')
    output_path = os.path.join(base_dir, 'site', 'data', 'lexicon.json')

    dict_pattern = os.path.join(rime_dir, 'ruianese*.dict.yaml')
    dict_files = sorted(glob.glob(dict_pattern))

    exclude_file = os.path.join(rime_dir, 'ruianese.dict.yaml')
    target_files = [f for f in dict_files if os.path.abspath(f) != os.path.abspath(exclude_file)]

    merged = {}
    for filepath in target_files:
        file_entries = parse_dict_file(filepath)
        for text, code, weight in file_entries:
            key = (text, code)
            if key not in merged or weight > merged[key]:
                merged[key] = weight

    # Sort by weight descending, then text and code for deterministic ordering
    sorted_lexicon = [
        [text, code, weight]
        for (text, code), weight in sorted(
            merged.items(),
            key=lambda item: (-item[1], item[0][0], item[0][1])
        )
    ]

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(sorted_lexicon, f, ensure_ascii=False, separators=(',', ':'))

    print(f"Processed {len(target_files)} dict files: {[os.path.basename(f) for f in target_files]}")
    print(f"Total entries after deduplication: {len(sorted_lexicon)}")
    print(f"Written to: {output_path}")

if __name__ == '__main__':
    main()
