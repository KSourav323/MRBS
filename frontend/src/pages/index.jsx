import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../style/index.css'

import DatePicker from '../components/datePicker'; 
import Areas from '../components/areas';
import Navbar from '../components/navbar.jsx';

const Index = () => {  
  const navigate = useNavigate();
    const [area, setArea] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const items = ['Option 1', 'Option 2', 'Option 3'];

    const handleSelectArea = (item) => {
      setArea(item);
    };

   
      const handleDateSelect = (date) => {
        setSelectedDate(date);
      };

      const bookSlot = () => {
        navigate('/book');
      }


  return (
    <div id='container'> 

        <Navbar/>
        
        <div id='body'>
            <div id='sidebar'>
              <DatePicker 
                        onDateSelect={handleDateSelect}
                        selectedDate={selectedDate}
                    /> 
            </div>
            <div id='content'>
                <h3>
                  {selectedDate 
                    ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}, ${selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                    : 'Click a date'}
                </h3>
                <div id='opts'>
                    <Areas items={items} defaultSelected={items[0]} onSelect={handleSelectArea} />
                </div>
                <div id='table'>
                    <h1>{area}</h1>
                  <button onClick={bookSlot}>Book this slot</button>
                </div>
            </div>
        </div>

        <div id='footer'>
            d
        </div>
       
 
    </div>
  )
}

export default Index