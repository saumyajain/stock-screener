import requests
import connection as conn
import json
from flask import Flask, request, jsonify
import decimal

app = Flask(__name__)
decimal.getcontext().prec = 6


@app.route('/apply_filters', methods=['POST'])
def apply_filters():
    filters = request.data
    filter_json = eval(filters)

    sql_query = "SELECT * FROM fundamental_data WHERE "
    conditions = []
    for filter_key in filter_json:
        if 'min' in filter_json[filter_key]:
            conditions.append(f"{filter_key} >= '{filter_json[filter_key]['min']}'")
        if 'max' in filter_json[filter_key]:
            conditions.append(f"{filter_key} =< '{filter_json[filter_key]['min']}'")
    sql_query += " AND ".join(conditions)
    print(sql_query)
    conn.cursor.execute(sql_query)

    stock_list = conn.cursor.fetchall()

    result = {}
    for stock in stock_list:
        stock_id = stock[0]
        details = {
            "earnings_per_share": float(stock[1]),
            "price_to_earnings": float(stock[2]),
            "price_to_book": float(stock[3])
        }
        result[stock_id] = details

    print(result)
    return json.dumps(result, indent=4)


@app.route('/get_stock_details', methods=['GET'])
def get_stock_details():
    stock_symbol = request.args.get('stock_symbol')
    sql_query = f"SELECT * FROM stock_data WHERE symbol = '{stock_symbol}'"
    sql_query2 = f"SELECT * FROM historical_data WHERE Name = '{stock_symbol}'"
    conn.cursor.execute(sql_query)
    stock_details = conn.cursor.fetchall()
    conn.cursor.execute(sql_query2)

    historical_data = conn.cursor.fetchall()
    historical_stock_value = get_historical_price(historical_data)
    details = {
        "Symbol": str(stock_details[1]),
        "Name": str(stock_details[2]),
        "Sector": str(stock_details[3]),
        "historicalPrices": historical_stock_value,

    }
    return json.dumps(details, indent=4)


def get_historical_price(historical_data):
    output = {}
    x_row = []
    y_row = []
    for row in historical_data:
        x_row.append(row['Date'])
        y_row.append(row['Close'])
    output['dates'] = x_row
    output['values'] = y_row
    return output
