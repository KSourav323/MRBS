import React from 'react'
import '../style/profile.css'
import Navbar from '../components/navbar'
import { useSelector } from 'react-redux';

const Profile = () => {
    const user = useSelector((state) => state.user.user);

  return (
    <div id='profile-container'>
        <Navbar />
        <div id='profile-details'>
            <h1>{user.name}</h1>

        </div>
        <div id='approvals'>
            approval table
        </div>
    </div>
  )
}

export default Profile