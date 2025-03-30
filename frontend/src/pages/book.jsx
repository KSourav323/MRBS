import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/book.css'
import Navbar from '../components/navbar.jsx'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Book = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { areaId, roomId, date, startTime, endTime } = location.state || {};
  
  const [areas, setAreas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [formData, setFormData] = useState({
    area_id: areaId || '',
    room_id: roomId || '',
    subject: '',
    description: '',
    date: date || '', 
    start_time: startTime || '', 
    end_time: endTime || ''
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
           toast.error('failed: ' + error.response?.data?.message || 'Unknown error', {
                                     autoClose: 1000
                                   });
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


const getNextHourSlot = (startTime) => {
  const [hours, minutes] = startTime.split(':');
  const nextHour = (parseInt(hours) + 1).toString().padStart(2, '0');
  return `${nextHour}:${minutes}`;
};


const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'area_id') {
    const newAreaId = Number(value);
    const selectedArea = areas.find(area => area.id === newAreaId);
    setSelectedArea(selectedArea);
  }

  if (name === 'start_time') {
    const nextHourSlot = getNextHourSlot(value);
    const validEndTime = timeSlots.includes(nextHourSlot) ? nextHourSlot : '';
        
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      end_time: validEndTime
    }));
    return;
  }

  if (name === 'end_time') {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    return;
  }
  
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
            toast.success('Booking successful!', {
              onClose: () => navigate('/'),
              autoClose: 1000
            });
          }
          else if
          (response.status === 202) {
            toast.warning('Slot is already taken!', {
              autoClose: 1000
            });
          }
        })
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Booking failed: ' + error.response?.data?.message || 'Unknown error', {
        autoClose: 1000
      });
    }
  };


    const timeSlots = [
      "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", 
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
      "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
      "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
      "22:00", "22:30", "23:00", "23:30"
    ];

    const getEndTimeSlots = () => {
      if (!formData.start_time) return timeSlots;
      
      const startIndex = timeSlots.indexOf(formData.start_time);
      if (startIndex === -1) return timeSlots;
      
      return timeSlots.slice(startIndex + 1);
    };

  return (
    <div id='container'>
      
      <Navbar />
      <div id='form-container'>
        
        <h2>Book a Hall</h2>
        <form onSubmit={handleSubmit} id='booking-form'>

          <div className='form-group'>
            <label htmlFor='subject'>Subject</label>
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

          <div className='form-time'>

              <div className='form-group'>
                  <label htmlFor='start_time'>Start Time</label>
                  <select className='time-select'
                      id='start_time'
                      name='start_time'
                      value={formData.start_time}
                      onChange={handleChange}
                      required
                  >
                      <option value="">Select start time</option>
                      {timeSlots.map((time) => (
                          <option key={time} value={time}>
                              {time}
                          </option>
                      ))}
                  </select>
              </div>

               <div className='form-group'>
                <label htmlFor='end_time'>End Time</label>
                <select
                className='time-select'
                    id='end_time'
                    name='end_time'
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select end time</option>
                    {getEndTimeSlots().map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </div>
          </div>

          <div className='form-group'>
              <label htmlFor='area'>Area</label>
              <select
              id='area'
              name='area_id'
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
            <button id='cancel-btn' type='button' onClick={() => navigate('/')}>Cancel</button>
            <button id='submit-btn' type='submit'>Submit</button>
          </div>


        </form>
      </div>
    </div>
  )
}

export default Book