#!/usr/bin/env python3
"""Repair Content Fragment model ``required`` properties on an existing instance.

AEM 2024.8's fragment editor reads the ``required`` property of every model
field and casts it to String (ElementEditorModelImpl#recreateVirtual). Models
generated with FileVault's ``{Boolean}true`` syntax store a Boolean, which
makes the editor fail with::

    ClassCastException: class java.lang.Boolean cannot be cast to class java.lang.String

New generations of this repository write the string ``"on"`` instead, which the
editor normalises to ``"true"``. Vault ``mode="merge"`` imports do not retype
existing properties, so instances that installed an older package keep the
Boolean values until they are rewritten.

This script is idempotent and only touches Boolean ``required`` properties.
Usage::

    python3 mcd-aem/scripts/normalize-cf-required.py
    python3 mcd-aem/scripts/normalize-cf-required.py --url http://localhost:5502 \
        --user admin --password admin --dry-run
"""
from __future__ import annotations

import argparse
import base64
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

MODELS_PATH = "/conf/mcd/settings/dam/cfm/models"


def request(url: str, auth: str, data: dict[str, str] | None = None) -> bytes:
    body = urllib.parse.urlencode(data).encode() if data else None
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Authorization": auth},
        method="POST" if data else "GET",
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://localhost:5502")
    parser.add_argument("--user", default="admin")
    parser.add_argument("--password", default="admin")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="list the affected nodes without changing them",
    )
    args = parser.parse_args()

    auth = "Basic " + base64.b64encode(
        f"{args.user}:{args.password}".encode()
    ).decode()
    query = (
        f"{args.url}/bin/querybuilder.json?path={MODELS_PATH}"
        "&type=nt:unstructured&p.limit=500&p.hits=full"
    )

    try:
        hits = json.loads(request(query, auth)).get("hits", [])
    except (urllib.error.URLError, json.JSONDecodeError) as exc:
        print(f"Cannot query AEM at {args.url}: {exc}", file=sys.stderr)
        return 1

    targets = [hit for hit in hits if isinstance(hit.get("required"), bool)]
    print(f"Boolean required properties: {len(targets)}")
    if not targets:
        return 0

    failures = 0
    for hit in targets:
        path = hit["jcr:path"]
        if args.dry_run:
            print(f"would update {path}")
            continue
        try:
            request(
                f"{args.url}{path}",
                auth,
                {"required": "on", "required@TypeHint": "String"},
            )
            print(f"updated {path}")
        except urllib.error.URLError as exc:
            failures += 1
            print(f"FAILED {path}: {exc}", file=sys.stderr)

    if args.dry_run:
        return 0

    remaining = [
        hit
        for hit in json.loads(request(query, auth)).get("hits", [])
        if isinstance(hit.get("required"), bool)
    ]
    print(f"Remaining Boolean required properties: {len(remaining)}")
    return 1 if failures or remaining else 0


if __name__ == "__main__":
    raise SystemExit(main())
