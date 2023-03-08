import "./shops.css"
import Shops from "./Shops";
import React from 'react';
import card from '../assets/black1.jpg'

class Dropdown extends React.Component {
  state = { value: '',
            numbers: Array.from(Array(21).keys(), x => x + 1)
            }

  handleChange = event => {
    this.setState({ value: event.target.value })
  }


  render() {
    return (

    <div className="d-flex align-items-center justify-content-center" style={{flexDirection: 'column'}}>
      <div style={{padding:'20px'}}>
        <select className="form-control" style={{ width: '250px', fontSize: '20px', textAlign: 'center', backgroundColor: `url(${card})`}} onChange={this.handleChange} >
          <option value= "">Select your district</option>
          {this.state.numbers.map(number => (
             <option value={number}>{number}</option>
           ))}
        </select>
      </div>
      <Shops value = {this.state.value} style={{}}/>
    </div>
    )
  }

}
export default Dropdown;




