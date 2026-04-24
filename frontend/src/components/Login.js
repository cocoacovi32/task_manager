import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuth }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Updated to your live Railway backend URL
    const API_BASE_URL = "https://taskmanager-production-617c.up.railway.app/api";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // URL results in https://taskmanager-production-617c.up.railway.app/api/token/
            const response = await axios.post(`${API_BASE_URL}/token/`, {
                username: formData.username,
                password: formData.password
            });

            // Store tokens for JWT functionality
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Update auth state to trigger redirect
            setAuth(true);
        } catch (err) {
            console.error("Login error details:", err.response?.data);
            // Fallback error message if backend doesn't return a specific detail
            setError(err.response?.data?.detail || "Login Failed! Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Task Manager</h2>
                <p style={styles.subtitle}>Sign in to collaborate with your team</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Enter username"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '350px'
    },
    title: {
        margin: '0 0 10px 0',
        textAlign: 'center',
        color: '#1a1a1a'
    },
    subtitle: {
        margin: '0 0 25px 0',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '16px'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s'
    },
    errorBox: {
        backgroundColor: '#fff1f0',
        border: '1px solid #ffa39e',
        color: '#cf1322',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '13px',
        textAlign: 'center'
    }
};

export default Login;