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
COLLECTION_NAME_MAP = 'world_countries'
COLLECTION_NAME_MEDAL = 'world_map'

# api route to index html
@app.route("/")
def index():
    return render_template("index.html")

# api route to global medal html
@app.route("/global_medal")
def globalmedal():
    return render_template("global_medal.html")  

# api route to olympics comparison html
@app.route("/olympics_comparison")
def olympicscomparison():
    return render_template("olympics_comparison.html")  

# api route to top olympians html
@app.route("/top_olympians")
def topolympians():
    return render_template("top_olympians.html")    

# api route to upload cleaned olympics data
@app.route("/uploadolympicdata")
def olympic_upload_mongo():
    olympic = mongo.db.olympic
    olympic_dict = crud_file.olympic_crud()
    olympic.update({}, olympic_dict, upsert=True)
    return redirect("/", code=302)

# api route to download cleaned olympics data
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

# api route to upload line chart for all years, olympics
@app.route("/uploadlinechartdata")
def linechart_upload_mongo():
    linechart = mongo.db.linechart
    linechart_dict = crud_linechart.populate_linechartdata()
    linechart.update({}, linechart_dict, upsert=True)
    return redirect("/", code=302)

# api route to download line chart for all years, olympics
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

# api route to download geojson data
@app.route("/downloadmapdata")
def mapchart_download_mongo():    
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME_MAP]
    mapchart_info = collection.find()
    json_mapchart_data = []    
    for i in mapchart_info:
         json_mapchart_data.append(i)
    json_mapchart_data = json.dumps(json_mapchart_data, default=json_util.default)
    connection.close()
    return json_mapchart_data

# api route to download medal data by country
@app.route("/downloadmapmedaldata")
def mapmedalchart_download_mongo():    
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME_MEDAL]
    mapmedalchart_info = collection.find()
    json_mapmedalchart_data = []    
    for i in mapmedalchart_info:
         json_mapmedalchart_data.append(i)
    json_mapmedalchart_data = json.dumps(json_mapmedalchart_data, default=json_util.default)
    connection.close()
    return json_mapmedalchart_data

if __name__ == "__main__":
    app.run(debug=True)
