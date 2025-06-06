import { store } from './redux/store';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './style/App.css'

import Index from "./pages/index.jsx"
import Book from "./pages/book.jsx"
import Profile from "./pages/profile.jsx"
import Rooms from './pages/rooms.jsx';
import Users from './pages/users.jsx';
import RequestInfo from './pages/requestDetails.jsx'; 

import ErrorBoundary from './components/errorBoundary'; 

function App() {

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book" element={<Book />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/users" element={<Users />} />
            <Route path="/requestInfo" element={<RequestInfo />} />
            {/* <Route path="/tutor" element={<ProtectedRoute element={Tutor} />} /> */}
          </Routes> 
        </Router>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
