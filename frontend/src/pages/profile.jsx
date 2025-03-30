import React, {useState, useEffect} from 'react'
import '../style/profile.css'
import Navbar from '../components/navbar'
import { useSelector } from 'react-redux';
import axios from 'axios';
import EntryTable from '../components/entryTable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Profile = () => {
    const user = useSelector((state) => state.user.user);
    const [requests, setRequests] = useState([]);
    const [updated, setUpdated] = useState(false);
    const userEmail = user?.email;
    const navigate = useNavigate();

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
            toast.error('failed: ' + error.response?.data?.message || 'Unknown error', {
                                      autoClose: 1000
                                    });
          }
      }, [updated]);


      const handleApproval = async (requestId, status) => {
        try {
          axios
            .post('http://localhost:5000/api/addApproval', {request_id: requestId, status: status }, { withCredentials: true })
            .then((response) => {
              if (response.status === 201) {
                toast.success('Status updated !', {
                  autoClose: 1000 
              });
                setUpdated(!updated)
              }
            })
        } catch (error) {
          console.error('failed:', error);
          toast.error('failed: ' + error.response?.data?.message || 'Unknown error', {
                                    autoClose: 1000
                                  });
        }
      };
    

      const handleMoreInfo = (entryId) => {
        const selectedEntry = requests.find(entry => entry.id === entryId);
        navigate('/requestinfo', {
          state: { 
            entryData: selectedEntry
          }
        });
    };

    const formatTime = (timeString) => {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formatHour = hour % 12 || 12;
      return `${formatHour}:${minutes} ${ampm}`;
  };

  const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
      
      return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div id='profile-container'>
        <Navbar />
        <div id='profile-details'>
            <h1>{user.name}</h1>
            <h5>{roleMapping[user.level]}</h5>

        </div>
        <div id='approvals'>
        <h4>Requests Pending</h4>
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
              <td>{formatTimestamp(request.timestamp)}</td>
              <td>{request.create_by}</td>
              <td>{formatTimestamp(request.date)}</td>
              <td>{formatTime(request.start_time)}</td>
              <td>{formatTime(request.end_time)}</td>
              <td>{request.subject}</td>
              <td className='btns-cell'>
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
              <td className='btns-cell'><button className='info-btn' onClick={() => handleMoreInfo(request.id)}>Info</button></td>
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