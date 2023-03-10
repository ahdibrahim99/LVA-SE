# LVA-SE
Self-care service website


Backend:

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
  gets all the barbers registered in a barbershop.
  
  
  
  
  
  
