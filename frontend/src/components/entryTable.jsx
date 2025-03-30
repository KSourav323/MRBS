import React, { useEffect, useState } from 'react';
import '../style/entrytable.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EntryTable = ({ userEmail }) => {
  const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        try {
            axios
              .post('http://localhost:5000/api/listMyEntry',{adminEmail: userEmail},{ withCredentials: true })
              .then((response) => {
                if (response.status === 201) {
                    setEntries(response.data.data);
                }
              })
          } catch (error) {
            console.error('failed:', error);
            toast.error('failed: ' + error.response?.data?.message || 'Unknown error', {
                          autoClose: 1000
                        });
          }
      }, [userEmail]);


      const handleMoreInfo = (entryId) => {
        const selectedEntry = entries.find(entry => entry.id === entryId);
        navigate('/requestinfo', {
          state: { 
            entryData: selectedEntry
          }
        });
    };

    const statusMap = new Map([
      [1, "Approved"],
      [-1, "Rejected"]
    ]);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

  return (
    <div id='entrytable-container'>
         {entries && entries.length > 0 ? (
        <>   
        <h4>Request History</h4> 
        <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
            <tr>
                <th>Date</th>
                <th>Area</th>
                <th>Room</th>
                <th>Sender</th>
                <th>Status</th>
                <th>Details</th>

            </tr>
            </thead>
            <tbody>
            {entries.length > 0 ? (
                entries.map((entry) => (
                <tr key={entry.id}>
                    <td>{formatDate(entry.date)}</td>
                    <td>{entry.area_name}</td>
                    <td>{entry.room_name}</td>
                    <td>{entry.create_by}</td>
                    <td>{statusMap.get(entry.is_approved) || "Unknown"}</td>
                    <td className='btns-cell'><button className='info-btn' onClick={() => handleMoreInfo(entry.id)}>Info</button></td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="6">No room found.</td>
                </tr>
            )}
            </tbody>
        </table>
      </>
       ) : (
        <div className="no-requests">
          <p>No history to display</p>
        </div>
      )}
    </div>
  )
}

export default EntryTable