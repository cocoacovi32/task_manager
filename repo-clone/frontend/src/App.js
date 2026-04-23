// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import TaskList from './components/TaskList';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState('');

    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            setUser(loggedUser);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            {isAuthenticated && <Navbar user={user} handleLogout={handleLogout} />}
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
                <Route path="/" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;