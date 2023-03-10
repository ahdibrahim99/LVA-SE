# LVA-SE
Self-care service website


****** BACKEND ******

* models.py: 
- Contains the initation of the flask program with its configuration settings. 
- Defines the classes User, Booking, Shop, Barber and their corresponding schemas.

* init.py:

Contains the flask routes for communication with the frontend.

Relevant routes:

- '/login/', [POST]:
gets an email and password from the submitted form, gets the first user with the submitted email and then compares the hashed submitted password with the hashed password stored in the database. If successful, the user is logged in otherwise an error message is shown.

- '/logout/', [GET]:
Logsout the user. Ideally removes from the user from current session.

- '/signup/', [POST]:
gets an email, a password and a username from the submitted form, checks if a user with this email already exists. If successful, the user is added to the databse and logged in otherwise an error message is shown.

- '/prvapps/<id>', [GET]:
gets all previous bookings of the user with user_id (id). 
  
- '/futureapps/<id>', [GET:
gets all Upcoming bookings of the user with user_id (id).

- '/getshops/', [GET]:
  gets all the shops in the database.

- '/getshops/<postal_code>', [GET]:
  gets all the shops in a specific destrict in the database.
  
- '/getbarbers/<shopid>', [GET]:
  gets all the barbers registered in a barbershop.
  
- '/getbarber/<id>', [GET]:
  gets the barber with the specified id.
  
- '/book/', [POST]:
gets a date, a start time and a barber id, a user id and customer name from the submitted form in string form. It converts the date and start time to a datetime object and adds the booking to the databse. An end_time is added by default to be stqart_time + 30 mins (not particularly useful for current application)
  
- '/booked/<barber_id>/<date>/', [GET]:
Gets all the booked times for a specific barber on a specific day.

- '/rate/<booking_id>/<rating>/', [GET]:
Rates a specific booking and updates the ratings for the concerned barber and barbershop.
  
- '/cancel/<booking_id>/', [GET]:
Cancels the booking with the id booking_id.
  
  
****** FRONTEND ****** 
 
Components:
  
 * Dropdown:
  
Contains all cards for the shops. Contains a dropdown to choose district number.
  
 * Shops:
 
 


  
  
  
  
  
  
  
  
