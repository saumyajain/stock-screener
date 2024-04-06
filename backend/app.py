import requests
import connection as conn
import json
from flask import Flask, request, jsonify
import decimal

app = Flask(_name_)
decimal.getcontext().prec = 6


@app.route('/apply_filters', methods=['POST'])
def apply_filters():
    filters = request.data
    filter_json = eval(filters)

    sql_query = "SELECT * FROM stock_data_base WHERE "
    conditions = []
    for filter_key in filter_json:
        if 'min' in filter_json[filter_key]:
            conditions.append(f"{filter_key} > '{filter_json[filter_key]['min']}'")
        if 'max' in filter_json[filter_key]:
            conditions.append(f"{filter_key} < '{filter_json[filter_key]['max']}'")
    sql_query += " AND ".join(conditions)
    print(sql_query)
    conn.cursor.execute(sql_query)

    stock_list = conn.cursor.fetchall()

    result = {}
    for stock in stock_list:
        stock_symbol = stock[1]
        details = {
            "symbol": stock[1],
            "name": stock[2],
            "sector": stock[3],
            "volume": stock[4],
            "dividend_yield": stock[8],
            "EPS": stock[9],
            "fifty_two_week_high": stock[7],
            "fifty_two_week_low": stock[6],
            "market_cap": stock[5],
            "P/B ratio": stock[10],
            "P/E ratio": stock[11],
                }
        result[stock_symbol] = details

    print(result)
    return json.dumps(result, indent=4)


@app.route('/get_stock_details', methods=['GET'])
def get_stock_details():
    stock_symbol = request.args.get('stock_symbol')
    sql_query = f"SELECT * FROM stock_data WHERE symbol = '{stock_symbol}'"
    sql_query2 = f"SELECT * FROM historical_data WHERE Name = '{stock_symbol}'"
    conn.cursor.execute(sql_query)
    stock_list = conn.cursor.fetchall()
    stock = stock_list[0]
    conn.cursor.execute(sql_query2)

    historical_data = conn.cursor.fetchall()
    historical_stock_value = get_historical_price(historical_data)

    conn.cursor.execute(sql_query)
    result = {}
    
    stock_symbol = stock[1]
    details = {
        "symbol": stock[1],
        "name": stock[2],
        "sector": stock[3],
        "volume": stock[4],
        "dividend_yield": stock[8],
        "EPS": stock[9],
        "fifty_two_week_high": stock[7],
        "fifty_two_week_low": stock[6],
        "market_cap": stock[5],
        "P/B ratio": stock[10],
        "P/E ratio": stock[11],
        "historical_stock_data": historical_stock_value
    }
    
    result[stock_symbol] = details
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