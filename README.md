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

- '/prvapps/<id>/', [GET]:
gets all previous bookings of the user with user_id (id). 
  
- '/futureapps/<id>/', [GET]:
gets all Upcoming bookings of the user with user_id (id).

- '/getshops/', [GET]:
  gets all the shops in the database.

- '/getshops/<postal_code>/', [GET]:
  gets all the shops in a specific destrict in the database.
  
- '/getbarbers/<shopid>/', [GET]:
  gets all the barbers registered in a barbershop.
  
- '/getbarber/<id>/', [GET]:
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
  
Contains a dropdown to choose district number and is a Container for  all shop cards

 * Shops: 
 
- sends a  fetch get request to the '/getshops/' to get all shops in the database. Each shop is displayed in a card with its information. 
  
- Subcomponent: 'ShopModal': a button included in each card that opens a modal to show barbers 'using component BARBERS' in the barbershop.
  
* Barbers: 
  
- sends a fetch get request to '/getbarbers/' to get all barbers registered in a barbershop.

- Subcomponent: 'BarberCard' : a card that includes the info for each barber including name, rating displayed in stars and a booking form 'using component AccForm'
  
* AccForm in 'ModalForm.js':
 
- An accordion component that contains the form needed for booking an appointment.
- Subcomponent: 
  * 'Form': Contains the form which request a customer name , a date and a time for an available booking. Once submitted, the form is not sent by default but has the barber id, the user id  'for which the booking is booked' and the start time appended to the forum and then is sent. The route '/book/' is fetched and the form is sent in a POST request. If a user is signed in, the customer name is automatically filled in.
  * 'FormDropdown' is a subcomponent of 'Form': contains a dropdown with the avaiable booking times for the user to choose from which are placed at a time interval of 30 mins. The component has a 'useEffect' hook which sends a get request to route '/booked/<barber_id>/'. The already booked times of the barber are requested and eliminated from the available times list 'times' and then displayed. Also only timing in the future is displayed so it is not possible to book a booking in a past point in time. Every time a date is chosen this dropdown is updated with the avaiable times.
  
* Navbar:
  
 - its main functionality is to include user experience.
 - Contains the logo of the website and an offCanvas.
 - Subcomponent: 'Offcanvas': If user is not signed up it enables user to login or to sign up using 'CredentialModal' . If a user is already logged in, it allows the user to check previous or upcoming appointments using 'Appointment Modal.
  

 - CredentialModal:
  - contains input fields username (available only in signup) , email and password and allows user to sign in or sign up. Once submitted it sends the from to the corresponding route and gets a response. If successful, the user is logged in/ signed up if not an error message is displayed.
  
 - AppointmentModal:
  - Allows user to check previous or future bookings.
  
  - In a previous booking modal, a get request is sent to '/prvapps/<user_id>' and each appointment is displayed in a card with info like barber, date and a rating option. The rating is done using 5 star buttons and once clicked it sends the submitted review to the route '/rate/<booking_id>/<rating>/'.
  
  - In an upcoming booking modal, a get request is sent to /futureapps/<user_id> and each appointment is displayed in a card with info like barber, date and a cancel button. Once clicked a request is sent to the route '/cancel/<booking_id>/' and the appointment is removed from the database and the component is rerendered so that it is no longer to be seen in the modal.
  
  

  
  
  
 
  
  
  
 


  
  
  
  
  
  
  
  
