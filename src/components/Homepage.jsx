import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = ({ userInfo }) => {
    return (
        <div>
            {userInfo ? (
                <div className='HomepageCont'>
                    <h1>Welcome back, {userInfo.user.username}!</h1>
                    <p>Explore your dashboard or manage your company.</p>
                    <nav>
                        <Link to="/all-dashboard">Go to Admin Dashboard</Link>
                    </nav>
                </div>
            ) : (
                <div className='HomepageCont'>
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