import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import '../style/info.css'
import { useNavigate } from 'react-router-dom';

const RequestInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { entryData } = location.state || {};

    const statusMapper = {
        1: 'Approved',
        0: 'Pending',
        '-1': 'Rejected'
    };

    const formatStatus = (status) => {
        return statusMapper[status] || 'Unknown';
    };

    const handleReturn = () => {
        navigate(-1);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
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
      const timeString = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
      });
      return `${formatDate(timestamp)} ${timeString}`;
    };
    const tableData = [
      { label: "Request ID", value: entryData.id },
      { label: "Area ID", value: entryData.area_id },
      { label: "Area Name", value: entryData.area_name },
      { label: "Room ID", value: entryData.room_id },
      { label: "Room Name", value: entryData.room_name },
      { label: "Requested By", value: entryData.create_by },
      { label: "Date", value: formatDate(entryData.date) },
      { label: "Start Time", value: formatTime(entryData.start_time) },
      { label: "End Time", value: formatTime(entryData.end_time) },
      { label: "Status", value: formatStatus(entryData.is_approved) },
      { label: "Request Time", value: formatTimestamp(entryData.timestamp) }
  ];


  return (
    <div id='request-info-container'>
        <Navbar/>
        <div id='info-container'>
          <button id='back-btn' onClick={handleReturn}>Return</button>
          <div id='details'>
                    <table>
                        <tbody>
                            {tableData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.label}</td>
                                    <td>{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="subject-description">
                        <div className="content-block">
                            <h5>Subject</h5>
                            <p>{entryData.subject}</p>
                        </div>
                        <div className="content-block">
                            <h5>Description</h5>
                            <p>{entryData.description}</p>
                        </div>
                    </div>
                </div>
        </div>
        
        
    </div>
  )
}

export default RequestInfo