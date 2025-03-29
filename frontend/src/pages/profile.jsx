import React, {useState, useEffect} from 'react'
import '../style/profile.css'
import Navbar from '../components/navbar'
import { useSelector } from 'react-redux';
import axios from 'axios';
import EntryTable from '../components/entryTable';


const Profile = () => {
    const user = useSelector((state) => state.user.user);
    const [requests, setRequests] = useState([]);
    const [updated, setUpdated] = useState(false);
    const userEmail = user?.email;

    const roleMapping = {
      1: 'user',
      2: 'admin'
    };

    useEffect(() => {
        try {
            axios
              .post('http://localhost:5000/api/listRequests',{adminEmail: user.email},{ withCredentials: true })
              .then((response) => {
                if (response.status === 201) {
                    setRequests(response.data.data);
                }
              })
          } catch (error) {
            console.error('failed:', error);
            alert('failed: ' + error.response?.data?.message || 'Unknown error');
          }
      }, [updated]);


      const handleApproval = async (requestId, status) => {
        try {
          axios
            .post('http://localhost:5000/api/addApproval', {request_id: requestId, status: status }, { withCredentials: true })
            .then((response) => {
              if (response.status === 201) {
                alert('successful!');
                setUpdated(!updated)
              }
            })
        } catch (error) {
          console.error('failed:', error);
          alert('failed: ' + error.response?.data?.message || 'Unknown error');
        }
      };
    

  return (
    <div id='profile-container'>
        <Navbar />
        <div id='profile-details'>
            <h1>{user.name}</h1>
            <h5>{roleMapping[user.level]}</h5>

        </div>
        <div id='approvals'>
        {requests && requests.length > 0 ? (
          <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Sent By</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Subject</th>
            <th>Action</th>
            <th>More details</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{new Date(request.timestamp).toLocaleString()}</td>
              <td>{request.create_by}</td>
              <td>{new Date(request.date).toLocaleString()}</td>
              <td>{request.start_time}</td>
              <td>{request.end_time}</td>
              <td>{request.subject}</td>
              <td>
                {request.is_approved === 0 ? (
                  <div className="action-buttons">
                    <button 
                      className="accept-btn"
                      onClick={() => handleApproval(request.id, 1)}
                    >
                      Accept
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleApproval(request.id, -1)}
                    >
                      Reject
                    </button>
                  </div>
                ) : request.is_approved === 1 ? (
                  <span className="status-label accepted">Accepted</span>
                ) : (
                  <span className="status-label rejected">Rejected</span>
                )}
              </td>
              <td>go</td>
            </tr>
          ))}
        </tbody>
          </table>
        ) : (
          <div className="no-requests">
            <p>No pending requests to display</p>
          </div>
        )}
        </div>
        <EntryTable userEmail={userEmail} key={updated}/>
    </div>
  )
}

export default Profile