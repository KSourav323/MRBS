import React, { useState, useEffect } from 'react';
import '../style/index.css'
import axios from 'axios';
import DatePicker from '../components/datePicker'; 
import Schedule from '../components/schedule.jsx';
import Navbar from '../components/navbar.jsx';
import { useSelector } from 'react-redux';

const Index = () => {  
  const [areas, setAreas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const user = useSelector(state => state.user);

    useEffect(() => {
        if(user.isLoggedIn){
            axios
          .post('http://localhost:5000/api/listArea', {}, { withCredentials: true })
          .then((response) => {
              if (response.status === 201) {
                  setAreas(response.data.data);
                  if (response.data.data.length > 0) {
                      setSelectedArea(response.data.data[0]);
                  }
              }
          })
          .catch((error) => {
              console.error('failed:', error);
              alert('failed: ' + error.response?.data?.message || 'Unknown error');
          });
        }
        else{
            axios
          .post('http://localhost:5000/public/listArea', {}, { withCredentials: true })
          .then((response) => {
              if (response.status === 201) {
                  setAreas(response.data.data);
                  if (response.data.data.length > 0) {
                      setSelectedArea(response.data.data[0]);
                  }
              }
          })
          .catch((error) => {
              console.error('failed:', error);
              alert('failed: ' + error.response?.data?.message || 'Unknown error');
          });
        }
      
  }, [user]);
   
      const handleDateSelect = (date) => {
        setSelectedDate(date);
      };

      const handleAreaChange = (e) => {
        const areaId = Number(e.target.value);
        const selectedArea = areas.find(area => area.id === areaId);
        if (selectedArea) {
            setSelectedArea(selectedArea);
        }
    };

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
                
                  <div id='opts'>
                    <h3>
                        {selectedDate 
                            ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}, ${selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                            : 'Click a date'}
                        </h3>

                    {areas ? (
                        <select id="area-select" onChange={handleAreaChange}>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.area_name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>Loading areas...</p>
                    )}
                    
                </div>
                
                <div id='table'>
                  {selectedArea && (
                      <Schedule areaId={selectedArea.id}/>
                    
                  )}
                </div>
            </div>
        </div>

        <div id='footer'>
            NIT Calicut
        </div>
       
 
    </div>
  )
}

export default Index