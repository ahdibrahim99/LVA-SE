import React, { useState, useRef, useEffect, useContext} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import UserContext from '../Context';


function FormFormDropdown({Barber, onClose}) {

  const[date, setDate]= useState('')
  const[time, setTime]= useState('')
  const[showAlert, setAlert]= useState(false)
  const [ButtonDisabled, setButtonDisabled] = useState(false);

  const userpack = useContext(UserContext);


  const handleChange= (event) => {
    setDate(event.target.value);
  }
  

  const formRef = useRef(null);
  
  const handleSubmit = (event) => {
    
    setButtonDisabled(true)
    
    event.preventDefault();

    const formData = new FormData(formRef.current);
    
    formData.append('barber_id', Barber.id);
    formData.append('start_time', time);
    formData.append('user_id', userpack.user ? userpack.user[1] : null);

    fetch('http://127.0.0.1:5000/book/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });

    setAlert(true)
    
    setTimeout(() => {
      onClose();
    }, 1000);
    
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>  
    <div className="d-flex align-items-center justify-content-between" style={{paddingTop:'15px'}}>
    <label>Name: </label> <input type="text" name="customer_name" defaultValue={userpack.user? userpack.user[0]: ''} required/> 
    </div>
    <div className="d-flex align-items-center justify-content-between" style={{paddingTop:'15px'}}>
    <label>Date: </label> <input type="date" name="date" min={new Date().toISOString().split('T')[0]} onChange={handleChange} required/>
    </div>
    <div className="d-flex align-items-center justify-content-between" style={{paddingTop:'15px'}}>
      <label>Time: </label> 
      <FormDropdown date= {date} baber_id= {Barber.id} setTime= {setTime} />
    </div>
      <button type= "submit" class="btn btn-light" disabled={ButtonDisabled}> Book </button>
      {showAlert && <Alert variant="success">Appointment booked</Alert>}
  </form>
  
  
  );          


}


function AccForm({Barber, onClose}){
  return (

    <Accordion defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0"></Accordion.Item>
        <Accordion.Header>Book an Appointment</Accordion.Header>
        <Accordion.Body>
          <Form Barber={Barber} onClose={onClose}></Form>
        </Accordion.Body>
    </Accordion>
      );
}

export default AccForm


function FormDropdown({date, baber_id, setTime}) {

  const times = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ]

  const[bookedtimes, setBookedtimes] = useState([])

  const handleChange = (event) => {
     setTime(event.target.value)
  }
  
  useEffect (() => {
    fetch('http://127.0.0.1:5000/booked/' + String(baber_id) + "/" +  date , {
        'method': 'GET',
        headers: {
           'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(response => setBookedtimes(response))
    .catch(error => console.log(error))
}, [date])
  
  return (    
    <div>
            <select style={{width: '150px', fontSize: '10px', textAlign: 'center'}} className="form-control" onChange={handleChange} >
              <option disabled>Available booking time </option>
               {times.map(time => (
                bookedtimes.includes(time) || new Date(date + 'T' + time) < new Date()?
                (null): (<option value={time}>{time}</option>)
              ))}
            </select>
    </div>
  )
}
