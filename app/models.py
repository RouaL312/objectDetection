# -*- encoding: utf-8 -*-
import uuid
import datetime
from flask       import flash,jsonify
from app         import db, admin
from flask_login import UserMixin, LoginManager, current_user
from flask_admin.contrib.sqla import ModelView
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class User(db.Model):
    __tablename__="t_user"
    id_user      = db.Column(db.Integer, db.Sequence('t_user_t_user_id_seq'), primary_key=True, server_default=db.text("nextval('t_user_t_user_id_seq'::regclass)"))
    username   = db.Column(db.String(64),  unique = True)
    email    = db.Column(db.String(120), unique = True)
    password = db.Column(db.String(500))
    name = db.Column(db.String(500))
    gender   = db.Column(db.String(8)) 
    profession = db.Column(db.String(64))
    is_admin = db.Column(db.Boolean)
    address  = db.Column(db.String(120))
    phone  = db.Column(db.String(120))
    date_creation  = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    def __init__(self, username, email, password,name, gender, profession, address,is_admin):
        self.username       = username
        self.password   = password
        self.email      = email
        self.gender     = gender
        self.profession = profession
        self.address    = address
        self.is_admin   = is_admin
        self.name       = name
    def __repr__(self):
        return '<User %r - %s - %s - %s - %s - %s- %d>' % (self.id_user, self.username, self.email, self.gender, self.profession, self.address,self.is_admin)

    def save(self):
        # inject self into db session    
        db.session.add ( self )

        # commit change and save the object
        db.session.commit( )
        return self 
    
    def get(filter):
        users=db.query.all()
        return (users)

    def to_dict(self):
        return {
            'id_user': self.id_user,
            'username': self.username,
            'email': self.email,
            'gender': self.gender,
            'profession': self.profession,
            'address': self.address,
            'is_admin': self.is_admin
        }

class Product(db.Model):
    __tablename__ = 't_product'

    id = db.Column(db.Integer, db.Sequence('t_product_id_seq'), primary_key=True, server_default=db.text("nextval('t_product_id_seq'::regclass)"))
    code = db.Column(db.String(20), nullable=False, unique=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    url_image_prod = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(30), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    inventorystatus = db.Column(db.String(40), nullable=False)
    rating = db.Column(db.Numeric(2, 1), nullable=False)

    def __init__(self, code, name, description, url_image_prod, price, category, quantity, inventorystatus, rating):
        self.code = code
        self.name = name
        self.description = description
        self.url_image_prod = url_image_prod
        self.price = price
        self.category = category
        self.quantity = quantity
        self.inventorystatus = inventorystatus
        self.rating = rating
    
    def __repr__(self):
        return f"Product(id={self.id}, code='{self.code}', name='{self.name}', " \
            f"price={self.price}, category='{self.category}', quantity={self.quantity},inventorystatus='{self.inventorystatus}', rating={self.rating})"
    
    def save(self):
        # inject self into db session    
        db.session.add ( self )

        # commit change and save the object
        db.session.commit( )
        return self 
    def get(filter):
        products=db.query.all()
        return (products)    

class ImageProduct(db.Model):
    __tablename__ = 't_imageproduct'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(50), nullable=False)
    filetype = db.Column(db.String(20), nullable=False)
    filesize = db.Column(db.Integer, nullable=False)
    filepath = db.Column(db.String(100), nullable=False)

    def __init__(self, id, filename, filetype, filesize, filepath):
        self.id = id
        self.filename = filename
        self.filetype = filetype
        self.filesize = filesize
        self.filepath = filepath

    def __repr__(self):
        return f"ImageProduct(id={self.id}, filename='{self.filename}', filetype='{self.filetype}', filesize={self.filesize}, filepath='{self.filepath}')"

class MyModelView(ModelView):
    def is_accessible(self):
        if current_user.is_admin == True:
            return current_user.is_authenticated
    def not_auth(self):
        return "You're not authorized to use the admin dashboard"

admin.add_view(MyModelView(User, db.session))