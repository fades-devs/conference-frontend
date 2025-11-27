// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    // Public fetch - no token needed for GET /rooms
    axios.get(`${import.meta.env.VITE_ROOM_API}/rooms`)
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleBook = async (roomId) => {
    if (!isAuthenticated) return loginWithRedirect();

    try {
      const token = await getAccessTokenSilently();
      // Default to booking tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const res = await axios.post(
        `${import.meta.env.VITE_BOOKING_API}/bookings`,
        { roomId, date: tomorrow.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // REDIRECT TO STRIPE
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      alert("Booking Failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Available Rooms</h2>
      <div className="row">
        {rooms.map(room => (
          <div className="col-md-4 mb-4" key={room._id}>
            <div className="card h-100">
              {/* Show image if exists */}
              {room.pictures?.[0] && (
                <img src={room.pictures[0]} className="card-img-top" alt={room.name} style={{height: '200px', objectFit: 'cover'}} />
              )}
              <div className="card-body">
                <h5 className="card-title">{room.name}</h5>
                <p className="card-text">{room.location} | Cap: {room.capacity}</p>
                <p className="text-primary fw-bold">£{room.basePrice} / day</p>
                <button className="btn btn-success w-100" onClick={() => handleBook(room._id)}>
                  Book for Tomorrow
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;