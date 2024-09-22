from flask import Flask
import pymongo

client = pymongo.MongoClient('mongo', 27017)
app = Flask(__name__)


@app.route("/")
def hello():
    file = open('./index.html')
    text = file.read()
    file.close()
    return text
