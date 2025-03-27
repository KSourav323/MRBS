import { store } from './redux/store';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './style/App.css'

import Index from "./pages/index.jsx"
import Book from "./pages/book.jsx"

function App() {

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book" element={<Book />} />
          {/* <Route path="/tutor" element={<ProtectedRoute element={Tutor} />} /> */}
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
