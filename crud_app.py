from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import crud_file


app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/olympic_info_db")

@app.route("/")
def index():
    olympic_info = mongo.db.olympic.find_one()
    return render_template("index.html")


@app.route("/olympic_crud")
def olympic_crud_mongo():
    olympic = mongo.db.olympic
    olympic_dict = crud_file.olympic_crud()

    olympic.update({}, olympic_dict, upsert=True)
    return redirect("/", code=302)
    #return ("/localhost/olympic_crud")

if __name__ == "__main__":
    app.run(debug=True)
