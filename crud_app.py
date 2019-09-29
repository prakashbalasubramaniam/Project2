from flask import Flask, render_template, redirect, jsonify, json
from flask_pymongo import PyMongo
import crud_file, crud_linechart
from bson import json_util
from bson.json_util import dumps
from pymongo import MongoClient

app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/olympic_info_db")
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'olympic_info_db'
COLLECTION_NAME = 'olympic'
COLLECTION_NAME_LINE = 'linechart'

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/worldmap")
def worldmap_data():
    return jsonify({"key":"foo"})    

# App route for olympic data
@app.route("/uploadolympicdata")
def olympic_upload_mongo():
    olympic = mongo.db.olympic
    olympic_dict = crud_file.olympic_crud()
    olympic.update({}, olympic_dict, upsert=True)
    return redirect("/", code=302)

@app.route("/downloadolympicdata")
def olympic_download_mongo():    
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    olympic_info = collection.find()
    json_olympic_data = []    
    for i in olympic_info:
        json_olympic_data.append(i)
    json_olympic_data = json.dumps(json_olympic_data, default=json_util.default)
    connection.close()
    return json_olympic_data

# App route for line chart
@app.route("/uploadlinechartdata")
def linechart_upload_mongo():
    linechart = mongo.db.linechart
    linechart_dict = crud_linechart.populate_linechartdata()
    linechart.update({}, linechart_dict, upsert=True)
    return redirect("/", code=302)

@app.route("/downloadlinechartdata")
def linechart_download_mongo():    
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME_LINE]
    linechart_info = collection.find()
    json_linechart_data = []    
    for i in linechart_info:
        json_linechart_data.append(i)
    json_linechart_data = json.dumps(json_linechart_data, default=json_util.default)
    connection.close()
    return json_linechart_data

if __name__ == "__main__":
    # app.jinja_env.auto_reload = True
    # app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True)
