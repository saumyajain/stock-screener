import mysql.connector

conn = mysql.connector.connect(
    host='localhost',
    port=3306,
    user='root',
    password='StinkyCat123!',
    database='stock_scanner'
)

cursor = conn.cursor()