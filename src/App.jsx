// src/App.jsx
import React from 'react';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <h1>Welcome to Conference Booking</h1>
        <p>This is where the page content will go.</p>
      </div>
    </div>
  );
}

export default App;