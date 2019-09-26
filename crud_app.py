from flask import Flask, render_template, redirect, jsonify, json
from flask_pymongo import PyMongo
import crud_file
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

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/worldmap")
def worldmap_data():
    return jsonify({"key":"foo"})    

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

if __name__ == "__main__":
    # app.jinja_env.auto_reload = True
    # app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True)
