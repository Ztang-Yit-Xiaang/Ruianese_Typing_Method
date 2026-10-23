#!/usr/bin/env python3
"""Quarantine and Blast Radius Analysis implementation."""
from copy import deepcopy
from pathlib import Path
from typing import Any
from .io_utils import read_jsonl, write_jsonl

class BlastRadiusAnalyzer:
    @staticmethod
    def find_affected_cells(
        labels: list[dict[str, Any]],
        target_cluster_id: str,
        target_rime_syllable: str,
    ) -> list[str]:
        """Find cell IDs that share the target cluster or have the same predicted syllable."""
        affected = []
        for row in labels:
            cell_id = row.get("cell_id")
            cluster_id = row.get("cluster_id")
            rime = row.get("mapped_rime_syllable") or row.get("romanization")
            if cluster_id == target_cluster_id or rime == target_rime_syllable:
                if cell_id:
                    affected.append(cell_id)
        return affected

def quarantine_labels(
    labels_path: Path,
    target_cluster_id: str,
    target_rime_syllable: str,
    output_path: Path,
) -> tuple[list[dict[str, Any]], int]:
    """Flag matching labels as weak / needs review."""
    labels = read_jsonl(labels_path)
    analyzer = BlastRadiusAnalyzer()
    affected_ids = set(analyzer.find_affected_cells(labels, target_cluster_id, target_rime_syllable))
    
    out = []
    quarantined_count = 0
    for row in labels:
        item = deepcopy(row)
        if item.get("cell_id") in affected_ids:
            item["label_status"] = "weak"
            item["needs_review"] = True
            item["quarantine_reason"] = f"Flagged by blast radius analysis for cluster {target_cluster_id} / syllable {target_rime_syllable}"
            quarantined_count += 1
        out.append(item)
        
    write_jsonl(output_path, out)
    return out, quarantined_count
