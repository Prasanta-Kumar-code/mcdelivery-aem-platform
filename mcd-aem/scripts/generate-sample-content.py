#!/usr/bin/env python3
"""Generate McDelivery AEM content foundation into the ui.content FileVault source.

Produces:
  * Content Fragment Models  (product, category, offer, store)
  * Sample Content Fragments (menus, deals, restaurants)
  * The project GraphQL endpoint node (/content/cq:graphql/mcd/endpoint)

Run from anywhere:  python3 mcd-aem/scripts/generate-sample-content.py
Idempotent: re-running overwrites the generated files with identical content.
"""

from __future__ import annotations

import os
from html import escape
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
JCR_ROOT = REPO_ROOT / "mcd-aem" / "ui.content" / "src" / "main" / "content" / "jcr_root"

CONF = "/conf/mcd/settings/dam/cfm/models"
DAM = "/content/dam/mcd"

# ---------------------------------------------------------------------------
# dialog field resource types (AEM Core / Granite form widgets)
# ---------------------------------------------------------------------------
TEXT = "granite/ui/components/coral/foundation/form/textfield"
MULTI = "dam/cfm/admin/components/authoring/contenteditor/multieditor"
NUMBER = "granite/ui/components/coral/foundation/form/numberfield"
CHECKBOX = "granite/ui/components/coral/foundation/form/checkbox"
DATEPICKER = "granite/ui/components/coral/foundation/form/datepicker"
CONTENT_REF = "dam/cfm/models/editor/components/contentreference"


def field(order, name, label, meta, value, resource, **extra):
    """One dialog item == one GraphQL element of the content fragment model."""
    props = {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": resource,
        "cfm-element": label,
        "fieldLabel": label,
        "listOrder": str(order),
        "metaType": meta,
        "name": name,
        "renderReadOnly": "false",
        "showEmptyInReadOnly": "true",
        "valueType": value,
    }
    props.update(extra)
    attrs = "\n".join(f'        {k}="{escape(str(v), {chr(34): "&quot;"})}"' for k, v in props.items())
    return f"                        <{name}\n{attrs}/>"


def date_field(order, name, label, meta, value, resource, **extra):
    body = field(order, name, label, meta, value, resource, **extra)
    # date pickers carry a granite:data child with the Date type hint
    body = body[:-2] + ">\n" \
        '                            <granite:data\n' \
        '                                jcr:primaryType="nt:unstructured"\n' \
        '                                typeHint="Date"/>\n' \
        f'                        </{name}>'
    return body


def model_xml(slug, title, target_path, fields):
    items = "\n".join(fields)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
    jcr:primaryType="cq:Template"
    allowedPaths="[{target_path}(/.*)?]"
    ranking="{{Long}}100">
    <jcr:content
        cq:scaffolding="{CONF}/{slug}/jcr:content/model"
        cq:templateType="/libs/settings/dam/cfm/model-types/fragment"
        jcr:primaryType="cq:PageContent"
        jcr:title="{escape(title)}"
        sling:resourceSuperType="dam/cfm/models/console/components/data/entity"
        sling:resourceType="dam/cfm/models/console/components/data/entity/default">
        <model
            cq:targetPath="{target_path}"
            jcr:primaryType="cq:PageContent"
            sling:resourceType="wcm/scaffolding/components/scaffolding"
            dataTypesConfig="/mnt/overlay/settings/dam/cfm/models/formbuilderconfig/datatypes"
            maxGeneratedOrder="50">
            <cq:dialog
                jcr:primaryType="nt:unstructured"
                sling:resourceType="cq/gui/components/authoring/dialog">
                <content
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns">
                    <items
                        jcr:primaryType="nt:unstructured"
                        maxGeneratedOrder="50">
{items}
                    </items>
                </content>
            </cq:dialog>
        </model>
    </jcr:content>
</jcr:root>
"""


MODELS = {
    "product": ("Product", f"{DAM}/products", [
        field(1, "title", "Title", "text-single", "string", TEXT, required="{Boolean}true", maxlength="160"),
        field(2, "sku", "SKU", "text-single", "string", TEXT, required="{Boolean}true", maxlength="64"),
        field(3, "description", "Description", "text-multi", "string", MULTI),
        field(4, "price", "Price", "number", "long", NUMBER, required="{Boolean}true", typeHint="long"),
        field(5, "currency", "Currency (ISO 4217)", "text-single", "string", TEXT, maxlength="3"),
        field(6, "category", "Category slug", "text-single", "string", TEXT),
        field(7, "isVeg", "Vegetarian", "boolean", "boolean", CHECKBOX, text="Vegetarian item"),
        field(8, "allergens", "Allergens (comma separated)", "text-single", "string", TEXT),
        field(9, "availability", "Availability", "text-single", "string", TEXT,
             emptyText="AVAILABLE | LIMITED | UNAVAILABLE"),
        field(10, "displayOrder", "Display order", "number", "long", NUMBER, typeHint="long"),
        field(11, "isActive", "Active", "boolean", "boolean", CHECKBOX, text="Visible on the website"),
        field(12, "image", "Product image", "reference", "string", CONTENT_REF, rootPath=DAM),
    ]),
    "category": ("Category", f"{DAM}/categories", [
        field(1, "title", "Title", "text-single", "string", TEXT, required="{Boolean}true", maxlength="80"),
        field(2, "slug", "Slug", "text-single", "string", TEXT, required="{Boolean}true"),
        field(3, "description", "Description", "text-multi", "string", MULTI),
        field(4, "image", "Category image", "reference", "string", CONTENT_REF, rootPath=DAM),
        field(5, "displayOrder", "Display order", "number", "long", NUMBER, required="{Boolean}true", typeHint="long"),
        field(6, "isActive", "Active", "boolean", "boolean", CHECKBOX, text="Discoverable on the website"),
        field(7, "locale", "Locale (BCP 47)", "text-single", "string", TEXT, required="{Boolean}true"),
    ]),
    "offer": ("Offer", f"{DAM}/offers", [
        field(1, "offerId", "Offer ID", "text-single", "string", TEXT, required="{Boolean}true"),
        field(2, "title", "Title", "text-single", "string", TEXT, required="{Boolean}true"),
        field(3, "description", "Description", "text-multi", "string", MULTI),
        field(4, "offerType", "Offer type", "text-single", "string", TEXT,
             emptyText="FIXED_DISCOUNT | PERCENT_DISCOUNT | BOGO | FREE_DELIVERY"),
        field(5, "value", "Value", "number", "long", NUMBER, typeHint="long"),
        field(6, "currency", "Currency (ISO 4217)", "text-single", "string", TEXT, maxlength="3"),
        field(7, "promoCode", "Promo code", "text-single", "string", TEXT),
        date_field(8, "startAt", "Starts at", "date", "calendar", DATEPICKER,
                   displayedFormat="YYYY-MM-DD", valueFormat="YYYY-MM-DD", type="date"),
        date_field(9, "endAt", "Ends at", "date", "calendar", DATEPICKER,
                   displayedFormat="YYYY-MM-DD", valueFormat="YYYY-MM-DD", type="date"),
        field(10, "minimumSubtotal", "Minimum subtotal", "number", "long", NUMBER, typeHint="long"),
        field(11, "isActive", "Active", "boolean", "boolean", CHECKBOX, text="Currently running"),
        field(12, "image", "Offer artwork", "reference", "string", CONTENT_REF, rootPath=DAM),
        field(13, "terms", "Terms", "text-multi", "string", MULTI),
        field(14, "locale", "Locale (BCP 47)", "text-single", "string", TEXT),
    ]),
    "store": ("Store", f"{DAM}/stores", [
        field(1, "storeId", "Store ID", "text-single", "string", TEXT, required="{Boolean}true"),
        field(2, "name", "Name", "text-single", "string", TEXT, required="{Boolean}true"),
        field(3, "address", "Address", "text-multi", "string", MULTI),
        field(4, "latitude", "Latitude", "text-single", "string", TEXT),
        field(5, "longitude", "Longitude", "text-single", "string", TEXT),
        field(6, "timezone", "Timezone (IANA)", "text-single", "string", TEXT),
        field(7, "phone", "Phone", "text-single", "string", TEXT),
        field(8, "openingHours", "Opening hours", "text-multi", "string", MULTI),
        field(9, "serviceModes", "Service modes", "text-single", "string", TEXT,
             emptyText="Delivery, Dine-in, Takeaway, Drive-thru"),
        field(10, "deliveryRadius", "Delivery radius (km)", "number", "long", NUMBER, typeHint="long"),
        field(11, "isActive", "Active", "boolean", "boolean", CHECKBOX, text="Listed for customers"),
        field(12, "temporaryClosure", "Temporarily closed", "boolean", "boolean", CHECKBOX,
               text="Temporarily closed"),
        field(13, "locale", "Locale (BCP 47)", "text-single", "string", TEXT),
    ]),
}


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")
    print(f"  wrote {path.relative_to(REPO_ROOT)}")


def fragment_xml(model, title, description, values):
    props = "\n".join(
        f'            {k}="{escape(str(v), {chr(34): "&quot;"})}"' for k, v in values.items()
    )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:dam="http://www.day.com/dam/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0"
    jcr:primaryType="dam:Asset">
    <jcr:content
        jcr:primaryType="dam:AssetContent"
        jcr:title="{escape(title)}"
        jcr:description="{escape(description)}"
        contentFragment="{{Boolean}}true">
        <metadata
            jcr:primaryType="nt:unstructured"
            cq:tags="[]"/>
        <data
            jcr:primaryType="nt:unstructured"
            cq:model="{CONF}/{model}">
            <master
                jcr:primaryType="nt:unstructured"
{props}/>
        </data>
    </jcr:content>
</jcr:root>
"""


CATEGORIES = [
    ("burgers", "Burgers & Wraps", 1, "Flame-grilled favourites and desi-style wraps, toasted to order."),
    ("chicken", "Chicken & McNuggets", 2, "Crispy chicken, nuggets and wings with your favourite dips."),
    ("sides", "Fries & Sides", 3, "The famous golden fries plus sides that complete any meal."),
    ("beverages", "Beverages", 4, "Refreshing drinks, coffee and shakes to wash it all down."),
    ("desserts", "Desserts & Shakes", 5, "Sundaes, McFlurry and warm pies for the sweet finish."),
    ("breakfast", "Breakfast", 6, "Muffins and morning bites, served until 11 AM."),
]

PRODUCTS = [
    # slug, title, sku, price, category, is_veg, description
    ("aloo-tikki", "McAloo Tikki", "MCD-BUR-001", 149, "burgers", True,
     "The Indian classic: a spiced potato patty, tangy tomato sauce and crunchy onions in a soft sesame bun."),
    ("mcveggie", "McVeggie", "MCD-BUR-002", 219, "burgers", True,
     "A crisp vegetable patty layered with fresh lettuce, cheese and our signature sauce."),
    ("mcspicy-paneer", "McSpicy Paneer", "MCD-BUR-003", 259, "burgers", True,
     "Grilled paneer patty with spicy sauce and shredded lettuce, toasted in a buttered bun."),
    ("big-mac", "Big Mac", "MCD-BUR-004", 329, "burgers", False,
     "Two beef patties, special sauce, lettuce, cheese, pickles and onions in a three part sesame bun."),
    ("mcchicken", "McChicken", "MCD-BUR-005", 219, "burgers", False,
     "A crispy chicken patty with shredded lettuce and creamy mayonnaise in a toasted bun."),
    ("mcspicy-chicken", "McSpicy Chicken Burger", "MCD-BUR-006", 269, "burgers", False,
     "A fiery crispy chicken fillet with cool mayo and lettuce for the heat lovers."),
    ("filet-o-fish", "Filet-O-Fish", "MCD-BUR-007", 279, "burgers", False,
     "A flaky fish fillet with tartar sauce and a slice of cheese in a steamed bun."),
    ("nuggets-4", "4 pc Chicken McNuggets", "MCD-CHK-001", 229, "chicken", False,
     "Four golden crispy nuggets made with 100 percent chicken breast, served with a dip."),
    ("nuggets-9", "9 pc Chicken McNuggets", "MCD-CHK-002", 429, "chicken", False,
     "Nine crispy nuggets for sharing, or not. Choose your favourite dip."),
    ("spicy-wings", "6 pc Spicy Chicken Wings", "MCD-CHK-003", 349, "chicken", False,
     "Crispy wings tossed in a smoky spicy glaze. Best finished with a cold drink."),
    ("fries-m", "World Famous Fries (M)", "MCD-SID-001", 129, "sides", True,
     "Golden, crispy, salty fries that go with literally everything."),
    ("fries-l", "World Famous Fries (L)", "MCD-SID-002", 169, "sides", True,
     "The larger size of our iconic fries for the truly hungry."),
    ("peri-peri-fries", "Peri Peri Fries", "MCD-SID-003", 179, "sides", True,
     "Classic fries dusted with a zesty peri peri seasoning."),
    ("butter-corn", "Butter Corn Cup", "MCD-SID-004", 109, "sides", True,
     "Sweet corn kernels tossed in butter and a hint of seasoning."),
    ("coke-m", "Coca-Cola (M)", "MCD-BEV-001", 109, "beverages", True,
     "Ice cold Coca-Cola to pair with your meal."),
    ("coke-l", "Coca-Cola (L)", "MCD-BEV-002", 139, "beverages", True,
     "The big cup of ice cold Coca-Cola."),
    ("iced-coffee", "McCafe Iced Coffee", "MCD-BEV-003", 199, "beverages", True,
     "Chilled coffee over ice with milk for a smooth caffeine lift."),
    ("cappuccino", "McCafe Cappuccino", "MCD-BEV-004", 219, "beverages", True,
     "Espresso steamed with milk and a light foam cap, freshly brewed."),
    ("mcflurry-oreo", "Oreo McFlurry", "MCD-DES-001", 229, "desserts", True,
     "Creamy soft serve blended with crunchy Oreo cookie pieces."),
    ("choco-sundae", "Chocolate Sundae", "MCD-DES-002", 179, "desserts", True,
     "Classic soft serve topped with rich chocolate fudge sauce."),
    ("apple-pie", "Baked Apple Pie", "MCD-DES-003", 119, "desserts", True,
     "Warm baked pie with a soft apple filling inside a crispy shell."),
    ("vanilla-cone", "Vanilla Soft Serve Cone", "MCD-DES-004", 79, "desserts", True,
     "Swirled vanilla soft serve in a crisp wafer cone."),
    ("egg-muffin", "Egg and Cheese Muffin", "MCD-BKF-001", 179, "breakfast", False,
     "A folded egg and melted cheese in a toasted English muffin."),
    ("veg-muffin", "Veggie Breakfast Muffin", "MCD-BKF-002", 169, "breakfast", True,
     "Grilled veggie patty, cheese and sauce in a warm muffin for a quick morning bite."),
]

OFFERS = [
    ("bogo-wednesdays", "BOGO-WED", "Buy 1 Get 1 Burgers", "BOGO", 1, "BOGOWED",
     "Buy any classic burger and get one free, every Wednesday.",
     "Valid on select classic burgers. Cheapest item is free. Dine-in, takeaway and delivery.",
     "2026-01-01T00:00:00.000Z", "2026-12-31T23:59:59.000Z"),
    ("free-delivery-499", "FREESHIP", "Free Delivery over 499", "FREE_DELIVERY", 499, "FREEDEL",
     "Delivery fee is waived on all orders above 499.",
     "Valid within delivery zones on orders above 499 after discounts.",
     "2026-01-01T00:00:00.000Z", "2026-12-31T23:59:59.000Z"),
    ("student-special", "STUDENT79", "Student Special 79 off", "FIXED_DISCOUNT", 79, "STUDENT79",
     "Flat 79 off any meal when you order between 2 PM and 5 PM.",
     "One redemption per customer per day. Cannot be combined with other offers.",
     "2026-01-01T00:00:00.000Z", "2026-12-31T23:59:59.000Z"),
]

STORES = [
    ("mcd-001", "McDelivery MG Road", "MG Road, Central Market, Bengaluru, Karnataka 560001",
     "12.9756", "77.6060", "+91 80 4000 1000",
     "Mon-Sun 07:00-23:00", "Delivery, Takeaway, Drive-thru", 8),
    ("mcd-002", "McDelivery City Centre", "42 Harbour Street, Mumbai, Maharashtra 400001",
     "19.0760", "72.8777", "+91 22 4000 2000",
     "Mon-Sun 08:00-01:00", "Delivery, Dine-in, Takeaway", 6),
    ("mcd-003", "McDelivery Station Road", "Station Road, Lucknow, Uttar Pradesh 226001",
     "26.8467", "80.9462", "+91 522 4000 3000",
     "Mon-Sun 08:00-23:30", "Delivery, Takeaway", 7),
]


def main() -> None:
    print(f"Generating AEM content into {JCR_ROOT}")

    for slug, (title, target, fields) in MODELS.items():
        write(JCR_ROOT / f"conf/mcd/settings/dam/cfm/models/{slug}/.content.xml",
              model_xml(slug, title, target, fields))

    for slug, title, order, description in CATEGORIES:
        write(JCR_ROOT / f"content/dam/mcd/categories/{slug}/.content.xml",
              fragment_xml("category", title, description, {
                  "title": title,
                  "slug": slug,
                  "description": description,
                  "displayOrder": "{Long}%d" % order,
                  "isActive": "{Boolean}true",
                  "locale": "en-IN",
              }))

    for slug, title, sku, price, category, is_veg, description in PRODUCTS:
        write(JCR_ROOT / f"content/dam/mcd/products/{slug}/.content.xml",
              fragment_xml("product", title, description, {
                  "title": title,
                  "sku": sku,
                  "description": description,
                  "price": "{Long}%d" % price,
                  "currency": "INR",
                  "category": category,
                  "isVeg": "{Boolean}%s" % ("true" if is_veg else "false"),
                  "allergens": "Milk, Wheat, Soy" if not is_veg else "Milk, Wheat",
                  "availability": "AVAILABLE",
                  "displayOrder": "{Long}1",
                  "isActive": "{Boolean}true",
              }))

    for slug, offer_id, title, offer_type, value, promo, description, terms, start, end in OFFERS:
        write(JCR_ROOT / f"content/dam/mcd/offers/{slug}/.content.xml",
              fragment_xml("offer", title, description, {
                  "offerId": offer_id,
                  "title": title,
                  "description": description,
                  "offerType": offer_type,
                  "value": "{Long}%d" % value,
                  "currency": "INR",
                  "promoCode": promo,
                  "startAt": "{Date}%s" % start,
                  "endAt": "{Date}%s" % end,
                  "minimumSubtotal": "{Long}0",
                  "isActive": "{Boolean}true",
                  "terms": terms,
                  "locale": "en-IN",
              }))

    for store_id, name, address, lat, lon, phone, hours, modes, radius in STORES:
        write(JCR_ROOT / f"content/dam/mcd/stores/{store_id}/.content.xml",
              fragment_xml("store", name, address, {
                  "storeId": store_id,
                  "name": name,
                  "address": address,
                  "latitude": lat,
                  "longitude": lon,
                  "timezone": "Asia/Kolkata",
                  "phone": phone,
                  "openingHours": hours,
                  "serviceModes": modes,
                  "deliveryRadius": "{Long}%d" % radius,
                  "isActive": "{Boolean}true",
                  "temporaryClosure": "{Boolean}false",
                  "locale": "en-IN",
              }))

    # Project scoped GraphQL endpoint: /content/cq:graphql/mcd/endpoint
    # The "_cq_" prefix in FileVault file names maps to the "cq:" JCR namespace,
    # so content/_cq_graphql -> /content/cq:graphql (colon is illegal on Windows).
    write(JCR_ROOT / "content/_cq_graphql/.content.xml", """<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="sling:Folder"/>
""")
    write(JCR_ROOT / "content/_cq_graphql/mcd/.content.xml", """<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="sling:Folder">
    <endpoint
        jcr:primaryType="nt:unstructured"
        jcr:title="McDelivery GraphQL Endpoint"
        sling:resourceType="graphql/sites/components/endpoint"/>
</jcr:root>
""")

    # DAM folders for the fragments (parents of the generated fragments)
    for folder, title in (("products", "Menu products"), ("categories", "Menu categories"),
                          ("offers", "Offers and deals"), ("stores", "Restaurants")):
        write(JCR_ROOT / f"content/dam/mcd/{folder}/.content.xml", f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="sling:Folder">
    <jcr:content
        jcr:primaryType="nt:unstructured"
        jcr:title="{title}"/>
</jcr:root>
""")

    print("Done.")


if __name__ == "__main__":
    main()
