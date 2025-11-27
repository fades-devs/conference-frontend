// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [myRooms, setMyRooms] = useState([]);
  const [formData, setFormData] = useState({ name: '', location: '', capacity: 10, basePrice: 50 });
  const [file, setFile] = useState(null);

  // Fetch My Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`${import.meta.env.VITE_ROOM_API}/rooms/partner/my-rooms`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMyRooms(res.data);
      } catch (err) {
          console.error("Fetch error", err);
      }
    };
    fetchRooms();
  }, [getAccessTokenSilently]);

  // Handle Create Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      
      const data = new FormData();
      data.append('name', formData.name);
      data.append('location', formData.location);
      data.append('capacity', formData.capacity);
      data.append('basePrice', formData.basePrice);
      if (file) data.append('pictures', file);

      await axios.post(`${import.meta.env.VITE_ROOM_API}/rooms`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      alert("Room Created!");
      window.location.reload(); 
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Partner Dashboard</h2>
      
      {/* Create Form */}
      <div className="card p-3 mb-4 bg-light">
        <h4>List a New Room</h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-2">
              <input type="text" className="form-control" placeholder="Room Name" required 
                onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" className="form-control" placeholder="Location" required 
                onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="col-md-4 mb-2">
              <input type="number" className="form-control" placeholder="Capacity" required 
                onChange={e => setFormData({...formData, capacity: e.target.value})} />
            </div>
            <div className="col-md-4 mb-2">
              <input type="number" className="form-control" placeholder="Price (£)" required 
                onChange={e => setFormData({...formData, basePrice: e.target.value})} />
            </div>
            <div className="col-md-4 mb-2">
              <input type="file" className="form-control" accept="image/*" required 
                onChange={e => setFile(e.target.files[0])} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Create Listing</button>
        </form>
      </div>

      {/* List Existing Rooms */}
      <h4>My Listings</h4>
      <ul className="list-group">
        {myRooms.map(r => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={r._id}>
            <span>{r.name} ({r.location}) - £{r.basePrice}</span>
            <span className="badge bg-success">Active</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;