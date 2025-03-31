import React, { useState } from 'react'
import '../style/users.css'
import Navbar from '../components/navbar'
import axios from 'axios';
import { useSelector } from 'react-redux';
import UserTable from '../components/userTable';
import { toast } from 'react-toastify';

const Users = () => {
    const [showForm, setShowForm] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [usersUpdated, setUsersUpdated] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const user = useSelector(state => state.user);

    const isAdmin = () => {
      return user?.user?.level > 1;
    };

    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
    };
  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
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
    try {
      axios
        .post('http://localhost:5000/api/addUser', formData, { withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
            toast.success('New user added !', {
              autoClose: 1000
          });
            setUsersUpdated(prev => !prev);
            setShowForm(false);
          }
          else if(response.status === 202) {
            toast.error('Email already exists !', {
              autoClose: 1000
          });
            setUsersUpdated(prev => !prev);
            setShowForm(false);
          }
        })
    } catch (error) {
      console.error('failed:', error);
     toast.error('failed: ' + error.response?.data?.message || 'Unknown error', {
                               autoClose: 1000
                             });
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedFile) {
      setUploadStatus('Please select a CSV file.');
      return;
    }
  
    const formFileData = new FormData();
    formFileData.append('csvFile', selectedFile);
  
    try {
      axios
        .post('http://localhost:5000/api/import', formFileData, { 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
         withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
            toast.success('Import successful !', {
              autoClose: 1000
          });
            setUsersUpdated(prev => !prev);
            setShowUploader(false);
          }
        })
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file.');
    }
  };
    
  return (
    <div id='users-container'>
        <Navbar/>
        {isAdmin() && (
          <div id='admin-panel'>
            <div id='admin-btns'>
              <button className='show-form-btn' onClick={() => {setShowUploader(false), setShowForm(!showForm)}}>{showForm ? 'Close' : 'Add User'}</button>
              <button className='show-form-btn' onClick={() => {setShowForm(false), setShowUploader(!showUploader)}}>{showUploader ? 'Close' : 'Import from file'}</button>
            </div>
              {showForm && (
            <div className='popup-overlay'>
              <div className='popup-content'>
                <h4>Add New User</h4>
                <form onSubmit={handleSubmit}>
                  <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='role'>Role</label>
                    <select
                      id='role'
                      name='role'
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value='user'>User</option>
                      <option value='admin'>Admin</option>
                    </select>
                  </div>

                  <div className='form-buttons'>
                    <button id='cancel-btn' type='button' onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                    <button id='submit-btn' type='submit'>Add User</button>
                  </div>
                  
                </form>
              </div>
            </div>
          )}
          {showUploader && (
            <div id='uploader-overlay'>
              <h3>Upload CSV File</h3>  
              <form onSubmit={handleFileSubmit}>
                <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileChange} />
                <button type="submit">Upload</button>
              </form>
              {uploadStatus && <p>{uploadStatus}</p>}
            </div>
          )}
          </div>
        )}
        <UserTable key={usersUpdated}/>
        
    </div>
  )
}

export default Users