import os

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():

	CSRF_ENABLED = True
	SECRET_KEY   = "77tgFCdrEEdv77554##@3" 
	
	SQLALCHEMY_TRACK_MODIFICATIONS 	= False

	SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgres@localhost:5432/buyandgo'
	
	folder_image='imagefile'
	