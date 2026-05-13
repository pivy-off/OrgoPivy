"""
Lazy-loaded ADMET-AI (Chemprop/TDC) predictions from SMILES.
See https://github.com/swansonk14/admet_ai — cite the ADMET-AI paper if you use results.
"""

from __future__ import annotations

import threading
from typing import Any, Dict

from rdkit import Chem

DISCLAIMER = (
    "Predictions are from ADMET-AI (ML models on TDC benchmarks); not experimental data, "
    "not for regulatory or clinical decisions. Validate critical compounds in the lab."
)

_model_lock = threading.Lock()
_model: Any = None


def get_admet_model():
    global _model
    with _model_lock:
        if _model is None:
            from admet_ai import ADMETModel

            _model = ADMETModel()
    return _model


def validate_smiles(smiles: str) -> None:
    s = (smiles or "").strip()
    if not s:
        raise ValueError("SMILES is required.")
    if len(s) > 2000:
        raise ValueError("SMILES string is too long.")
    mol = Chem.MolFromSmiles(s)
    if mol is None:
        raise ValueError("Invalid SMILES: could not parse with RDKit.")


def _scalar(val: Any):
    if val is None:
        return None
    if hasattr(val, "item"):
        try:
            return float(val.item())
        except Exception:
            return str(val)
    if isinstance(val, (bool, int, float, str)):
        return val
    try:
        return float(val)
    except (TypeError, ValueError):
        return str(val)


def predictions_to_json(preds: Dict[str, Any]) -> Dict[str, Any]:
    return {str(k): _scalar(v) for k, v in preds.items()}


def predict_smiles(smiles: str) -> Dict[str, Any]:
    validate_smiles(smiles)
    model = get_admet_model()
    raw = model.predict(smiles=smiles.strip())
    if not isinstance(raw, dict):
        raise RuntimeError("Unexpected prediction format from ADMET-AI.")
    return predictions_to_json(raw)
