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


def xml_value(value) -> str:
    """Escape an XML attribute value.

    Non-ASCII characters are emitted as numeric character references: AEM's
    FileVault importer reads .content.xml with the platform charset, so a raw
    rupee sign or em dash would otherwise be stored as mojibake.
    """
    text = escape(str(value), {'"': "&quot;"})
    return "".join(ch if ord(ch) < 128 else f"&#{ord(ch)};" for ch in text)


def field(order, name, label, meta, value, resource, **extra):
    """One dialog item == one GraphQL element of the content fragment model.

    ``required`` is deliberately written as the string ``"on"``. AEM 2024.8's
    fragment editor casts the stored property to String; FileVault's
    ``{Boolean}true`` form is stored as a Boolean and makes the editor fail
    with ``ClassCastException: Boolean cannot be cast to String``. The editor
    normalises ``"on"`` back to ``"true"`` when it renders the field.
    """
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
    attrs = "\n".join(f'        {k}="{xml_value(v)}"' for k, v in props.items())
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
        jcr:title="{xml_value(title)}"
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
    "site-settings": ("Site Settings", f"{DAM}/settings", [
        field(1, "brandName", "Brand name", "text-single", "string", TEXT, required="on", maxlength="80"),
        field(2, "brandTagline", "Brand tagline", "text-single", "string", TEXT, maxlength="120"),
        field(3, "allItemsLabel", "All items label", "text-single", "string", TEXT, maxlength="60"),
        field(4, "accountLabel", "Account label", "text-single", "string", TEXT, maxlength="60"),
        field(5, "orderCtaLabel", "Order CTA label", "text-single", "string", TEXT, maxlength="60"),
        field(6, "orderCtaHref", "Order CTA link", "text-single", "string", TEXT, maxlength="200"),
        field(7, "currencySymbol", "Currency symbol", "text-single", "string", TEXT, maxlength="8"),
        field(8, "metaTitle", "Page title (SEO)", "text-single", "string", TEXT, maxlength="160"),
        field(9, "metaDescription", "Page description (SEO)", "text-multi", "string", MULTI),
        field(10, "defaultProductDescription", "Default product description", "text-single", "string", TEXT, maxlength="200"),
        field(11, "vegLabel", "Vegetarian badge", "text-single", "string", TEXT, maxlength="40"),
        field(12, "nonVegLabel", "Non-vegetarian badge", "text-single", "string", TEXT, maxlength="40"),
        field(13, "addToCartLabel", "Add to cart label", "text-single", "string", TEXT, maxlength="60"),
        field(14, "cartEyebrow", "Cart eyebrow", "text-single", "string", TEXT, maxlength="60"),
        field(15, "cartTitle", "Cart title", "text-single", "string", TEXT, maxlength="80"),
        field(16, "cartEmptyMessage", "Empty cart message", "text-single", "string", TEXT, maxlength="160"),
        field(17, "cartSubtotalLabel", "Subtotal label", "text-single", "string", TEXT, maxlength="40"),
        field(18, "checkoutLabel", "Checkout label", "text-single", "string", TEXT, maxlength="60"),
        field(19, "closeLabel", "Close label", "text-single", "string", TEXT, maxlength="40"),
        field(20, "storeBadgeLabel", "Store badge label", "text-single", "string", TEXT, maxlength="80"),
        field(21, "footerCompanyTitle", "Footer column: company", "text-single", "string", TEXT, maxlength="40"),
        field(22, "footerPolicyTitle", "Footer column: policy", "text-single", "string", TEXT, maxlength="40"),
        field(23, "footerToolsTitle", "Footer column: tools", "text-single", "string", TEXT, maxlength="40"),
        field(24, "footerSocialTitle", "Footer column: social", "text-single", "string", TEXT, maxlength="40"),
        field(25, "copyright", "Copyright line", "text-single", "string", TEXT, maxlength="200"),
        field(26, "footerNote", "Footer note", "text-multi", "string", MULTI),
        field(27, "bannerHint", "Fallback banner hint", "text-multi", "string", MULTI),
        field(28, "locale", "Locale (BCP 47)", "text-single", "string", TEXT),
        field(29, "isActive", "Active", "boolean", "boolean", CHECKBOX, text="Publish this site configuration"),
        field(30, "bannerMessage", "Fallback banner message", "text-single", "string", TEXT, maxlength="200"),
        field(31, "copyCodeLabel", "Copy code label", "text-single", "string", TEXT, maxlength="40"),
        field(32, "copiedLabel", "Copied label", "text-single", "string", TEXT, maxlength="40"),
        field(33, "saveLabel", "Save label", "text-single", "string", TEXT, maxlength="40"),
        field(34, "itemSingularLabel", "Item count (singular)", "text-single", "string", TEXT, maxlength="40"),
        field(35, "itemPluralLabel", "Item count (plural)", "text-single", "string", TEXT, maxlength="40"),
        field(36, "perItemLabel", "Per item label", "text-single", "string", TEXT, maxlength="40"),
        field(37, "removeLabel", "Remove label", "text-single", "string", TEXT, maxlength="40"),
    ]),
    "hero": ("Hero", f"{DAM}/heroes", [
        field(1, "heroId", "Hero ID", "text-single", "string", TEXT, required="on"),
        field(2, "title", "Internal title", "text-single", "string", TEXT, required="on", maxlength="120"),
        field(3, "eyebrow", "Eyebrow", "text-single", "string", TEXT, maxlength="80"),
        field(4, "headline", "Headline", "text-single", "string", TEXT, required="on", maxlength="120"),
        field(5, "subheadline", "Sub-headline", "text-single", "string", TEXT, maxlength="120"),
        field(6, "description", "Description", "text-multi", "string", MULTI),
        field(7, "primaryCtaLabel", "Primary CTA label", "text-single", "string", TEXT, maxlength="60"),
        field(8, "primaryCtaHref", "Primary CTA link", "text-single", "string", TEXT, maxlength="200"),
        field(9, "secondaryCtaLabel", "Secondary CTA label", "text-single", "string", TEXT, maxlength="60"),
        field(10, "secondaryCtaHref", "Secondary CTA link", "text-single", "string", TEXT, maxlength="200"),
        field(11, "badgeText", "Promo badge", "text-single", "string", TEXT, maxlength="80"),
        field(12, "image", "Hero image", "reference", "string", CONTENT_REF, rootPath=DAM),
        field(13, "variant", "Variant", "text-single", "string", TEXT, emptyText="campaign | deal"),
        field(14, "displayOrder", "Display order", "number", "long", NUMBER, typeHint="long"),
        field(15, "isActive", "Active", "boolean", "boolean", CHECKBOX, text="Render this hero"),
    ]),
    "page-section": ("Page Section", f"{DAM}/sections", [
        field(1, "sectionKey", "Section key", "text-single", "string", TEXT, required="on",
              emptyText="hero | deals | menu | locations"),
        field(2, "eyebrow", "Eyebrow", "text-single", "string", TEXT, maxlength="80"),
        field(3, "heading", "Heading", "text-single", "string", TEXT, required="on", maxlength="120"),
        field(4, "emptyMessage", "Empty state message", "text-single", "string", TEXT, maxlength="200"),
        field(5, "displayOrder", "Display order", "number", "long", NUMBER, required="on", typeHint="long"),
        field(6, "isActive", "Active", "boolean", "boolean", CHECKBOX, text="Render this section"),
    ]),
    "navigation-link": ("Navigation Link", f"{DAM}/navigation", [
        field(1, "label", "Label", "text-single", "string", TEXT, required="on", maxlength="60"),
        field(2, "href", "Link", "text-single", "string", TEXT, required="on", maxlength="300"),
        field(3, "linkGroup", "Link group", "text-single", "string", TEXT, required="on",
              emptyText="header | footer-company | footer-policy | footer-tools | footer-social"),
        field(4, "iconKey", "Icon key", "text-single", "string", TEXT, maxlength="40",
              emptyText="facebook | twitter | instagram"),
        field(5, "displayOrder", "Display order", "number", "long", NUMBER, typeHint="long"),
        field(6, "externalLink", "Opens in a new tab", "boolean", "boolean", CHECKBOX, text="Open in a new tab"),
        field(7, "isActive", "Active", "boolean", "boolean", CHECKBOX, text="Show this link"),
        field(8, "isCta", "Call to action", "boolean", "boolean", CHECKBOX, text="Highlight as a call to action"),
    ]),
    "feature-flag": ("Feature Flag", f"{DAM}/features", [
        field(1, "flagKey", "Flag key", "text-single", "string", TEXT, required="on",
              emptyText="deals | storeLocator | cart | account"),
        field(2, "label", "Label", "text-single", "string", TEXT, maxlength="80"),
        field(3, "description", "Description", "text-multi", "string", MULTI),
        field(4, "enabled", "Enabled", "boolean", "boolean", CHECKBOX, text="Enable this feature"),
        field(5, "displayOrder", "Display order", "number", "long", NUMBER, typeHint="long"),
    ]),
    "product": ("Product", f"{DAM}/products", [
        field(1, "title", "Title", "text-single", "string", TEXT, required="on", maxlength="160"),
        field(2, "sku", "SKU", "text-single", "string", TEXT, required="on", maxlength="64"),
        field(3, "description", "Description", "text-multi", "string", MULTI),
        field(4, "price", "Price", "number", "long", NUMBER, required="on", typeHint="long"),
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
        field(1, "title", "Title", "text-single", "string", TEXT, required="on", maxlength="80"),
        field(2, "slug", "Slug", "text-single", "string", TEXT, required="on"),
        field(3, "description", "Description", "text-multi", "string", MULTI),
        field(4, "image", "Category image", "reference", "string", CONTENT_REF, rootPath=DAM),
        field(5, "displayOrder", "Display order", "number", "long", NUMBER, required="on", typeHint="long"),
        field(6, "isActive", "Active", "boolean", "boolean", CHECKBOX, text="Discoverable on the website"),
        field(7, "locale", "Locale (BCP 47)", "text-single", "string", TEXT, required="on"),
    ]),
    "offer": ("Offer", f"{DAM}/offers", [
        field(1, "offerId", "Offer ID", "text-single", "string", TEXT, required="on"),
        field(2, "title", "Title", "text-single", "string", TEXT, required="on"),
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
        field(1, "storeId", "Store ID", "text-single", "string", TEXT, required="on"),
        field(2, "name", "Name", "text-single", "string", TEXT, required="on"),
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
        f'            {k}="{xml_value(v)}"' for k, v in values.items()
    )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:dam="http://www.day.com/dam/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0"
    jcr:primaryType="dam:Asset">
    <jcr:content
        jcr:primaryType="dam:AssetContent"
        jcr:title="{xml_value(title)}"
        jcr:description="{xml_value(description)}"
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

SITE_SETTINGS = {
    "brandName": "McDelivery",
    "brandTagline": "Hot & fresh, right away",
    "allItemsLabel": "All items",
    "accountLabel": "Sign in",
    "orderCtaLabel": "Order now",
    "orderCtaHref": "#menu",
    "currencySymbol": "₹",
    "metaTitle": "McDelivery | Good food. Good mood.",
    "metaDescription": "Browse the full McDelivery menu, unlock today's deals and find the restaurant nearest to you.",
    "defaultProductDescription": "A delicious choice for your next meal.",
    "vegLabel": "Veg",
    "nonVegLabel": "Non-veg",
    "addToCartLabel": "Add to order",
    "cartEyebrow": "Ready when you are",
    "cartTitle": "Your order",
    "cartEmptyMessage": "Your cart is empty.",
    "cartSubtotalLabel": "Subtotal",
    "checkoutLabel": "Continue to checkout",
    "closeLabel": "Close",
    "storeBadgeLabel": "Accepts delivery orders",
    "footerCompanyTitle": "Link",
    "footerPolicyTitle": "Policy",
    "footerToolsTitle": "Tools",
    "footerSocialTitle": "Follow us",
    "copyright": "© 2026 McDelivery. A learning project — not affiliated with McDonald's.",
    "footerNote": "Learning project — built with AEM, Next.js, Spring Boot and PostgreSQL.",
    "bannerMessage": "Showing bundled seed content because {count} content source(s) could not be reached",
    "bannerHint": "Start the AEM SDK and install the mcd content package to load the authored experience instead.",
    "copyCodeLabel": "Copy code",
    "copiedLabel": "Copied",
    "saveLabel": "Save",
    "itemSingularLabel": "item",
    "itemPluralLabel": "items",
    "perItemLabel": "each",
    "removeLabel": "Remove",
    "locale": "en-IN",
    "isActive": "{Boolean}true",
}

HEROES = [
    ("main", "Home hero", "Made for your moment", "Good food. Good mood.", "",
     "Freshly grilled, made to order. Browse the menu, build your favourite meal and get it delivered hot.",
     "Order now", "#menu", "See the deals", "#deals", "Free delivery over ₹499",
     "campaign", 1),
]

SECTIONS = [
    # key, eyebrow, heading, order
    ("hero", "", "", 1),
    ("menu", "Made for your moment", "Explore the menu", 2),
    ("deals", "Today's specials", "Deals that hit the spot", 3),
    ("locations", "Near by you", "Find your nearest McDelivery", 4),
]

EMPTY_MESSAGES = {
    "menu": "No products are available in this category.",
    "deals": "No active offers right now. Check back soon.",
    "locations": "No active stores right now.",
}

NAVIGATION = [
    # slug, label, href, group, icon, order
    ("header-menu", "Menu", "#menu", "header", "", 1),
    ("header-deals", "Deals", "#deals", "header", "", 2),
    ("header-locations", "Locations", "#locations", "header", "", 3),
    ("header-order", "Order Now", "#menu", "header", "", 4),
]

CTA_LINKS = {"header-order"}

NAVIGATION_TAIL = [
    ("footer-company-contact", "Contact Us", "#", "footer-company", "", 1),
    ("footer-company-careers", "Careers", "#", "footer-company", "", 2),
    ("footer-company-history", "Our History", "#", "footer-company", "", 3),
    ("footer-company-newsroom", "Newsroom", "#", "footer-company", "", 4),
    ("footer-company-suppliers", "Our Suppliers", "#", "footer-company", "", 5),
    ("footer-company-sustainability", "Sustainability", "#", "footer-company", "", 6),
    ("footer-policy-terms", "Terms & Conditions", "#", "footer-policy", "", 1),
    ("footer-policy-privacy", "Privacy Policy", "#", "footer-policy", "", 2),
    ("footer-policy-accessibility", "Accessibility", "#", "footer-policy", "", 3),
    ("footer-policy-privacy-choices", "Your Privacy Choices", "#", "footer-policy", "", 4),
    ("footer-policy-ca-privacy", "CA Privacy Rights", "#", "footer-policy", "", 5),
    ("footer-policy-interest-ads", "Interest-Based Ads", "#", "footer-policy", "", 6),
    ("footer-tools-app-store", "Download on the App Store", "#", "footer-tools", "", 1),
    ("footer-tools-google-play", "Get it on Google Play", "#", "footer-tools", "", 2),
    ("footer-social-facebook", "Facebook", "#", "footer-social", "facebook", 1),
    ("footer-social-twitter", "Twitter", "#", "footer-social", "twitter", 2),
    ("footer-social-instagram", "Instagram", "#", "footer-social", "instagram", 3),
]

NAVIGATION += NAVIGATION_TAIL

FEATURE_FLAGS = [
    # flag, label, description, enabled, order
    ("hero", "Hero banner", "Show the campaign hero at the top of the page.", "true", 1),
    ("deals", "Deals strip", "Show the active offers and promo codes.", "true", 2),
    ("menu", "Menu browser", "Show the product grid and category filters.", "true", 3),
    ("menuFilters", "Category filters", "Show the category pill navigation above the menu.", "true", 4),
    ("storeLocator", "Store locator", "Show the restaurant cards and service modes.", "true", 5),
    ("cart", "Cart drawer", "Allow customers to add products and open the cart.", "true", 6),
    ("account", "Account entry point", "Show the sign-in entry point in the header.", "true", 7),
    ("vegBadges", "Diet badges", "Show the vegetarian and non-vegetarian badges on product cards.", "true", 8),
    ("footerSocial", "Footer social links", "Show the social media icons in the footer.", "true", 9),
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

    write(JCR_ROOT / "content/dam/mcd/settings/global/.content.xml",
          fragment_xml("site-settings", "Global site settings",
                       "Brand, copy, labels and SEO defaults for the storefront.", SITE_SETTINGS))

    for slug, title, eyebrow, headline, subheadline, description, primary_label, primary_href, \
            secondary_label, secondary_href, badge, variant, order in HEROES:
        values = {
            "heroId": slug,
            "title": title,
            "eyebrow": eyebrow,
            "headline": headline,
            "description": description,
            "primaryCtaLabel": primary_label,
            "primaryCtaHref": primary_href,
            "secondaryCtaLabel": secondary_label,
            "secondaryCtaHref": secondary_href,
            "badgeText": badge,
            "variant": variant,
            "displayOrder": "{Long}%d" % order,
            "isActive": "{Boolean}true",
        }
        if subheadline:
            values["subheadline"] = subheadline
        write(JCR_ROOT / f"content/dam/mcd/heroes/{slug}/.content.xml",
              fragment_xml("hero", title, headline, values))

    for key, eyebrow, heading, order in SECTIONS:
        values = {
            "sectionKey": key,
            "heading": heading or key.title(),
            "displayOrder": "{Long}%d" % order,
            "isActive": "{Boolean}true",
        }
        if eyebrow:
            values["eyebrow"] = eyebrow
        if key in EMPTY_MESSAGES:
            values["emptyMessage"] = EMPTY_MESSAGES[key]
        write(JCR_ROOT / f"content/dam/mcd/sections/{key}/.content.xml",
              fragment_xml("page-section", heading or key.title(), eyebrow or heading, values))

    for slug, label, href, group, icon, order in NAVIGATION:
        values = {
            "label": label,
            "href": href,
            "linkGroup": group,
            "displayOrder": "{Long}%d" % order,
            "externalLink": "{Boolean}false",
            "isActive": "{Boolean}true",
            "isCta": "{Boolean}%s" % ("true" if slug in CTA_LINKS else "false"),
        }
        if icon:
            values["iconKey"] = icon
        write(JCR_ROOT / f"content/dam/mcd/navigation/{slug}/.content.xml",
              fragment_xml("navigation-link", label, href, values))

    for flag, label, description, enabled, order in FEATURE_FLAGS:
        write(JCR_ROOT / f"content/dam/mcd/features/{flag}/.content.xml",
              fragment_xml("feature-flag", label, description, {
                  "flagKey": flag,
                  "label": label,
                  "description": description,
                  "enabled": "{Boolean}%s" % enabled,
                  "displayOrder": "{Long}%d" % order,
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
                          ("offers", "Offers and deals"), ("stores", "Restaurants"),
                          ("heroes", "Hero banners"), ("sections", "Page sections"),
                          ("navigation", "Navigation links"), ("features", "Feature flags"),
                          ("settings", "Site settings")):
        write(JCR_ROOT / f"content/dam/mcd/{folder}/.content.xml", f"""<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="sling:Folder">
    <jcr:content
        jcr:primaryType="nt:unstructured"
        jcr:title="{title}"/>
</jcr:root>
""")

    validate_models()
    print("Done.")


def validate_models() -> None:
    """Guard the fragment-editor workaround: ``required`` must stay a String.

    FileVault's ``{Boolean}true`` form stores a Boolean, which crashes
    AEM 2024.8's fragment editor (see the ``field`` docstring).
    """
    models_dir = JCR_ROOT / "conf/mcd/settings/dam/cfm/models"
    offenders = [
        path
        for path in models_dir.glob("*/.content.xml")
        if 'required="{Boolean}' in path.read_text(encoding="utf-8")
    ]
    if offenders:
        raise SystemExit(
            "required must be the string 'on', not a typed Boolean: "
            + ", ".join(str(path) for path in offenders)
        )


if __name__ == "__main__":
    main()
