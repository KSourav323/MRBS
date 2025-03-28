import React, { useState, useEffect } from 'react';
import '../style/schedule.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Schedule = ({ areaId }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const user = useSelector(state => state.user);

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
    <div className="schedule">
            {rooms.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Room Name</th>
                            <th>Description</th>
                            <th>Capacity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.id}>
                                <td>{room.room_name}<button onClick={()=>{bookSlot(room.id)}}>Book</button></td>
                                <td>{room.description}</td>
                                <td>{room.capacity}</td>
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
