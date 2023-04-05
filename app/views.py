# -*- encoding: utf-8 -*-

import random

import numpy as np
from sqlalchemy import desc
from operator import itemgetter
import os
import glob
# Python modules
import os, logging 
import subprocess
# Flask modules
from flask               import render_template, request, url_for, redirect, send_from_directory, flash,jsonify
from flask_login         import login_user, logout_user, current_user, login_required
from werkzeug.exceptions import HTTPException, NotFound, abort
from flask.views         import MethodView
# App modules
from app        import app, lm, db, bc
from app.models import User
from app.forms  import LoginForm, RegisterForm
basedir = os.path.abspath(os.path.dirname(__file__))
print(basedir)
# provide login manager with load_user callback
@lm.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Logout user
@app.route('/logout.html')
def logout():
    logout_user()
    return redirect(url_for('index'))

# Register a new user
@app.route('/auth/register', methods=['GET', 'POST'])
def register():
    data=request.json
    # Declare the login form
    #form = LoginForm(request.form)
    print('--------------data-----------')
    print(data)
    print('-------------------------')
    # declare the Registration Form
    form = RegisterForm(request.form)

    msg = None

    if request.method == 'GET': 

        return msg
                
    # check if both http method is POST and form is valid on submit

    # assign form data to variables
    username = data['username']
    password = data['password']
    email    = data['email']
    name     = data['firstName']+ ' '+  data['lastName'],
    gender   = data['gender'],
    address  = data['address'],
    profession = data['profession'],
    if type(data['authorities']) == dict:
        is_admin = data['authorities']['isAdmin']
    elif type(data['authorities']) == list:
        is_admin = data['authorities'][0]['isAdmin']
    # filter User out of database through username
    user = User.query.filter_by(username=username).first()

    # filter User out of database through username
    user_by_email = User.query.filter_by(email=email).first()

    if user or user_by_email:
        msg = 'Error: User exists!'
    
    else:         
        pw_hash = bc.generate_password_hash(password).decode('utf-8')

        user = User(username, email, pw_hash, name, gender, profession,address,0)
        user.save()

        msg = 'User created, please <a href="' + url_for('login') + '">login</a>'       

    return msg

# Authenticate user
@app.route('/auth/login', methods=['GET','POST'])
def login():
    data=request.json
    # Declare the login form
    #form = LoginForm(request.form)
    print('--------------data-----------')
    print(data)
    print('-------------------------')

    # Flask message injected into the page, in case of any errors
    msg = None

    # check if both http method is POST and form is valid on submit
    #if form.validate_on_submit():

        # assign form data to variables
    username = data['username']
    password = data['password']
        # filter User out of database through username
    user = User.query.filter_by(username=username).first()
    print('--------------user-----------')
    if user:
        user_dict = user.to_dict()
        return jsonify(user_dict)
    print('--------------user-----------')
    if user:
        if bc.check_password_hash(user.password, password):
            #if user.password == password:
            login_user(user)
        else:
            msg = "Wrong password. Please try again."
    else:
            msg = "Unkkown user"
    return jsonify(user_dict)

# App main route + generic routing
@app.route('/', defaults={'path': 'index.html'})

@app.route('/<path>')
def index(path):

    if not current_user.is_authenticated:
        return redirect(url_for('login'))

    content = None

    try:

        # try to match the pages defined in -> pages/<input file>
        return render_template('layouts/default.html',
                                content=render_template( 'pages/'+path) )
    except:
        
        return render_template('layouts/auth-default.html',
                                content=render_template( 'pages/404.html' ) )
 
@app.route('/users.html', methods=['GET', 'POST'])
def users():
    user = User.query.all()
    return render_template('layouts/default.html',
                                content=render_template('pages/users.html', len = len(user), user=user ) )


    file = request.files["uploadwav"]
    input_path = os.path.join(app.config["AUDIO_UPLOADS"], file.filename)
    file.save(input_path)

    # Reproducible results.
    np.random.seed(123)
    random.seed(123)

    # Define the model here.
    model = DeepSpeakerModel()

    # Load the checkpoint.
    model.m.load_weights(os.path.join(basedir, "../speaker/ResCNN_triplet_training_checkpoint_265.h5"), by_name=True)

    # Sample some input for WAV file.
    mfcc_001 = sample_from_mfcc(read_mfcc(os.path.join(app.config["AUDIO_UPLOADS"], file.filename), SAMPLE_RATE), NUM_FRAMES)

    # Call the model to get the embeddings of shape (1, 512) for the input file.
    predict_001 = model.m.predict(np.expand_dims(mfcc_001, axis=0))

    # In[8]:
    results = []
                                
    for filename in glob.glob(os.path.join(os.path.join(basedir, app.config["SPEAKERS"]),'*.wav')):
        mfcc_002 = sample_from_mfcc(read_mfcc(filename, SAMPLE_RATE), NUM_FRAMES)
        predict_002 = model.m.predict(np.expand_dims(mfcc_002, axis=0))
        similarity = batch_cosine_similarity(predict_001, predict_002)
        results.append({
            'similarity': similarity,
            'path': filename 
        })
       
    # In[14]:
    max_val = max(results, key=itemgetter('similarity'))
    if max_val['similarity'] < 0.5:
        return render_template('layouts/default.html',
                                content=render_template('pages/index.html', error="Locuteurs n'existe pas !"))

    records = db.session.query(Record).filter_by(path=max_val['path']).all()
    if len(records) > 0:
        for record in records:
            recordObj = {'id': record.id,
                        'path': record.path,
                        'user': record.owner_id,
                        }
    else:
        return render_template('layouts/default.html',
                                content=render_template('pages/index.html', error="le locuteur est inconnu", file=max_val['path']))

    speakers = db.session.query(Speaker).filter_by(id=recordObj['user']).all()

    for speaker in speakers:
        speakerObject = {'id': speaker.id,
                    'nom': speaker.nom,
                    'prenom': speaker.prenom,
                    'cin': speaker.cin,
                    'profession': speaker.profession,
                    'genre': speaker.genre,
                    'adresse': speaker.adresse,
                    'phone':speaker.phone,
                    'datedn':speaker.datedn
                    }
    if current_user:
        history = History(getattr(current_user, "id"), input_path, max_val['path'], speakerObject['id'])
        history.save()

    return render_template('layouts/default.html',
                                content=render_template('pages/index.html', user=speakerObject))

@app.route('/api/user/addUser', methods=['GET', 'POST'])
def insert():
    if current_user.is_admin:
        msg = None

        # assign form data to variables
        username = request.form.get('username', '', type=str)
        password = request.form.get('password', '', type=str) 
        email    = request.form.get('email'   , '', type=str) 
        name     = request.form.get('prenom'   , '', type=str) + ' '+ request.form.get('nom'   , '', type=str)
        gender   = request.form.get('sexe'   , '', type=str)
        address  = request.form.get('adresse', '', type=str) + ' ' + request.form.get('zip', '', type=str)
        profession = request.form.get('profession'   , '', type=str)

        # filter User out of database through username
        user = User.query.filter_by(user=username).first()

        # filter User out of database through username
        user_by_email = User.query.filter_by(email=email).first()

        if user or user_by_email:
            msg = 'Error: User exists!'
        
        else:         

            pw_hash = bc.generate_password_hash(password)

            user = User(username, email, pw_hash, name, gender, profession, address)

            user.save()       

    return redirect(url_for('users'))

@app.route('/update', methods=['GET', 'POST'])
def update():
    if request.method == 'POST':
        form = request.form
        user = User.query.filter_by(id=form.get('id')).first()
        user.name = form.get('prenom', '', type=str) + ' ' + form.get('nom', '', type=str)
        user.user = form.get('username', '', type=str)
        user.email = form.get('email', '', type=str)
        user.profession = form.get('profession', '', type=str)
        user.gender = form.get('sexe', '', type=str)
        user.address = form.get('address', '', type=str)
        db.session.commit()
        flash("Utilisateur a été mis à jour")
    return redirect(url_for('users'))
        
