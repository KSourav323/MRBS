import React, { useEffect, useState } from 'react';
import '../style/usertable.css'
import axios from 'axios';

const UserTable = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        try {
            axios
              .post('http://localhost:5000/api/listUser',{},{ withCredentials: true })
              .then((response) => {
                if (response.status === 201) {
                    setUsers(response.data.data);
                }
              })
          } catch (error) {
            console.error('failed:', error);
            alert('failed: ' + error.response?.data?.message || 'Unknown error');
          }
      }, []);


  return (
    <div>
      <h2>List of Users</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Level</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.level}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable