import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/book.css'
import Navbar from'../components/navbar.jsx'

const Book = () => {

    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brief_description: 'a',
    full_description: 'a',
    date: '23-03-2001',
    start_time: 'a',
    end_time: 'a',
    area: 'aa',
    room: 'a'
  });
  const [dummy, setDummy] = useState({
    brief_description: 'sda',
    full_description: 'asdaf',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', dummy);
    try {
      axios
      .post('http://localhost:5000/api/addBooking',null,{ withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
            alert('Booking successful!');
            navigate('/');
          }
      })
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed: ' + error.response?.data?.message || 'Unknown error');
    }
  };

  const test = () => {
    axios
.post('http://localhost:5000/api/test', null, { withCredentials: true })
.then((response) => {
  if (response.data.redirect) {
    window.location.href = response.data.redirect;
  } else {
    console.log('Test successful:', response.data);
  }
})
.catch((error) => {
  console.error('Error fetching user:', error);
});
  };



  return (
    <div id='container'>
        <Navbar/>
        <div id='form-container'>
            <h2>Book a Hall</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='brief_description'>Brief description</label>
                    <input
                    type='text'
                    id='brief_description'
                    name='brief_description'
                    value={formData.brief_description}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='full_description'>Full description</label>
                    <textarea
                    id='full_description'
                    name='full_description'
                    value={formData.full_description}
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
                    value={formData.area}
                    onChange={handleChange}
                    required
                    >
                    <option value='area1'>Area 1</option>
                    <option value='area2'>Area 2</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='room'>Room</label>
                    <select
                    id='room'
                    name='room'
                    value={formData.room}
                    onChange={handleChange}
                    required
                    >
                    <option value='room1'>Room 1</option>
                    <option value='room2'>Room 2</option>
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