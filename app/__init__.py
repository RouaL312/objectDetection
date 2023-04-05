# -*- encoding: utf-8 -*-


import os

from flask            import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login      import LoginManager
from flask_bcrypt     import Bcrypt
from flask_admin      import Admin
from flask_cors       import CORS

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
CORS(app)
app.config.from_object('app.configuration.Config')
#app.config["AUDIO_UPLOADS"] = os.path.join(basedir, '../speaker/data/input')
#app.config["SPEAKERS"] = os.path.join(basedir,'F:/test+historique(2)/flask-speaker-id/app/static/assets/speakers')
db = SQLAlchemy  (app) # flask-sqlalchemy
bc = Bcrypt      (app) # flask-bcrypt
admin = Admin(app)
lm = LoginManager(   ) # flask-loginmanager
lm.init_app(app) # init the login manager

# Setup database
@app.before_first_request
def initialize_database():
    db.create_all()

# Import routing, models and Start the App
from app import views, models