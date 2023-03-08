import React, { useState, useEffect } from 'react';

import barberimage from '../assets/barber 2.png'
import AccForm from './ModalForm';


function Barbers(props) {
    const [barbers, setBarbers] = useState([]);
  
    useEffect (() => {
        fetch('http://127.0.0.1:5000/getbarbers/' + String(props.value)  , {
            'method': 'GET',
            headers: {
               'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => setBarbers(data))
        .catch(error => console.log(error))
    }, [props.value])
  
  return (
    <div>

        <div >
            {barbers.map(barber => {
                return (
                  <>
                      <BarberCard key={barber.id} barber={barber} onClose= {props.onClose}/>
                      </>
                    );
                    })
            }
         </div>
    </div>
  )
  }
  export default Barbers

  function BarberCard({barber, onClose}) {

    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span className="star" 
        key={i}
        style={{
          color: i <= barber.rating ? '#FFD700': '#ccc'
        }}>&#9733;</span>
      );
    }

    return (
      <div className= "card m-3 bg-transparent"  >
      <h5 class="card-header">{barber.name}</h5>
      <div class="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
          <img src={barberimage} style={{ width: '100px', height: '100px' }}/>
          <p style={{paddingTop:'10px'}}>Rating: {stars} </p>
          <AccForm Barber= {barber} onClose={onClose} />
      </div>
            
</div>
     
    );
  }