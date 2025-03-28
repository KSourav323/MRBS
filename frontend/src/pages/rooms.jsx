import React, { useState, useEffect } from 'react'
import '../style/rooms.css'
import Navbar from '../components/navbar'
import axios from 'axios';
import RoomTable from '../components/roomTable';

const Rooms = () => {

  const [areas, setAreas] = useState([]);
  const [showAreaForm, setShowAreaForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [areaId, setAreaId] = useState(1);
  const [roomsUpdated, setRoomsUpdated] = useState(false);
  
  const [areaFormData, setAreaFormData] = useState({
    areaName: '',
    areaAdminEmail: ''
  });

  const [roomFormData, setRoomFormData] = useState({
    areaId: areaId,
    roomName: '',
    description: '',
    capacity: '',
    roomAdminEmail: ''
  });

  useEffect(() => {
    try {
        axios
          .post('http://localhost:5000/api/listArea',{},{ withCredentials: true })
          .then((response) => {
            if (response.status === 200) {
                setAreas(response.data.data);
            }
          })
      } catch (error) {
        console.error('failed:', error);
        alert('failed: ' + error.response?.data?.message || 'Unknown error');
      }
  }, [showAreaForm]);

  const handleAreaFormChange = (e) => {
    const { name, value } = e.target;
    setAreaFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoomFormChange = (e) => {
    const { name, value } = e.target;
    setRoomFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post('http://localhost:5000/api/addArea', areaFormData, { withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
            alert('area added!');
            setShowAreaForm(false);
          }
        })
    } catch (error) {
      console.error('failed:', error);
      alert('failed: ' + error.response?.data?.message || 'Unknown error');
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post('http://localhost:5000/api/addRoom', roomFormData, { withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
            alert('room added!');
            setRoomsUpdated(prev => !prev);
            setShowRoomForm(false);
          }
        })
    } catch (error) {
      console.error('failed:', error);
      alert('failed: ' + error.response?.data?.message || 'Unknown error');
    }
  };

  const handleAreaChange = (e) => {
    const newAreaId = Number(e.target.value);
    
    setRoomFormData(prevState => ({
      ...prevState,
      areaId: newAreaId
    }));
    setAreaId(newAreaId);
    console.log(areaId);
  };


  return (
    <div id='rooms-container'>
        <Navbar/>
        <div>
            <button onClick={() => setShowAreaForm(!showAreaForm)}>Add Area</button>
            {showAreaForm && (
          <div className='popup-overlay'>
            <div className='popup-content'>
              <h2>Add New Area</h2>
              <form onSubmit={handleAreaSubmit}>
                <div className='form-group'>
                  <label htmlFor='areaName'>Area Name</label>
                  <input
                    type='text'
                    id='areaName'
                    name='areaName'
                    value={areaFormData.areaName}
                    onChange={handleAreaFormChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='areaAdminEmail'>Admin Email</label>
                  <input
                    type='email'
                    id='areaAdminEmail'
                    name='areaAdminEmail'
                    value={areaFormData.areaAdminEmail}
                    onChange={handleAreaFormChange}
                    required
                  />
                </div>
                

                <div className='form-buttons'>
                  <button type='submit'>Add Area</button>
                  <button type='button' onClick={() => setShowAreaForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
            <button onClick={() => setShowRoomForm(!showRoomForm)}>Add Room</button>
            {showRoomForm && (
          <div className='popup-overlay'>
            <div className='popup-content'>
              <h2>Add New Room</h2>
              <form onSubmit={handleRoomSubmit}>
                <div className='form-group'>
                  <label htmlFor='roomName'>Room Name</label>
                  <input
                    type='text'
                    id='roomName'
                    name='roomName'
                    value={roomFormData.roomName}
                    onChange={handleRoomFormChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='description'>Description</label>
                  <textarea
                    id='description'
                    name='description'
                    value={roomFormData.description}
                    onChange={handleRoomFormChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='capacity'>Capacity</label>
                  <input
                    type='text'
                    id='capacity'
                    name='capacity'
                    value={roomFormData.capacity}
                    onChange={handleRoomFormChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='roomAdminEmail'>Admin Email</label>
                  <input
                    type='email'
                    id='roomAdminEmail'
                    name='roomAdminEmail'
                    value={roomFormData.roomAdminEmail}
                    onChange={handleRoomFormChange}
                    required
                  />
                </div>

                <div className='form-buttons'>
                  <button type='submit'>Add Room</button>
                  <button type='button' onClick={() => setShowRoomForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>

        <select id="area-select" value={areaId} onChange={handleAreaChange}>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.area_name}
          </option>
        ))}
      </select>

        <RoomTable areaId={areaId} key={roomsUpdated}/>
        
    </div>
  )
}

export default Rooms