from flask import Flask, render_template, request, jsonify
import requests
from ebay_oauth_token import OAuthToken

application = Flask(__name__, static_url_path="/static")

# eBay API endpoint
EBAY_API_ENDPOINT = "https://svcs.ebay.com/services/search/FindingService/v1"
EBAY_APP_ID = "Your_EBAY_APP_ID"


@application.route("/")
def index():
    return render_template("index.html")


@application.route("/search", methods=["GET"])
def search_ebay():
    print(request.args)
    keywords = request.args.get("keywords")
    min_price = request.args.get("price_from")
    max_price = request.args.get("price_to")
    conditions = request.args.getlist("condition[]")
    returns_accepted = request.args.get("returns_accepted")
    free_shipping = request.args.get("free_shipping")
    expedited_shipping = request.args.get("expedited_shipping")
    sort_order = request.args.get("sort_order", "BestMatch")

    # Construct the eBay API request parameters
    params = {
        "keywords": keywords,
        "OPERATION-NAME": "findItemsAdvanced",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": EBAY_APP_ID,
        "RESPONSE-DATA-FORMAT": "JSON",
        "sortOrder": sort_order,
    }

    # Construct item filter based on user selections
    filter_count = 0

    # Price Range From
    if min_price:
        params[f"itemFilter({filter_count}).name"] = "MinPrice"
        params[f"itemFilter({filter_count}).value"] = min_price
        params[f"itemFilter({filter_count}).paramName"] = "Currency"
        params[f"itemFilter({filter_count}).paramValue"] = "USD"
        filter_count += 1

    # Price Range To
    if max_price:
        params[f"itemFilter({filter_count}).name"] = "MaxPrice"
        params[f"itemFilter({filter_count}).value"] = max_price
        params[f"itemFilter({filter_count}).paramName"] = "Currency"
        params[f"itemFilter({filter_count}).paramValue"] = "USD"
        filter_count += 1

    # Condition
    if conditions:
        for idx, cond in enumerate(conditions):
            params[f"itemFilter({filter_count}).name"] = "Condition"
            params[f"itemFilter({filter_count}).value({idx})"] = cond
        filter_count += 1

    # Seller - Returns Accepted
    if returns_accepted:
        params[f"itemFilter({filter_count}).name"] = "ReturnsAcceptedOnly"
        params[f"itemFilter({filter_count}).value"] = "true"
        filter_count += 1

    # Shipping - Free Shipping
    if free_shipping:
        params[f"itemFilter({filter_count}).name"] = "FreeShippingOnly"
        params[f"itemFilter({filter_count}).value"] = "true"
        filter_count += 1

    # Shipping - Expedited shipping available
    if expedited_shipping:
        params[f"itemFilter({filter_count}).name"] = "ExpeditedShippingType"
        params[f"itemFilter({filter_count}).value"] = "Expedited"
        filter_count += 1
    print(params)

    response = requests.get(EBAY_API_ENDPOINT, params=params)

    if response.status_code == 200:
        ebay_data = response.json()
        return jsonify(ebay_data)
    else:
        return jsonify({"error": "Failed to retrieve data from eBay"})


@application.route("/get_item_info", methods=["GET"])
def get_item_info():
    itemId = request.args.get("itemId")

    # Construct the eBay API request parameters
    params = {
        "callname": "GetSingleItem",
        "responseencoding": "JSON",
        "appid": EBAY_APP_ID,
        "siteid": "0",
        "version": "967",
        "ItemID": itemId,
        "IncludeSelector": "Description,Details,ItemSpecifics",
    }

    # Config header
    client_id = EBAY_APP_ID
    client_secret = "PRD-d9ea8859f473-56de-4c61-98b4-4bd6"
    oauth_utility = OAuthToken(client_id, client_secret)
    application_token = oauth_utility.getApplicationToken()

    headers = {"X-EBAY-API-IAF-TOKEN": application_token}

    print(params)
    response = requests.get(
        "https://open.api.ebay.com/shopping", params=params, headers=headers
    )

    if response.status_code == 200:
        item_info = response.json()
        return jsonify(item_info)
    else:
        return jsonify({"error": "Failed to retrieve data from eBay"})


if __name__ == "__main__":
    application.run(debug=True, port=8000)
