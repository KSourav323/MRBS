import React, { useState, useEffect } from 'react';
import '../style/schedule.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Schedule = ({ areaId }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const user = useSelector(state => state.user);

  const timeSlots = Array.from({ length: 33 }, (_, i) => {
    const totalMinutes = (7 * 60) + (i * 30); // Start from 7:00, increment by 30 mins
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

    useEffect(() => {
        if (!areaId) return;
        if (user.isLoggedIn) {
            axios
                .post('http://localhost:5000/api/listRoom',
                    { area_id: areaId },
                    { withCredentials: true }
                )
                .then((response) => {
                    if (response.status === 201) {
                        setRooms(response.data.data);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch rooms:', error);
                });
        }
        else{
          axios
                .post('http://localhost:5000/public/listRoom',
                    { area_id: areaId },
                    { withCredentials: true }
                )
                .then((response) => {
                    if (response.status === 201) {
                        setRooms(response.data.data);
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch rooms:', error);
                });
        }
    }, [areaId, user]); 

    const bookSlot = (roomId) => {
      if (!user?.isLoggedIn) {
        window.location.href = 'http://localhost:5000/auth/google/callback';
        return;
      }
      navigate('/book', {
        state: { 
          areaId: areaId, 
          roomId: roomId
        }
      });
    }

  return (
    <div id="schedule-container">
            {rooms.length > 0 ? (
                <table id='schedule-table'>
                    <thead id='schedule-head'>
                        <tr id='schedule-tr'>
                            <th className='time-col'>Time</th>
                            {rooms.map(room => (
                                <th key={room.id}>{room.room_name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody id='schedule-body'>
                        {timeSlots.map((time, index) => (
                        <tr className='schedule-row' key={index}>
                            <td className="time-col" >{time}</td> 
                            {rooms.map(room => (
                            <td key={`${room.id}-${time}`} className="booking-cell">
                                <button 
                                onClick={() => bookSlot(room.id)}
                                className="book-button"
                                >
                                Book
                                </button>
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No rooms found for this area</p>
            )}
        </div>
  );
};


export default Schedule;
