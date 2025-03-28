import React, { useEffect, useState } from 'react';
import '../style/roomtable.css'
import axios from 'axios';

const RoomTable = ({ areaId }) => {
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        try {
            axios
              .post('http://localhost:5000/api/listRoom',{area_id: areaId},{ withCredentials: true })
              .then((response) => {
                if (response.status === 200) {
                    setRooms(response.data.data);
                }
              })
          } catch (error) {
            console.error('failed:', error);
            alert('failed: ' + error.response?.data?.message || 'Unknown error');
          }
      }, [areaId]);


  return (
    <div>
      <h2>List of Rooms</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Room name</th>
            <th>Description</th>
            <th>Capacity</th>
            <th>Admin Email</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.room_name}</td>
                <td>{room.description}</td>
                <td>{room.capacity}</td>
                <td>{room.room_admin_email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No room found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RoomTable