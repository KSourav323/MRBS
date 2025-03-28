import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/book.css'
import Navbar from '../components/navbar.jsx'
import { useLocation } from 'react-router-dom';

const Book = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { areaId, roomId } = location.state || {};
  
  const [areas, setAreas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);


  const [formData, setFormData] = useState({
    area_id: areaId || '',
    room_id: roomId || '',
    subject: '',
    description: '',
    date: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    if (areaId && roomId) {
      setFormData(prev => ({
            ...prev,
            area_id: areaId,
            room_id: roomId
        }));
    }
  }, [areaId, roomId]);

  useEffect(() => {
    axios
        .post('http://localhost:5000/api/listArea', {}, { withCredentials: true })
        .then((response) => {
            if (response.status === 201) {
                setAreas(response.data.data);
                if (areaId) {
                  const area = response.data.data.find(a => a.id === areaId);
                  setSelectedArea(area);
                }
            }
        })
        .catch((error) => {
            console.error('failed:', error);
            alert('failed: ' + error.response?.data?.message || 'Unknown error');
        });
  }, [areaId]);

  useEffect(() => {
    if (selectedArea) {
        axios
            .post('http://localhost:5000/api/listRoom',
                { area_id: selectedArea.id },
                { withCredentials: true }
            )
            .then((response) => {
                if (response.status === 201) {
                    setRooms(response.data.data);
                    if (roomId) {
                      const room = response.data.data.find(r => r.id === roomId);
                      setSelectedRoom(room);
                    }
                }
            })
            .catch((error) => {
                console.error('Failed to fetch rooms:', error);
            });
    }
}, [selectedArea, roomId]); 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post('http://localhost:5000/api/addBooking', formData, { withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
            alert('Booking successful!');
            navigate('/');
          }
        })
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed: ' + error.response?.data?.message || 'Unknown error');
    }
  };


  return (
    <div id='container'>
      <Navbar />
      <div id='form-container'>
        <h2>Book a Hall</h2>
        <form onSubmit={handleSubmit}>

          <div className='form-group'>
            <label htmlFor='subject'>Brief description</label>
            <input
              type='text'
              id='subject'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='description'>Full description</label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
                <div className='form-group'>
                    <label htmlFor='date'>Date</label>
                    <input
                    type='date'
                    id='date'
                    name='date'
                    value={formData.date}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='start_time'>Start Time</label>
                    <input
                        type='time'
                        id='start_time'
                        name='start_time'
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                    />
                </div>

          <div className='form-group'>
                    <label htmlFor='end_time'>End Time</label>
                    <input
                        type='time'
                        id='end_time'
                        name='end_time'
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='area'>Area</label>
                    <select
                    id='area'
                    name='area'
                    value={formData.area_id}
                    onChange={handleChange}
                    required
                    >
                      {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.area_name}
                                </option>
                            ))}
                    </select>
                </div>

          <div className='form-group'>
                    <label htmlFor='room'>Room</label>
                    <select
                    id='room'
                    name='room_id'
                    value={formData.room_id}
                    onChange={handleChange}
                    required
                    >
                      {rooms.map(room => (
                          <option key={room.id} value={room.id}>
                            {room.room_name}
                        </option>
                        ))}
                    </select>
                </div>

          <div className='form-buttons'>
            <button type='submit'>Book Room</button>
            <button type='button' onClick={() => navigate('/')}>Cancel</button>
          </div>


        </form>
      </div>
    </div>
  )
}

export default Book