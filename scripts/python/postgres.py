import psycopg2

try:
    conn = psycopg2.connect("dbname='mwang370' user='mwang370' host='squire.isye.gatech.edu' password='Mw02072014!'")
except Exception, e:
    print(e)
    print("I am unable to connect to the database")
