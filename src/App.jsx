import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Bookings from './components/Bookings';

function App() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  // AUTO-SYNC USER ON LOGIN
  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          // using VITE_USER_API here
          await axios.post(
            `${import.meta.env.VITE_USER_API}/users/sync`,
            { email: user.email },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("User Synced to DB");
        } catch (err) {
          console.error("Sync failed", err);
        }
      }
    };
    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/partner" element={<Dashboard />} />
        <Route path="/my-bookings" element={<Bookings />} />
        
        {/* Success/Cancel Stripe pages */}
        <Route path="/bookings/success" element={<div className="container mt-5"><h2>Payment Successful!</h2><p>Your booking is confirmed.</p></div>} />
        <Route path="/bookings/cancel" element={<div className="container mt-5"><h2>Payment Cancelled</h2></div>} />
      </Routes>
    </Router>
  );
}

export default App;