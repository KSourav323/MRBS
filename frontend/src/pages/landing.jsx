import React from 'react'

const Landing = () => {

    // const userDetails = user.user;
    // console.log(userDetails);
    const handleLogout = () => {
        window.location.href = 'http://localhost:5000/auth/logout';
      };
  return (
    <div>
        <h1>{userDetails.name}</h1>
     <button onClick={handleLogout}>
      Logout
    </button>
    </div>
  )
}

export default Landing