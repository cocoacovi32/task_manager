import React, { useState } from 'react';

const Login = ({ setAuth }) => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!username.trim()) {
            setError('Please enter a username');
            setLoading(false);
            return;
        }

        try {
            // Simple username-based login (no password)
            localStorage.setItem('access_token', 'demo-token-' + username);
            localStorage.setItem('user', username);
            setAuth(true);
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Task Manager</h2>
                <p style={styles.subtitle}>Enter your username to continue</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div style={styles.infoBox}>
                    <p style={styles.infoText}>💡 Tip: Use any username to login</p>
                </div>
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
        color: '#1a1a1a',
        fontSize: '28px'
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
        fontSize: '16px',
        transition: 'border-color 0.3s'
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
    },
    infoBox: {
        backgroundColor: '#e6f7ff',
        border: '1px solid #91d5ff',
        padding: '12px',
        borderRadius: '6px',
        marginTop: '20px'
    },
    infoText: {
        margin: '0',
        color: '#0050b3',
        textAlign: 'center',
        fontSize: '13px'
    }
};

export default Login;
