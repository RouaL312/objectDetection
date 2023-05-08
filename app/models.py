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
    firstName = db.Column(db.String(64))
    lastName = db.Column(db.String(64))
    gender   = db.Column(db.String(8)) 
    profession = db.Column(db.String(64))
    is_admin = db.Column(db.Boolean)
    address  = db.Column(db.String(120))
    phone  = db.Column(db.String(120))
    codePostal  = db.Column(db.String(30))
    dateDeNaissance  = db.Column(db.DateTime)
    date_creation  = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    def __init__(self, username, email, password,firstName,lastName, gender, profession, address,is_admin,phone,codePostal,dateDeNaissance):
        self.username   = username
        self.password   = password
        self.email      = email
        self.gender     = gender
        self.profession = profession
        self.address    = address
        self.is_admin   = is_admin
        self.firstName  = firstName
        self.lastName   = lastName
        self.phone      = phone
        self.codePostal = codePostal
        self.dateDeNaissance  = dateDeNaissance
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
    code = db.Column(db.Integer, nullable=False, unique=True)
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
    
    def as_dict(self):
        product_dict = {}
        product_dict['id'] = self.id
        product_dict['code'] = self.code
        product_dict['name'] = self.name
        product_dict['category'] = self.category
        product_dict['price'] = self.price
        return product_dict

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
class CartDB(db.Model):
    __tablename__ = 'cartdb'
    itemid = db.Column(db.Integer,db.Sequence('t_cart_id_seq'), primary_key=True, server_default=db.text("nextval('t_cart_id_seq'::regclass)"))
    size = db.Column(db.Integer, nullable=False)

    def __init__(self, itemid, size):
        self.itemid = itemid
        self.size = size
    
    def __repr__(self):
        return f"<CartDB itemid={self.itemid} size={self.size}>"
    
    def save(self):
        # inject self into db session    
        db.session.add ( self )

        # commit change and save the object
        db.session.commit( )
        return self 

class MyModelView(ModelView):
    def is_accessible(self):
        if current_user.is_admin == True:
            return current_user.is_authenticated
    def not_auth(self):
        return "You're not authorized to use the admin dashboard"

admin.add_view(MyModelView(User, db.session))

class CommandeVente(db.Model):

    __tablename__ = 't_commande_vente'
    id_commande_vente = db.Column(db.Integer, primary_key=True)
    date_creation = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    montant_total = db.Column(db.Float, nullable=False)
    login = db.Column(db.String(20), db.ForeignKey('t_user.username'), nullable=False)
    lignes_commande = db.relationship('CommandeLigne', back_populates='commande_vente')

    def __init__(self, montant_total,login, lignes_commande=None):
        self.montant_total = montant_total
        self.login=login
        if lignes_commande is not None:
            self.lignes_commande = lignes_commande

    def __repr__(self):
        return f"<CommandeVente(id_commande_vente='{self.id_commande_vente}', date_creation='{self.date_creation}', montant_total='{self.montant_total},login={self.login}')>"

    def as_dict(self):
        return {
            'id_commande_vente': self.id_commande_vente,
            'montant_total': self.montant_total,
            'date_creation': str(self.date_creation),
            'lignes_commande': [lc.as_dict() for lc in self.lignes_commande],
            'login': self.login
        }
    def save(self):
        print(self)
        # inject self into db session    
        db.session.add ( self )
        # commit change and save the object
        db.session.commit()
        return self 

class LigneCommande (db.Model):

    __tablename__ = 't_ligne_commande'
    id_ligne_cmd = db.Column(db.Integer, primary_key=True)
    fk_product = db.Column(db.Integer, db.ForeignKey('t_product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_unitaire = db.Column(db.Float, nullable=False)
    commande_ligne = db.relationship('CommandeLigne', back_populates='ligne_commande')

    date_creation  = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    product = db.relationship('Product', backref='lignes_commande')
    def __init__(self, fk_product, quantity, price_unitaire):
        self.fk_product = fk_product
        self.quantity = quantity
        self.price_unitaire = price_unitaire

    def __repr__(self):
        return f"LigneCommande(id_ligne_cmd={self.id_ligne_cmd}, fk_product={self.fk_product}, quantity={self.quantity}, price_unitaire={self.price_unitaire})"

    def as_dict(self):
        return {
            'id_ligne_cmd': self.id_ligne_cmd,
            'fk_product': self.fk_product,
            'quantity': self.quantity,
            'price_unitaire': self.price_unitaire
        }
    def save(self):
        # inject self into db session    
        db.session.add ( self )
        # commit change and save the object
        db.session.commit()
        return self 

    
class CommandeLigne(db.Model):
    __tablename__ = 't_commande_ligne'

    id = db.Column(db.Integer, primary_key=True)
    fk_commande_vente = db.Column(db.Integer, db.ForeignKey('t_commande_vente.id_commande_vente'))
    fk_ligne_commande = db.Column(db.Integer, db.ForeignKey('t_ligne_commande.id_ligne_cmd'))

    commande_vente = db.relationship('CommandeVente', back_populates='lignes_commande')
    ligne_commande = db.relationship('LigneCommande', back_populates='commande_ligne')

    def __init__(self, fk_commande_vente, fk_ligne_commande):
        self.fk_ligne_commande = fk_ligne_commande
        self.fk_commande_vente = fk_commande_vente

    def __repr__(self):
        return f"<CommandeLigne {self.id}>"

    def as_dict(self):
        return {
            'id': self.id,
            'commande_vente': self.commande_vente.as_dict(),
            'ligne_commande': self.ligne_commande.as_dict()
        }
    def save(self):
        # inject self into db session    
        db.session.add ( self )
        # commit change and save the object
        db.session.commit()
        return self 


