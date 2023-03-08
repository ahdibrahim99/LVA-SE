from flask import request, jsonify, session
from sqlalchemy import func
from flask_login import LoginManager, login_user, current_user, logout_user
import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from models import User, Barber, Shop, Booking, UserSchema, BarberSchema, BookingSchema, ShopSchema, db, app


login_manager = LoginManager()
CORS(app)
bcrypt= Bcrypt()

login_manager.login_view = 'auth.login'
login_manager.init_app(app)

@app.route('/current_user/', methods= ['GET'])
def get_currentuser():
    if current_user.is_authenticated:
        return jsonify([current_user.name, current_user.id])
    else:
        return jsonify(session['user_id'])

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login/', methods= ['POST'])
def user_login():
    email = request.form["email"]
    password = request.form["password"]
    user= User.query.filter(User.email==email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user, remember=True)
        # session['user_id'] = str(user.id)
        # session['remember_me'] = True
        print(current_user.username)
        return jsonify([user.username, user.id]), 200
    else:
        return jsonify("Email or password is not correct!"), 401


@app.route('/logout/', methods= ['GET'])
def user_logout():
    logout_user()
    # session.pop('user_id', None)
    return jsonify({ "message": "Successfully logged out" }), 200

@app.route('/signup/', methods= ['POST'])
def user_signup():
    email = request.form["email"]
    password = request.form["password"]
    username = request.form["username"]
    if User.query.filter(User.email==email).first():
        return jsonify( "User with this email already exists"), 409
    else:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user= User(email=email, password=hashed_password, username=username)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return jsonify([new_user.username, new_user.id]), 200

@app.route('/prvapps/<id>', methods= ['GET'])
def get_prvapps(id):
    bookings = Booking.query.filter(Booking.user_id == id).all()
    return jsonify([[booking.date, booking.start_time.strftime('%H:%M:%S'), booking.barber.name, booking.barber.shop.name, booking.id, booking.rating]for booking in bookings if datetime.datetime.combine(booking.date, booking.start_time) < datetime.datetime.now()]) 

@app.route('/futureapps/<id>', methods= ['GET'])
def get_futureapps(id):
    bookings = Booking.query.filter(Booking.user_id == id).all()
    return jsonify([[booking.date, booking.start_time.strftime('%H:%M:%S'), booking.barber.name, booking.barber.shop.name, booking.id, booking.rating] for booking in bookings if datetime.datetime.combine(booking.date, booking.start_time) >= datetime.datetime.now()])  

@app.route('/getusers/', methods= ['GET'])
def get_allusers():
    users = User.query.all()
    return jsonify(UserSchema().dump(users, many=True))


@app.route('/getshops/<postal_code>', methods= ['GET'])  #DONT FORGET TO CHANGE NAME FROM POSTAL_CODE TO DISTRICT
def get_shopsbycode(postal_code):
    shops = Shop.query.filter(Shop.postal_code==postal_code).order_by(Shop.rating)
    return jsonify(ShopSchema().dump(shops, many=True))
    

@app.route('/getshops/', methods= ['GET'])
def get_allshops():
    shops = Shop.query.order_by(Shop.rating).all()
    return jsonify(ShopSchema().dump(shops, many=True))

@app.route('/getshop/<id>', methods= ['GET'])
def get_shopbyname(id):
    shop = Shop.query.get(id)
    return jsonify(ShopSchema().dump(shop))

@app.route('/getbarbers/', methods= ['GET'])
def get_babers():
    barbers = Barber.query.all()
    return jsonify(BarberSchema().dump(barbers, many=True))

@app.route('/getbarber/<id>', methods= ['GET'])
def get_baber(id):
    barber = Barber.query.get(id)
    return jsonify(BarberSchema().dump(barber))

@app.route('/getbarbers/<shopid>', methods= ['GET'])
def get_babersshop(shopid):
    barbers = Barber.query.filter_by(shop= Shop.query.get(shopid))
    return jsonify(BarberSchema().dump(barbers, many=True))

@app.route('/book/', methods= ['POST'])
def post_booking():
  
    date = request.form['date']
    start_time = request.form['start_time']
    barber_id = request.form['barber_id']
    customer_name = request.form['customer_name']
    user_id= request.form['user_id']

    starttime = datetime.datetime.strptime(start_time, '%H:%M').time()
    endtime = starttime.replace(hour=starttime.hour + (starttime.minute + 45) // 60, minute=(starttime.minute + 45) % 60)
    ddate = datetime.datetime.strptime(date, '%Y-%m-%d').date()

    new_booking = Booking(date=ddate, start_time=starttime, end_time=endtime, barber=Barber.query.get(barber_id), customer_name=customer_name, user= User.query.get(user_id)) 
  
    db.session.add(new_booking)
    db.session.commit()
    return jsonify({'message': 'Booking added successfully'}), 201

@app.route('/booked/<barber_id>/<date>/', methods= ['GET'])
def get_booked(barber_id, date):
    bookings = Booking.query.filter(Booking.barber_id==barber_id, Booking.date== datetime.datetime.strptime(date, '%Y-%m-%d').date()).all()
    return jsonify([booking.start_time.strftime('%H:%M') for booking in bookings ])

@app.route('/rate/<booking_id>/<rating>/', methods= ['GET'])
def rate_booking(booking_id, rating):
    booking = Booking.query.get(booking_id)
    booking.rating=rating
    print(rating, booking.rating)
    db.session.commit()
    booking.barber.rating= db.session.query(func.avg(Booking.rating)).filter_by(barber=booking.barber).scalar()
    db.session.commit()
    booking.barber.shop.rating= db.session.query(func.avg(Barber.rating)).filter_by(shop=booking.barber.shop).scalar()
    db.session.commit()

    return 'Booking rating updated', 200

@app.route('/cancel/<booking_id>/', methods= ['GET'])   
def cancel_booking(booking_id):
    db.session.delete(Booking.query.get(booking_id))
    db.session.commit()
    return jsonify('Entry has been deleted!'), 200


@app.route('/bookings/', methods= ['GET'])
def get_allbookings():
    bookings = Booking.query.all()
    return jsonify(BookingSchema().dump(bookings, many=True))

# @app.route('/populatesh/', methods= ['GET'])
# def get_popsh():
#     shop1 = Shop(name="Jack of all Fades", postal_code= 12, address = " Ortsstrasse 25")
#     shop2 = Shop(name="Sleek Snips", postal_code= 12, address = "Hubatschstrasse 88")
#     shop3 = Shop(name="Chop Shop", postal_code= 1, address = "Prager Strasse 66")
#     shop4 = Shop(name="Razzle Dazzle", postal_code= 20, address = "Davidschlag 50")
#     shop5 = Shop(name="Hair Grande", postal_code= 5, address = "Stubengraben 75")
#     shop6 = Shop(name="Barebrs r us", postal_code= 5, address = "Davidschlag 53")
#     shops= [shop1, shop2, shop3, shop4, shop5, shop6]
#     db.session.bulk_save_objects(shops)
#     db.session.commit()
#     return jsonify("Hello world")

# @app.route('/populateb/', methods= ['GET'])
# def get_popb():
#     barber1 = Barber(name="Ahmad", rating=5,  shop= Shop.query.get(1))
#     barber2 = Barber(name="Mohamed", rating= 4, shop= Shop.query.get(1))
#     barber3 = Barber(name="Ibrahim", rating= 3,  shop= Shop.query.get(1))
#     barber4 = Barber(name="Ziad", rating= 2, shop= Shop.query.get(2))
#     barber5 = Barber(name="Hassan", rating= 0, shop= Shop.query.get(2))
#     barber6 = Barber(name="Hektor", rating= 0, shop= Shop.query.get(3))
#     barbers= [barber1, barber2, barber3, barber4, barber5, barber6]
#     db.session.bulk_save_objects(barbers)
#     db.session.commit()
#     print(Barber.query.count())
#     return jsonify("Hello world")

# @app.route('/populateapp/', methods= ['GET'])
# def get_popapp():
#     app1 = Booking(barber=Barber.query.get(1), date= datetime.date(2023,3,9), start_time = datetime.time(12), customer_name= 'Ahmad' , user=User.query.get(1))
#     app2 = Booking(barber=Barber.query.get(1), date= datetime.date(2023,3,9), start_time = datetime.time(13), customer_name= 'matthius', user=User.query.get(1))
#     app3 = Booking(barber=Barber.query.get(1), date= datetime.date(2023,3,9), start_time = datetime.time(12,30), customer_name= 'ralph', user=User.query.get(1))
#     app4 = Booking(barber=Barber.query.get(1), date= datetime.date(2023,1,1), start_time = datetime.time(16), customer_name= 'Ahmad', user=User.query.get(1))
#     app5 = Booking(barber=Barber.query.get(1), date= datetime.date(2023,3,9), start_time = datetime.time(12), customer_name= 'mattius', user=User.query.get(2), rating=5)
#     app6 = Booking(barber=Barber.query.get(1), date= datetime.date(2023,1,10), start_time = datetime.time(12,30), customer_name= 'Ralph', user=User.query.get(2), rating=5)
#     apps= [app1, app2, app3, app4, app5, app6]
#     db.session.bulk_save_objects(apps)
#     db.session.commit()
#     return jsonify("Hello world")

if __name__ == "__main__":  
    with app.app_context():
        # db.drop_all()
        db.create_all()
        
    app.run(debug=True)