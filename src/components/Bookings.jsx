// src/components/Bookings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`${import.meta.env.VITE_BOOKING_API}/bookings/my-bookings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
          console.error("Fetch bookings error", err);
      }
    };
    fetchBookings();
  }, [getAccessTokenSilently]);

  return (
    <div className="container mt-4">
      <h2>My Bookings</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Date</th>
            <th>Final Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.roomName}</td>
              <td>{new Date(b.date).toLocaleDateString()}</td>
              <td>£{b.finalPrice.toFixed(2)}</td>
              <td>
                <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;