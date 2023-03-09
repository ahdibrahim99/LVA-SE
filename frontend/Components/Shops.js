import React, { useState, useEffect } from 'react';
import Barbers from "./Barbers";
import barbershop from '../assets/barbershop.png'
import { Modal, Button } from 'react-bootstrap';




function Shops(props){
    const [shops, setShops] = useState([]);
    

    useEffect (() => {
        fetch('http://127.0.0.1:5000/getshops/' +String(props.value)  , {
            'method': 'GET',
            headers: {
               'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => setShops(data))
        .catch(error => console.log(error))

    },[props.value])


    
    return(
        shops.length === 0 ? <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title ">No Shops Found!</h5>
        </div>
      </div>: 
        <div className="d-flex flex-wrap justify-content-center " style={{width: '100%', overflow: 'scroll'}}>
            {shops.map(shop => {
                return (
                    <div className="card text-bg-dark m-3" style={{ width: '20rem'}}>
                         <img src={barbershop} class="card-img-top" ></img>
                        <div class="card-body">
                            <h4 className="card-title">{shop.name}</h4>
                            <p className="text">Address: {shop.address}</p>
                            <p className="text">Postal code: {shop.postal_code}</p>
                            <p className="text">Rating: {shop.rating === null ? "No Rating" : String(shop.rating)}</p> 
                        </div>
                        <div class="card-footer position-absolute bottom-0">
                          <ShopModal shop= {shop}></ShopModal>
                          
                        </div>
                    </div>
                        );
                            })
            }
        </div>
    );
}
export default Shops


class ShopModal extends React.Component { //consider changing to
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  handleClose = () => {
    this.setState({ show: false });
  }

  render() {
    return (
      <>
        <Button variant="light" onClick={this.handleShow}>
          Check barbers
        </Button>

        <Modal size= 'lg' centered scrollable fullscreen='true'  show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.shop.name}'s barbers</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: 'white'}} >          
            <Barbers value= {this.props.shop.id} onClose= {this.handleClose}></Barbers>
          
          </Modal.Body>
        </Modal>
      </>
    );
  }
}


