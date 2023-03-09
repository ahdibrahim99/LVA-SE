import React, {useState, useRef, useContext} from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Modal, Alert} from 'react-bootstrap';
import UserContext from '../Context';


function Navbar() {
  return (
    <nav className="navbar navbar-dark fixed-top" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}> 
    <div className="container-fluid">
      <a className="navbar-brand" href= '/' style={{textfontFamily: 'Copperplate, Papyrus, fantasy', textAlign: 'center'}}>
      CareHouse
      </a>
      <MyOffCanvas />
    </div>

  </nav>
  )
}
export default Navbar

function MyOffCanvas() {
  const [show, setShow] = useState(false);
  
  const userpack = useContext(UserContext);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  const handleLogout = async () => {
    const response = await fetch('http://127.0.0.1:5000/logout');
    if (response.ok){
      userpack.setUser(null)
      setShow(false)}
  };

  return (
    <>
      <button class="navbar-toggler" onClick={toggleShow}>
        <span class="navbar-toggler-icon"></span>
      </button>
      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header style={{ background: '#262525'}} closeButton>
          <Offcanvas.Title style={{fontFamily: 'Copperplate, Papyrus, fantasy', color: 'white'}}>CareHouse</Offcanvas.Title>
        </Offcanvas.Header >
        <Offcanvas.Body style={{ background: '#262525'}}>
          <div>
            {userpack.user? 
            <div className="d-flex justify-content-center " style={{width: '100%', flexDirection: 'column'}}>
              <h3 style={{fontFamily: 'Copperplate, Papyrus, fantasy', color: 'white', paddingBottom:'20px'}}> Hi {userpack.user[0]} !</h3>

              <AppointmentModal user={userpack.user} type="Upcoming"/>
              <AppointmentModal user={userpack.user} type="Previous"/>
              <button style={{background:'transparent', border: "1px solid white", padding: "10px 20px", color:'white'}} onClick={handleLogout}>Logout</button>
            </div>
            :   
            <div className="d-flex justify-content-between " style={{width: '100%', flexDirection: 'column', padding:'10px'}}>
              <CredentialModal  setUser={userpack.setUser} type={"Login"} />
              <CredentialModal  setUser={userpack.setUser} type={"Signup"}/>
            </div>}
          </div>
  
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}


function CredentialModal({setUser, type}) {

  const[show, setShow]= useState(false)

  const handleShow = () => {
    setShow(true);
  }

  const handleClose = () => {
    setShow(false)
  }

  const formRef = useRef(null);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
  
      const response = await fetch("http://127.0.0.1:5000/" + type.toLowerCase() + "/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data) 
        setTimeout(() => {
          handleClose()
        }, 1000);}
      else {
        alert(data)
      }
    }

  return (
    <>
        <button style={{background:'transparent', border: "1px solid white", padding: "10px 20px", color: 'white', ':hover': { backgroundColor: '#Eed5b1' }}} onClick={handleShow}> {type}  </button>

        <Modal centered  fullscreen='true' show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{type}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: 'white'}} >          
          <form ref={formRef} onSubmit={handleSubmit}>  
          {type === "Signup"?
            <div className="d-flex align-items-center justify-content-center" style={{paddingTop:'15px'}}>
              <label style={{marginRight: '10px'}}>Username: </label> <input type="text" name="username" required/> 
            </div>:<></>}
            <div className="d-flex align-items-center justify-content-center" style={{paddingTop:'15px'}}>
              <label style={{marginRight: '10px'}}>Email: </label> <input type="email" name="email" required/> 
            </div>
            <div className="d-flex align-items-center justify-content-center" style={{paddingTop:'15px'}}>
              <label style={{marginRight: '10px'}}>Password: </label> <input type="password" name="password" required/> 
            </div>
            <button style={{float: 'right'}} type= "submit" class="btn btn-dark" > {type==="Signup"? "Sign up": "Login"} </button>
          </form>
          </Modal.Body>
        </Modal>
    </>
  
  );          

}


function AppointmentModal({user,type}) {

  const[show, setShow]= useState(false)
  const [bookings, setbookings]= useState([])


  const handleShow = () => {
    setShow(true);
  }

  const handleClose = () => {
    setShow(false)
  }

  const handleClick = async (event) => {
    const response = await fetch('http://127.0.0.1:5000/' + (type === 'Upcoming'? 'futureapps': 'prvapps') + '/' +  String(user[1]), {
      method: "GET",
    });
    const data = await response.json();
    setbookings(data) 
    handleShow()
    }
  
  return (
    <>
        <button style={{background:'transparent', border: "1px solid white", padding: "10px 20px", color:'white'}} onClick={handleClick}> {type} Appointments  </button>

        <Modal centered  fullscreen='true' show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{type} Appointments</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: 'white', maxHeight: '500px', overflowY: 'auto' }} >   
          <div >
            {bookings.map(booking => {
                return (
                    <Card booking={booking} type={type}/>
                    );
                    })
            }
         </div>       
          </Modal.Body>
        </Modal>
      </>
  );          

}

function Card({ booking, type}) {
  const [isCanceled, setIsCanceled] = useState(false);
  const [ButtonDisabled, setButtonDisabled] = useState(false);
  const[showAlert, setAlert]= useState(false)

  const handleCancel = async (booking_id) => {
    setButtonDisabled(true);
    const response = await fetch('http://127.0.0.1:5000/cancel/' + String(booking_id) + '/', {
      method: "GET",
    });
    if (response.ok){
      setAlert(true)
      setTimeout(() => {
        setIsCanceled(true);
      }, 1200);
      
    }
  }

  return (
     !isCanceled &&
    (<div className= "card m-2 bg-transparent">
      <div className="card-body" style={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'space-between'}}>
        <p style={{paddingTop:'10px'}}><span style={{fontWeight:'bold'}}>Shop:</span> {booking[3] } </p>
        <p style={{paddingTop:'10px'}}><span style={{fontWeight:'bold'}}>Barber:</span> {booking[2]} </p>
        <p style={{paddingTop:'10px'}}><span style={{fontWeight:'bold'}}>Time:</span> {booking[0].slice(0, -12)}, {booking[1].slice(0, -3)} </p>
        
        {type === "Upcoming"? 
          <button className='btn btn-danger' onClick={() => handleCancel(booking[4])} disabled={ButtonDisabled}>{ButtonDisabled ? "Canceling..." : "Cancel"}</button>:
          <div style={{ display: 'flex', flexDirection:'row'}}><p><span style={{fontWeight:'bold'}}>Rating:</span></p><StarRating booking= {booking}/></div>
          
          }
        {showAlert && <Alert variant="success">Appointment canceled</Alert>}
      </div>
    </div>)

  )
}

function StarRating ({booking}){

  const [rating, setRating] = useState(booking[5]);
  const [hover, setHover] = useState(0);
  const[showAlert, setAlert]= useState(false)

  const handleClick = async (index) =>{
    setRating(index)
    const response = await fetch('http://127.0.0.1:5000/rate/' + String(booking[4]) + '/' + String(index) + '/', {
      method: "GET",
    });
    if (response.ok){
      setAlert(true)
      setTimeout(() => {
      setAlert(false)
      }, 1200);
    }

  }
  return (
    <>
    <div style={{ display: 'flex', flexDirection:'column'}}>
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button 
            key={index}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              color: index <= (hover || rating) ? '#FFD700': '#ccc'
            }}
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
    
    {showAlert && <Alert variant="success" style={{marginTop:'20px'}}>Thanks for your feedback!</Alert>}
    </div>
    </>
  );
};
