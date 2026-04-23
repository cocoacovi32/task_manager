// src/components/Navbar.js
import React from 'react';
import { Bell, LogOut, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, handleLogout }) => {
    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>
                <CheckSquare size={24} /> <span>CollabTask</span>
            </Link>
            <div style={styles.links}>
                <div style={styles.iconContainer}>
                    <Bell size={20} />
                    <span style={styles.badge}>3</span> {/* Notification Badge */}
                </div>
                <span style={{marginRight: '15px'}}>Welcome, {user}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={16} /></button>
            </div>
        </nav>
    );
};

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#282c34', color: 'white', alignItems: 'center' },
    logo: { display: 'flex', alignItems: 'center', gap: '10px', color: '#61dafb', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' },
    links: { display: 'flex', alignItems: 'center' },
    iconContainer: { position: 'relative', marginRight: '20px', cursor: 'pointer' },
    badge: { position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' },
    logoutBtn: { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }
};

export default Navbar;