import Dropdown from './Components/Dropdown';
import MyNavbar from './Components/Navbar';
import barbershop from './assets/barber.png'
import React, {useState} from 'react';
import UserContext from './Context';



function App() {

  const [user, setUser] = useState(null);
  const userData = { user, setUser };

  return (
  <>
  <div className="d-flex align-items-center justify-content-center" style={{flexDirection: 'column', width: '100%', backgroundColor:'#Eed5b1'}}>
    <UserContext.Provider value={userData}>
      <MyNavbar/>
      <div className="d-flex align-items-center justify-content-center"  style={{flexDirection: 'column', width: '100%',fontFamily: 'Copperplate, Papyrus, fantasy', backgroundImage: `url(${barbershop})`, backgroundPosition: 'center',backgroundSize: 'cover', height: '600px', paddingTop: '60px'}}>
        <h1 className="text-white text-center" style={{fontSize: '80px'}}>CAREHOUSE</h1>
        <p className="text-white text-center" style={{ fontSize: '30px'}}>Self Care for Men</p>
      </div>
      <h2 style={{color: 'black', paddingTop: '50px'}}> Find the best self care services near you!</h2>
      <Dropdown />
    </UserContext.Provider>

  </div>
  <footer style={{backgroundColor: '#262525', height:'40px'}}>
  <p style={{color: 'white', paddingTop:'5px'}}>&copy;  CareHouse 2023</p>
</footer>
</>
);
}
export default App;
  