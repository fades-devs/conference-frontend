// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Conference Booking</Link>
      <div className="ms-auto">
        <Link className="btn btn-link text-white text-decoration-none" to="/">Home</Link>
        
        {isAuthenticated ? (
          <>
            <Link className="btn btn-link text-white text-decoration-none" to="/my-bookings">My Bookings</Link>
            <Link className="btn btn-link text-white text-decoration-none" to="/partner">Partner Dashboard</Link>
            <span className="text-white mx-3">Hello, {user.name}</span>
            <button className="btn btn-danger btn-sm" onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => loginWithRedirect()}>Log In</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;