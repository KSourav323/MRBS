import React, {useState, useEffect} from 'react'
import '../style/profile.css'
import Navbar from '../components/navbar'
import { useSelector } from 'react-redux';
import axios from 'axios';

const Profile = () => {
    const user = useSelector((state) => state.user.user);
    const [requests, setRequests] = useState([]);
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
                    console.log(response.data.data)
                }
              })
          } catch (error) {
            console.error('failed:', error);
            alert('failed: ' + error.response?.data?.message || 'Unknown error');
          }
      }, []);
    

  return (
    <div id='profile-container'>
        <Navbar />
        <div id='profile-details'>
            <h1>{user.name}</h1>
            <h5>{roleMapping[user.level]}</h5>

        </div>
        <div id='approvals'>
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
            <td>yes or no</td>
            <td>go</td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
    </div>
  )
}

export default Profile