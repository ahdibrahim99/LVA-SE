from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from flask_marshmallow import Marshmallow
from flask import Flask

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False    

app.secret_key = '432695fffg8B1FD3'

db = SQLAlchemy(app)
ma = Marshmallow(app)


class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, unique = True, primary_key = True)
    date = db.Column(db.Date)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    barber_id = db.Column(db.Integer, db.ForeignKey('barbers.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    customer_name= db.Column(db.String(20))
    rating= db.Column(db.Integer)

class BookingSchema (ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Booking  
        fields = ('id', 'date', 'start_time', 'end_time', 'barber_id', 'customer_name', 'user_id', 'rating') 

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    username= db.Column(db.String(150), nullable= False)
    email = db.Column(db.String(150), nullable= False, unique=True)
    password = db.Column(db.String(150), nullable= False)
    bookings = db.relationship('Booking', backref=db.backref('user')) 

class UserSchema (ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password') 

class Barber(db.Model):
    __tablename__ = 'barbers'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(20))
    rating = db.Column(db.Integer, default = None)
    barbershop_id = db.Column(db.Integer, db.ForeignKey('shops.id'))
    bookings = db.relationship('Booking', backref=db.backref('barber')) 
    
class BarberSchema (ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Barber  
        fields = ('id', 'name', 'rating', 'barbershop_id')    

class Shop(db.Model):
    __tablename__ = 'shops'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(150))
    postal_code = db.Column(db.Integer)
    address = db.Column(db.String(150))
    rating = db.Column(db.Integer, default= None)
    barbers = db.relationship('Barber', backref=db.backref('shop'))

class ShopSchema (ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Shop
        fields = ('id', 'name', 'postal_code', 'address', 'rating') 