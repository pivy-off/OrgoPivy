"""
PharmaSim-style demo predictions: presets + simple PK curve math.
Educational / hackathon only — not for real drug or clinical decisions.
"""

from __future__ import annotations

import math
from typing import Any, Dict, List, Optional, Tuple

# --- Preset "drugs": PK-ish parameters + heuristic risk signals for demo ---

PRESETS: Dict[str, Dict[str, Any]] = {
    "acetaminophen": {
        "display_name": "Acetaminophen (Tylenol)",
        "generic": "acetaminophen",
        "smiles": "CC(=O)Nc1ccc(O)cc1",
        "dose_demo_mg": 500,
        "F": 0.85,
        "ka_h": 2.2,
        "ke_h": 0.35,
        "vd_L_per_kg": 1.0,
        "alerts": [],
        "risk_notes": ["Therapeutic window matters: liver toxicity with overdose or chronic alcohol use."],
        "mechanism_summary": "Analgesic/antipyretic; central COX inhibition and other pathways contribute to effect.",
        "base_risk_score": 22,
    },
    "ibuprofen": {
        "display_name": "Ibuprofen",
        "generic": "ibuprofen",
        "smiles": "CC(C)Cc1ccc(cc1)C(C)C(=O)O",
        "dose_demo_mg": 400,
        "F": 0.9,
        "ka_h": 3.0,
        "ke_h": 0.45,
        "vd_L_per_kg": 0.15,
        "alerts": ["nsaid_gi"],
        "risk_notes": ["NSAID class: GI irritation and renal risk in dehydration or CKD."],
        "mechanism_summary": "NSAID; inhibits COX enzymes, reducing prostaglandin synthesis.",
        "base_risk_score": 35,
    },
    "aspirin": {
        "display_name": "Aspirin (acetylsalicylic acid)",
        "generic": "aspirin",
        "smiles": "CC(=O)Oc1ccccc1C(=O)O",
        "dose_demo_mg": 325,
        "F": 0.7,
        "ka_h": 4.0,
        "ke_h": 0.5,
        "vd_L_per_kg": 0.15,
        "alerts": ["antiplatelet", "nsaid_gi"],
        "risk_notes": ["Bleeding risk; salicylate toxicity at high dose; pediatric Reye risk historically."],
        "mechanism_summary": "Irreversible COX-1 inhibition in platelets; analgesic/antipyretic at low dose.",
        "base_risk_score": 40,
    },
    "demo_high_risk": {
        "display_name": "Demo: high-alert scaffold (fictional)",
        "generic": "demo_high_risk",
        "smiles": None,
        "dose_demo_mg": 50,
        "F": 0.6,
        "ka_h": 1.5,
        "ke_h": 0.12,
        "vd_L_per_kg": 3.5,
        "alerts": ["reactive_epoxide", "nitro_aromatic", "quinone_mimic"],
        "risk_notes": [
            "Synthetic demo: multiple structural alert classes for storytelling only.",
            "Would trigger extra tox screening in early discovery.",
        ],
        "mechanism_summary": "Fictional multi-alert compound for dashboard contrast vs common OTC drugs.",
        "base_risk_score": 88,
    },
}

DISCLAIMER = (
    "Educational demo only. Not medical advice, not validated for regulatory or clinical use, "
    "and not a substitute for real pharmacology, toxicology, or clinical trials."
)


def list_preset_ids() -> List[str]:
    return sorted(PRESETS.keys())


def get_preset(drug_id: str) -> Dict[str, Any]:
    key = (drug_id or "").strip().lower().replace(" ", "_").replace("-", "_")
    if key not in PRESETS:
        raise ValueError(f"Unknown drug_id '{drug_id}'. Use GET /pharmasim/drugs for presets.")
    return PRESETS[key]


def _vd_L(preset: Dict[str, Any], weight_kg: float) -> float:
    w = max(40.0, min(120.0, weight_kg))
    return float(preset["vd_L_per_kg"]) * w


def _risk_tier(score: float) -> str:
    if score < 30:
        return "lower_demo_risk"
    if score < 60:
        return "moderate_demo_risk"
    return "elevated_demo_risk"


def predict(
    drug_id: str,
    weight_kg: float = 70.0,
) -> Dict[str, Any]:
    p = get_preset(drug_id)
    vd = _vd_L(p, weight_kg)
    score_val = float(p["base_risk_score"]) + min(10, len(p.get("alerts", [])) * 3)
    score_val = max(0, min(100, score_val))

    return {
        "drug_id": drug_id.strip().lower(),
        "display_name": p["display_name"],
        "generic": p["generic"],
        "smiles": p.get("smiles"),
        "disclaimer": DISCLAIMER,
        "model": "preset_heuristic_v1",
        "safety": {
            "risk_score_0_100": round(score_val, 1),
            "risk_tier": _risk_tier(score_val),
            "structural_alerts": list(p.get("alerts", [])),
            "notes": list(p.get("risk_notes", [])),
        },
        "pk_parameters": {
            "F_bioavailability": p["F"],
            "ka_per_h": p["ka_h"],
            "ke_per_h": p["ke_h"],
            "Vd_L": round(vd, 2),
            "dose_demo_mg": p["dose_demo_mg"],
            "weight_kg_assumed": weight_kg,
        },
        "mechanism_summary": p.get("mechanism_summary", ""),
    }


def _concentration_one_compartment_oral(
    t_h: float,
    dose_mg: float,
    F: float,
    ka: float,
    ke: float,
    vd_L: float,
) -> float:
    """mg/L style scalar (proportional), demo-only."""
    if vd_L <= 0 or dose_mg <= 0:
        return 0.0
    if abs(ka - ke) < 1e-6:
        # limit ka -> ke
        c = (F * dose_mg * ka * t_h * math.exp(-ke * t_h)) / vd_L
        return max(0.0, c)
    factor = (F * dose_mg * ka) / (vd_L * (ka - ke))
    return max(0.0, factor * (math.exp(-ke * t_h) - math.exp(-ka * t_h)))


def simulate(
    drug_id: str,
    hours: float = 24.0,
    steps: int = 48,
    dose_mg: Optional[float] = None,
    weight_kg: float = 70.0,
) -> Dict[str, Any]:
    p = get_preset(drug_id)
    vd = _vd_L(p, weight_kg)
    dose = float(dose_mg if dose_mg is not None else p["dose_demo_mg"])
    F, ka, ke = float(p["F"]), float(p["ka_h"]), float(p["ke_h"])

    n = max(8, min(200, int(steps)))
    dt = max(0.25, float(hours) / n)
    series: List[Dict[str, float]] = []
    t = 0.0
    peak = 0.0
    peak_t = 0.0
    while t <= hours + 1e-6:
        c = _concentration_one_compartment_oral(t, dose, F, ka, ke, vd)
        series.append({"t_hours": round(t, 3), "C_demo": round(c, 6)})
        if c > peak:
            peak, peak_t = c, t
        t += dt

    pred = predict(drug_id, weight_kg=weight_kg)

    return {
        "drug_id": drug_id.strip().lower(),
        "disclaimer": DISCLAIMER,
        "dose_mg": dose,
        "time_span_hours": hours,
        "curve": series,
        "peak": {"C_demo": round(peak, 6), "t_hours": round(peak_t, 3)},
        "prediction_summary": pred["safety"],
        "pk_parameters": pred["pk_parameters"],
    }


def compare_drugs(
    drug_id_a: str,
    drug_id_b: str,
    hours: float = 24.0,
    steps: int = 48,
    weight_kg: float = 70.0,
) -> Dict[str, Any]:
    sa = simulate(drug_id_a, hours=hours, steps=steps, weight_kg=weight_kg)
    sb = simulate(drug_id_b, hours=hours, steps=steps, weight_kg=weight_kg)
    pa = predict(drug_id_a, weight_kg=weight_kg)
    pb = predict(drug_id_b, weight_kg=weight_kg)

    return {
        "disclaimer": DISCLAIMER,
        "model": "preset_heuristic_v1",
        "patient": {"weight_kg": weight_kg},
        "A": {"drug_id": drug_id_a, "prediction": pa, "curve": sa["curve"], "peak": sa["peak"]},
        "B": {"drug_id": drug_id_b, "prediction": pb, "curve": sb["curve"], "peak": sb["peak"]},
        "comparison_notes": [
            "Curves use the same demo PK scaffold; units are relative (not calibrated to clinical assays).",
            "Compare shape (absorption rate, elimination) and heuristic risk cards side by side.",
        ],
    }
