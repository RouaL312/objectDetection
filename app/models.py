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
    
        print('----------self--------------')
        print(self)
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


class MyModelView(ModelView):
    def is_accessible(self):
        if current_user.is_admin == True:
            return current_user.is_authenticated
    def not_auth(self):
        return "You're not authorized to use the admin dashboard"

admin.add_view(MyModelView(User, db.session))