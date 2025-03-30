import React, { useState } from 'react'
import '../style/users.css'
import Navbar from '../components/navbar'
import axios from 'axios';
import { useSelector } from 'react-redux';
import UserTable from '../components/userTable';
import { toast } from 'react-toastify';

const Users = () => {
    const [showForm, setShowForm] = useState(false);
    const [usersUpdated, setUsersUpdated] = useState(false);
    const user = useSelector(state => state.user);

    const isAdmin = () => {
      return user?.user?.level > 1;
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

    
  return (
    <div id='users-container'>
        <Navbar/>
        {isAdmin() && (
          <div id='admin-panel'>
              <button id='show-form-btn' onClick={() => setShowForm(!showForm)}>{showForm ? 'Close' : 'Add User'}</button>
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
          </div>
        )}
        <UserTable key={usersUpdated}/>
        
    </div>
  )
}

export default Users