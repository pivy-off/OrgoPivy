# api/app/practice_sn1_sn2_e1_e2.py

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple, Any
import re


@dataclass
class PracticePrompt:
    substrate: str
    reagent: str
    solvent: str
    heat: bool


PRACTICE_CASES: List[PracticePrompt] = [
    PracticePrompt(substrate="1-bromobutane", reagent="NaI", solvent="acetone", heat=False),
    PracticePrompt(substrate="2-bromobutane", reagent="NaOEt", solvent="ethanol", heat=False),
    PracticePrompt(substrate="tert-butyl bromide", reagent="H2O", solvent="water", heat=False),
    PracticePrompt(substrate="2-bromobutane", reagent="tBuOK", solvent="tBuOH", heat=True),
    PracticePrompt(substrate="benzyl bromide", reagent="NaCN", solvent="DMSO", heat=False),
]


QUESTION_ORDER = ["q1", "q2", "q3", "q4", "q5", "q6"]


QUESTION_TEXT: Dict[str, str] = {
    "q1": "What type of carbon bears the leaving group. primary secondary tertiary",
    "q2": "Is the leaving group good. yes no",
    "q3": "Classify the reagent. strong nucleophile strong bulky base weak nucleophile",
    "q4": "What kind of solvent is present. protic aprotic",
    "q5": "Is heat present. yes no",
    "q6": "Mechanism decision. sn1 sn2 e1 e2",
}


def normalize_answer(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"\s+", " ", s)
    return s


def is_good_leaving_group(substrate: str) -> Optional[bool]:
    s = substrate.lower()
    if "iod" in s or "br" in s or "chl" in s or "tos" in s or "mes" in s or "trif" in s:
        return True
    if "oh" in s or "alkoxide" in s:
        return False
    return None


def classify_substrate(substrate: str) -> Optional[str]:
    s = substrate.lower()
    if "tert" in s or "t-" in s or "t " in s:
        return "tertiary"
    if "benzyl" in s:
        return "primary"
    if s.startswith("1-"):
        return "primary"
    if s.startswith("2-"):
        return "secondary"
    return None


def classify_solvent(solvent: str) -> Optional[str]:
    s = solvent.lower()

    protic = ["water", "ethanol", "methanol", "tbuoh", "isopropanol", "acetic acid"]
    aprotic = ["dmso", "dmf", "acetone", "acetonitrile", "thf", "dichloromethane"]

    if any(x in s for x in protic):
        return "protic"
    if any(x in s for x in aprotic):
        return "aprotic"
    return None


def classify_reagent(reagent: str) -> Optional[str]:
    s = reagent.lower()

    strong_bulky = ["tbuok", "t-buok", "lida", "dbu", "dbn"]
    if any(x in s for x in strong_bulky):
        return "strong bulky base"

    strong_nuc = ["nai", "nacn", "n3", "rs", "s-", "i-", "br-", "cl-"]
    if any(x in s for x in strong_nuc):
        return "strong nucleophile"

    weak_nuc = ["h2o", "water", "roh", "alcohol", "acetic acid"]
    if any(x in s for x in weak_nuc):
        return "weak nucleophile"

    if "naoet" in s or "etoxide" in s or "meo" in s or "oh" in s:
        return "strong nucleophile"

    return None


def expected_answers_from_prompt(prompt: PracticePrompt) -> Dict[str, str]:
    sub = classify_substrate(prompt.substrate) or ""
    lg = is_good_leaving_group(prompt.substrate)
    lg_ans = "yes" if lg is True else "no" if lg is False else ""

    reagent = classify_reagent(prompt.reagent) or ""
    solvent = classify_solvent(prompt.solvent) or ""
    heat = "yes" if prompt.heat else "no"

    return {
        "q1": sub,
        "q2": lg_ans,
        "q3": reagent,
        "q4": solvent,
        "q5": heat,
    }


def decide_pathway(answers: Dict[str, str]) -> Tuple[str, str]:
    sub = answers.get("q1", "")
    reagent = answers.get("q3", "")
    solvent = answers.get("q4", "")
    heat = answers.get("q5", "")

    if sub == "primary":
        if reagent == "strong bulky base":
            return "e2", "Primary substrate plus bulky base favors elimination over substitution"
        if reagent == "strong nucleophile" and solvent == "aprotic":
            return "sn2", "Primary substrate plus strong nucleophile in aprotic solvent favors SN2"
        if reagent == "strong nucleophile" and solvent == "protic":
            return "sn2", "Primary substrate favors SN2 even in protic solvent though rate may be slower"
        return "sn2", "Primary substrate rarely forms stable carbocations so substitution is typically SN2"

    if sub == "secondary":
        if reagent == "strong bulky base":
            return "e2", "Secondary substrate plus bulky base favors E2"
        if reagent == "strong nucleophile" and solvent == "aprotic":
            return "sn2", "Secondary substrate with strong nucleophile in aprotic solvent favors SN2"
        if reagent == "strong nucleophile" and solvent == "protic":
            if heat == "yes":
                return "e2", "Heat and protic conditions often bias toward elimination"
            return "sn2", "Strong nucleophile can still drive SN2 but competition exists"
        if reagent == "weak nucleophile":
            if heat == "yes":
                return "e1", "Weak nucleophile with heat favors elimination via E1 if carbocation can form"
            return "sn1", "Weak nucleophile in protic conditions favors SN1 if carbocation can form"
        return "sn2", "Defaulting to SN2 for secondary when strong nucleophile is present"

    if sub == "tertiary":
        if reagent == "strong bulky base":
            return "e2", "Tertiary substrate blocks SN2 and strong base favors E2"
        if heat == "yes":
            return "e1", "Tertiary substrate forms carbocation and heat biases elimination E1"
        return "sn1", "Tertiary substrate forms carbocation and SN1 dominates with weak nucleophiles"

    return "sn2", "Insufficient data defaulting to SN2"


def validate_step(qid: str, user_answer: str, expected: Dict[str, str], decided: Optional[str]) -> Tuple[bool, str]:
    ua = normalize_answer(user_answer)

    if qid == "q6":
        if decided is None:
            return False, "We have not decided the pathway yet"
        ok = ua == decided
        if ok:
            return True, "Correct"
        return False, f"Not quite. The best pathway here is {decided}"

    exp = normalize_answer(expected.get(qid, ""))
    if not exp:
        return True, "Ok"

    ok = ua == exp
    if ok:
        return True, "Correct"
    return False, f"Not quite. Expected {exp}"


def next_question(step: int) -> str:
    step = max(0, min(step, len(QUESTION_ORDER) - 1))
    return QUESTION_ORDER[step]


def get_question_payload(step: int) -> Dict[str, Any]:
    qid = next_question(step)
    return {"id": qid, "text": QUESTION_TEXT[qid]}
