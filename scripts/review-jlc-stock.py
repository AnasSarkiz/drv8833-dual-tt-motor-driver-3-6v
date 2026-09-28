"""Capture public JLCPCB catalog fields without retaining signed media URLs.

This is a catalog snapshot, not a reservation or an accepted assembly quote.
Run from the repository root. Quantity excludes assembler-calculated attrition.
"""

from datetime import datetime, timezone
from pathlib import Path
import hashlib
import os
import json
import re
import sys
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
DESTINATION = ROOT / os.environ.get("DUAL_TT_REVIEW_DIR", "artifacts/order-review")
FIELDS = [
    "componentCode", "componentModelEn", "componentBrandEn",
    "componentSpecificationEn", "overseasStockCount", "canPresaleNumber",
    "componentLibraryType", "assemblyComponentFlag", "isBuyComponent",
    "allowPostFlag", "lossNumber", "leastPatchNumber", "preMinPurchaseNum",
    "noBuyReason", "initialPrice", "componentSource", "smtComponentType",
    "componentAssemblyType", "pcbaType", "orderInstructionEnglish",
]


def inspect_part(part):
    c_number = part["C-number"]
    url = f"https://jlcpcb.com/partdetail/{c_number}"
    with urllib.request.urlopen(url, timeout=60) as response:
        html = response.read()
    chunks = re.findall(
        r"self\.__next_f\.push\((\[1,.*?\])\)</script>", html.decode()
    )
    flight = "".join(json.loads(chunk)[1] for chunk in chunks)
    objects = []
    decoder = json.JSONDecoder()
    for match in re.finditer(r"\{", flight):
        try:
            candidate, _ = decoder.raw_decode(flight[match.start():])
        except json.JSONDecodeError:
            # React Flight also contains module descriptors and raw text.
            continue
        if (isinstance(candidate, dict)
                and candidate.get("componentCode") == c_number
                and "overseasStockCount" in candidate):
            objects.append(candidate)
    if not objects:
        raise ValueError(f"No exact stock-bearing catalog record for {c_number}")
    counts = {candidate["overseasStockCount"] for candidate in objects}
    if len(counts) != 1 or not isinstance(next(iter(counts)), int):
        raise ValueError(f"Ambiguous stock for {c_number}: {counts}")
    selected_fields = {}
    for candidate in objects:
        for key in FIELDS:
            if key in candidate:
                selected_fields[key] = candidate[key]
    result = {
        "c_number": c_number,
        "references": part["RefDes"],
        "quantity_per_board": part["Qty"],
        "quantity_for_five_boards": part["Qty"] * 5,
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "source_url": url,
        "response_sha256": hashlib.sha256(html).hexdigest(),
        "catalog_fields": selected_fields,
        "stock_covers_placement_quantity": next(iter(counts)) >= part["Qty"] * 5,
        "available_order_quantity_covers_placements": selected_fields["canPresaleNumber"] >= part["Qty"] * 5,
        "scope": "Public catalog; assembler attrition, reservation and final order matching are separate.",
    }
    (DESTINATION / f"stock-{c_number}.json").write_text(json.dumps(result, indent=2) + "\n")
    print(c_number, next(iter(counts)), "needed", part["Qty"] * 5, flush=True)
    return result


if __name__ == "__main__":
    bom = json.loads((ROOT / "bom.json").read_text())
    DESTINATION.mkdir(parents=True, exist_ok=True)
    stock = []
    for part in bom:
        if len(sys.argv) > 1 and part["C-number"] not in sys.argv[1:]:
            continue
        try:
            stock.append(inspect_part(part))
        except (urllib.error.URLError, ValueError) as error:
            stock.append({"c_number": part["C-number"], "error": str(error)})
            print(part["C-number"], str(error), flush=True)
        time.sleep(5)  # Respect the public catalog's request rate.
    (DESTINATION / "jlc-stock.json").write_text(json.dumps(stock, indent=2) + "\n")
    if any("error" in part for part in stock):
        sys.exit(1)
