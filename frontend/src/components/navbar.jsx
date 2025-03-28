import React, { useEffect, useState } from 'react';
import '../style/navbar.css'
import { useDispatch } from 'react-redux';
import { login, logout } from '../redux/actions.js'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/login/success', { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          dispatch(login({
              email: response.data.user._json.email, 
              fname: response.data.user._json.family_name,
              gname: response.data.user._json.given_name,
              name: response.data.user._json.name,
              id: response.data.user._json.sub
            }));
          setUser(response.data.user._json);
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/logout/success', { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          dispatch(logout());
          setUser(null);
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, []);

  const googleAuth = () => {
    window.location.href = 'http://localhost:5000/auth/google/callback'
}

  const logout = () => {
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToRooms = () => {
    navigate('/rooms');
  };

  const goToUsers = () => {
    navigate('/users');
  };

  const home = () => {
    navigate('/');
  };
 


  return (
    <div id='header'>
            <div id='title'>
                <button id='logo' onClick={home}>NITC MRBS</button>
            </div>
            <div id='nav'>
                <div id='search'>
                    <input type='text' placeholder='Search' id='search-bar'></input>
                    <button id='search-btn'>Search</button>
                </div>
                <div id='nav-btn'>
                    <button className='btns'>Help</button>
                    {user ? (
                        <div>
                            <button className='btns'>Report</button>
                            <button className='btns'>Import</button>
                            <button className='btns' onClick={goToRooms}>Rooms</button>
                            <button className='btns' onClick={goToUsers}>Users</button>
                            <button className='btns' onClick={goToProfile}>{user.given_name[0].toUpperCase() + user.given_name.slice(1)}</button>
                            <button className='btns' onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <button  className='btns' onClick={googleAuth}>Login</button>
                        </div>
                    )}
                </div>
                
            </div>
            

        </div> 
  )
}

export default Navbar