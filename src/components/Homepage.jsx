import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = ({ userInfo }) => {
    return (
        <div>
            <h1>Welcome to the Homepage</h1>
            {userInfo ? (
                <div>
                    <h2>Welcome back, {userInfo.user.username}!</h2>
                    <p>Explore your dashboard or manage your companies.</p>
                    <nav>
                        <Link to="/admin-dashboard">Go to Admin Dashboard</Link>
                    </nav>
                </div>
            ) : (
                <div>
                    <p>Welcome! Please log in or register to continue.</p>
                    <nav>
                        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Homepage;