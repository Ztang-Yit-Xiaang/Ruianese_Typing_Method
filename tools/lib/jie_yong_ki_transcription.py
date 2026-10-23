#!/usr/bin/env python3
"""Transcription helpers for Jie Yong Ki / 張永愷 and older Ruianese codes."""

from __future__ import annotations

import re
from dataclasses import dataclass


TONE_RE = re.compile(r"^(?P<body>[a-z]+)(?P<tone>[1-8])?$")


@dataclass(frozen=True)
class ConversionResult:
    code: str
    status: str
    note: str


def split_tone(code):
    match = TONE_RE.match(code.strip())
    if not match:
        return code.strip(), ""
    return match.group("body"), match.group("tone") or ""


def candidate_bodies(body):
    candidates = [(body, "unchanged")]

    def add(value, note):
        if value and (value, note) not in candidates:
            candidates.append((value, note))

    if "yuo" in body:
        add(body.replace("yuo", "yoe"), "yuo->yoe")
    if "uoo" in body:
        add(body.replace("uoo", "uoe"), "uoo->uoe")
    if "oo" in body:
        add(body.replace("oo", "oe"), "oo->oe")
    if "eu" in body:
        add(body.replace("eu", "e"), "eu->e")
    if "ii" in body:
        add(body.replace("ii", "i"), "ii->i")
    if body == "wa":
        add("uai", "wa->uai")
    if body == "ye":
        add("ie", "ye->ie")
    if body.startswith("tiae"):
        add("tia" + body[4:], "tiae->tia")
    if body.startswith("diae"):
        add("dia" + body[4:], "diae->dia")
    if body.startswith("ddiae"):
        add("ddia" + body[5:], "ddiae->ddia")
    if body.startswith("dju"):
        add("jjyu" + body[3:], "dju->jjyu")
    if body.startswith("tju"):
        add("qyu" + body[3:], "tju->qyu")
    
    # Palatalization before i/y medials
    if body.startswith("ziae"): add("jiae" + body[4:], "ziae->jiae")
    if body.startswith("zyue"): add("jyue" + body[4:], "zyue->jyue")
    if body.startswith("ciae"): add("qiae" + body[4:], "ciae->qiae")
    if body.startswith("cyue"): add("qyue" + body[4:], "cyue->qyue")
    if body.startswith("zziae"): add("jjiae" + body[5:], "zziae->jjiae")
    if body.startswith("zzyue"): add("jjyue" + body[5:], "zzyue->jjyue")
    if body.startswith("siae"): add("xiae" + body[4:], "siae->xiae")
    if body.startswith("syue"): add("xyue" + body[4:], "syue->xyue")
    if body.startswith("ssiae"): add("zsiae" + body[5:], "ssiae->zsiae")
    if body.startswith("ssyue"): add("zsyue" + body[5:], "ssyue->zsyue")

    if body.startswith("dz"):
        add("zz" + body[2:], "dz->zz")
    if body.startswith("fv"):
        add("f" + body[2:], "fv->f")
    if body.startswith("vv"):
        add("v" + body[2:], "vv->v")
    if body.startswith("xy"):
        rest = body[2:]
        xy_map = {
            "ii": "i",
            "ie": "ie",
            "iae": "iae",
            "iao": "iao",
            "ao": "iao",
            "jue": "yue",
            "ju": "yu",
        }
        add("x" + xy_map.get(rest, rest), "xy->x")
    if body.startswith("ny"):
        rest = body[2:]
        ny_map = {
            "ii": "i",
            "ie": "ie",
            "iae": "iae",
            "iao": "iao",
            "jue": "yue",
            "ju": "yu",
            "o": "yo",
        }
        add("nj" + ny_map.get(rest, rest), "ny->nj")
    for old, new in (("qjue", "qyue"), ("jjjue", "jjyue"), ("jju", "jyu"), ("jue", "jyue"), ("jii", "ji"), ("qii", "qi"), ("jjii", "jji")):
        if body == old:
            add(new, f"{old}->{new}")

    return candidates


def expand_candidates(body):
    seen = []
    queue = list(candidate_bodies(body))
    while queue:
        current, note = queue.pop(0)
        if current in seen:
            continue
        seen.append(current)
        for next_value, next_note in candidate_bodies(current):
            if next_value not in seen:
                combined = next_note if note == "unchanged" else f"{note}; {next_note}"
                queue.append((next_value, combined))
    return seen


def convert_code(code, valid_syllables):
    body, tone = split_tone(code)
    if not body:
        return ConversionResult(code, "unresolved", "empty code")
    valid = valid_syllables
    direct = body + tone
    if direct in valid:
        return ConversionResult(direct, "ok", "already valid")

    checked = []
    for candidate in expand_candidates(body):
        converted = candidate + tone
        checked.append(converted)
        if converted in valid:
            return ConversionResult(converted, "converted", f"{code}->{converted}")
    return ConversionResult(code, "unresolved", "no valid mapping; tried " + ", ".join(checked[:12]))
