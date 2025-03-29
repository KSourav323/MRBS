import React, { useEffect, useState } from 'react';
import '../style/entrytable.css'
import axios from 'axios';

const EntryTable = ({ userEmail }) => {
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
            alert('failed: ' + error.response?.data?.message || 'Unknown error');
          }
      }, [userEmail]);


  return (
    <div>
         {entries && entries.length > 0 ? (
        <>   
        <h2>Request History</h2>
        <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
            <tr>
                <th>ID</th>
                <th>from</th>
            </tr>
            </thead>
            <tbody>
            {entries.length > 0 ? (
                entries.map((entry) => (
                <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{entry.create_by}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="4">No room found.</td>
                </tr>
            )}
            </tbody>
        </table>
      </>
       ) : (
        <div className="no-requests">
          <p>No pending requests to display</p>
        </div>
      )}
    </div>
  )
}

export default EntryTable