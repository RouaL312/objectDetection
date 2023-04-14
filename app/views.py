# -*- encoding: utf-8 -*-

import random

import numpy as np
from sqlalchemy import desc, not_
from operator import itemgetter
import os
import glob
# Python modules
import os
import logging
import subprocess
# Flask modules
from flask import Config, render_template, request, send_file, session, url_for, redirect, send_from_directory, flash, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.exceptions import HTTPException, NotFound, abort
from flask.views import MethodView
from datetime import datetime, timedelta
# App modules
from app import app, lm, db, bc
from app.models import Product, User
from app.forms import LoginForm, RegisterForm
#jwt
import jwt

basedir = os.path.abspath(os.path.dirname(__file__))
print(basedir)
import secrets

secret_key = secrets.token_hex(16)
# provide login manager with load_user callback
@lm.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Logout user
@app.route('/auth/logout', methods=['POST'])
def logout():
    logout_user()

# Register a new user
@app.route('/auth/register', methods=['GET', 'POST'])
def register():
    data = request.json
    msg = None
    if request.method == 'GET':
        return msg
    # assign form data to variables
    username = data['username']
    password = data['password']
    email = data['email']
    firstName = data['firstName']
    lastName= data['lastName'],
    gender = data['gender'],
    address = data['address'],
    profession = data['profession'],
    phone = data['phone'],
    print(data)
    codePostal = data['codePostal'],
    dateDeNaissance = data['dateDeNaissance'],

    is_admin=0
    if data['authorities']:
        is_admin = data['authorities']
    # filter User out of database through username
    user = User.query.filter_by(username=username).first()
    # filter User out of database through username
    user_by_email = User.query.filter_by(email=email).first()
    if user :
        msg = 'Error: Username '+username+ ' exists!'
    elif user_by_email :
        msg = 'Error: l\'email '+email +' exists!'
    else:
        pw_hash = bc.generate_password_hash(password).decode('utf-8')
        user = User(username, email, pw_hash, firstName,lastName,
                    gender, profession, address, is_admin,phone,codePostal,dateDeNaissance)
        user.save()
        msg = 'User created'
    return  jsonify(msg)

# Authenticate user
@app.route('/auth/login', methods=['GET', 'POST'])
def login():
    data = request.json
    # assign form data to variables
    username = data['username']
    password = data['password']
    # filter User out of database through username
    user = User.query.filter_by(username=username).first()
    if bc.check_password_hash(user.password, password):
        user_dict = user.to_dict()
        jsonify(user_dict)
        # if user.password == password:
        # Generate a token for the user with an expiration time of 24 hours
        payload = {'username': username, 'exp': datetime.utcnow() + timedelta(hours=24)}
        authenticationToken = jwt.encode(payload, '77tgFCdrEEdv77554##@3', algorithm='HS256')
        user_obj_with_token = add_token_to_user(user_dict, authenticationToken)

        # Return the token in a JSON response
        login_user(user)
        # Return the user object JSON with the token in a JSON response
        return jsonify(user_obj_with_token)
# This secret key should be securely generated and stored


def add_token_to_user(user_obj, token):
    # Decode the token to extract the expiration time
    decoded_token = jwt.decode(token, app.secret_key, algorithms=['HS256'])
    expiration_time = decoded_token['exp']

    # Add the token and expiration time to the user object JSON
    user_obj['token'] = token
    user_obj['expiration_time'] = expiration_time

    return user_obj
@app.route('/api/user/users', methods=['GET'])
def getUsers():
    login = request.args.get('login')
    users = User.query.filter(not_(User.username == login)).all()
    result = []
    for user in users:
        user_data = {'id': user.id_user, 'username': user.username,
                     'password': user.password, 'email': user.email,
                     'lastName': user.lastName,'firstName':user.firstName, 'gender': user.gender, 'profession': user.profession,
                     'address': user.address, 'authorities': user.is_admin, 'phone': user.phone,'codePostal':user.codePostal,'dateDeNaissance':user.dateDeNaissance}
        result.append(user_data)
    return jsonify(result)
#get user by login
@app.route('/api/user/getUserByLogin', methods=['GET'])
def getUserByLogin():
    username = request.args.get('login')
    print(login)
    user=User.query.filter_by(username=username).first()
    user_data = {'id': user.id_user, 'username': user.username,
                'password': user.password, 'email': user.email,
                'lastName': user.lastName,'firstName':user.firstName, 'gender': user.gender, 'profession': user.profession,
                'address': user.address,'phone': user.phone,'codePostal': user.codePostal ,'dateDeNaissance': user.dateDeNaissance}
    return jsonify(user_data)

#update user
@app.route('/api/user/update', methods=['GET', 'POST'])
def update():
    data = request.get_json()
    user = User.query.filter_by(id_user=data['id']).first()
        # assign form data to variables
    user.username = data['username']
    user.email=data['email']
    user.firstName=data['firstName']
    user.lastName = data['lastName'],
    user.gender = data['gender'],
    user.address = data['address'],
    user.profession = data['profession'],
    user.phone = data['phone'],
    if(data['authorities']):
        user.is_admin = 1
    else:
        user.is_admin=0
    db.session.commit()
    return jsonify({'msg':'user added successfully'})
#delete user
#delete product
@app.route('/api/user/deleteUser', methods=['POST'])
def delete_user():
    id = request.json
    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'user not found'})
    else:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'user deleted successfully'})
#get all products
@app.route('/api/product/getAllProduct', methods=['GET'])
def getProducts():
    products = Product.query.all()
    result = []
    for product in products:
        product_data = {'id': product.id, 'code': product.code, 'name': product.name,
                        'description': product.description, 'url_image_prod': product.url_image_prod,
                        'price': product.price, 'category': product.category, 'quantity': product.quantity,
                        'inventorystatus': product.inventorystatus,
                        'rating': product.rating}

        result.append(product_data)
    return jsonify(result)
#get save a new product or update one
@app.route('/api/product/saveProduct', methods=['GET', 'POST'])
def saveProduct():
    data = request.get_json()
    # assign form data to variables
    try:
        code = data['code']
        name = data['name']
        description = data['description']
        price = data['price']
        quantity = data['quantity']
        category = data['category']
        inventorystatus = data['inventorystatus']
        url_image_prod = data['url_image_prod']
        rating = data['rating']
        # assign form data to variables
        # filter Product out of database through code
        product = Product.query.filter_by(code=code).first()
        if product:
            product.code = data.get('code', product.code)
            product.name = data.get('name', product.name)
            product.description = data.get('description', product.description)
            product.price = data.get('price', product.price)
            product.quantity = data.get('quantity', product.quantity)
            product.category = data.get('category', product.category)
            product.rating = data.get('rating', product.rating)
            product.inventorystatus = data.get(
            'inventorystatus', product.inventorystatus)
            db.session.commit()
            msg = 'product updated'
        else:
            product = Product(code, name, description, url_image_prod,
                            price, category, quantity, inventorystatus, rating)
            product.save()
            msg = 'product saved '

        product_data = {
        'code': product.code,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'quantity': product.quantity,
        'category': product.category,
        'inventorystatus': product.inventorystatus,
        'rating': product.rating,
        'url_image_prod': product.url_image_prod
        }
        print(msg)
        return jsonify(product_data)
    except Exception as e:
    # code that handles the exception
        print(f"An exception occurred: {e}")
        return jsonify({'error': {e}}), 400
#get the product image
@app.route('/api/product/ImgProduct', methods=['GET'])
def getImage():
    id = request.args.get('id')
    if not id:
        return jsonify({'error': 'Product ID is missing'}), 400

    # query the database to retrieve the url_images for the given product ID
    # assuming there's a Product model with a url_images field
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    if product.url_image_prod:
        try:
            imagFile = os.path.join('../'+product.url_image_prod)
            return send_file(imagFile, mimetype='image/jpeg')
        except Exception as e:
            # code that handles the exception
            print(f"An exception occurred: {e}")
            return jsonify({'error': 'Product image is missing'}), 500
    else:
        return jsonify({'error': 'Product image is missing'}), 400
#save a product image
@app.route('/api/product/upload', methods=['POST'])
def uploadProductImage():
    code = request.args.get('code')
    file = request.files['file']
    # Retrieve the product from the database
    product = Product.query.filter_by(code=code).first()

    # Check if the target directory exists, and create it if not
    is_dir_exist = os.path.exists("../Imagess/")
    if not is_dir_exist:
        os.makedirs("../Imagess/")

    # Set the target filename for the uploaded file
    filename = file.filename
    new_filename = os.path.splitext(
        filename)[0] + '.' + os.path.splitext(filename)[1]
    server_file_path = os.path.join("../Imagess/", new_filename)
    print(server_file_path)
    # Save the uploaded file to the server
    file.save(server_file_path)
    # Update the user object with the URL of the saved image
    product.url_image_prod = server_file_path
    product.save()
    return 'product image saved successfully!'
#delete product
@app.route('/api/product/deleteProduct', methods=['POST'])
def delete_product():
    id = request.json
    product = Product.query.get(id)
    if product is None:
        return jsonify({'error': 'Product not found'})
    else:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'})