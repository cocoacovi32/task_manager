import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MessageSquare, User, Loader2, Send } from 'lucide-react';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState({});

    const API_BASE = `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/api`;

    const fetchTasks = useCallback(async () => {
        const token = localStorage.getItem('access_token');

        try {
            const res = await axios.get(`${API_BASE}/tasks/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTasks(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to load tasks. Please ensure you are logged in.");
        } finally {
            setLoading(false);
        }
    }, [API_BASE]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAssignChange = async (taskId, newAssignee) => {
        const token = localStorage.getItem('access_token');

        try {
            await axios.patch(
                `${API_BASE}/tasks/${taskId}/`,
                { assigned_to: newAssignee }, // 🔥 FIX: match Django field naming
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 🔥 FIX: functional state update (avoids stale state bugs)
            setTasks(prev =>
                prev.map(t =>
                    t.id === taskId ? { ...t, assigned_to: newAssignee } : t
                )
            );
        } catch (err) {
            alert("Update failed. Check backend permissions.");
        }
    };

    const handlePostComment = async (taskId) => {
        const commentText = newComment[taskId];
        if (!commentText?.trim()) return;

        const token = localStorage.getItem('access_token');

        try {
            await axios.post(
                `${API_BASE}/tasks/${taskId}/comments/`,
                { text: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchTasks();

        } catch (err) {
            // 🔥 FIX: safe fallback UI update
            setTasks(prev =>
                prev.map(t =>
                    t.id === taskId
                        ? { ...t, comments: [...(t.comments || []), commentText] }
                        : t
                )
            );
        } finally {
            setNewComment(prev => ({ ...prev, [taskId]: "" }));
        }
    };

    if (loading)
        return (
            <div style={centerStyle}>
                <Loader2 className="animate-spin" />
                Loading Board...
            </div>
        );

    if (error)
        return (
            <div style={{ ...centerStyle, color: 'red' }}>
                {error}
            </div>
        );

    return (
        <div style={{ padding: '30px', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <div style={headerStyle}>
                <h2>Team Task Board</h2>
                <button onClick={fetchTasks} style={refreshBtn}>Sync Data</button>
            </div>

            <div style={gridStyle}>
                {tasks.map(task => (
                    <div key={task.id} style={cardStyle}>
                        <h3 style={{ marginBottom: '10px' }}>{task.title}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
                            {task.description}
                        </p>

                        <div style={metaStyle}>
                            <User size={16} />
                            <span>Assignee:</span>
                            <select
                                value={task.assigned_to || ""}
                                onChange={(e) => handleAssignChange(task.id, e.target.value)}
                                style={selectStyle}
                            >
                                <option value="">Unassigned</option>
                                <option value="Collince">Collince</option>
                                <option value="Member 2">Member 2</option>
                                <option value="Member 3">Member 3</option>
                            </select>
                        </div>

                        <div style={commentSection}>
                            <h4 style={commentHeader}>
                                <MessageSquare size={14} /> Activity
                            </h4>

                            <div style={scrollBox}>
                                {(task.comments || []).map((msg, i) => (
                                    <p key={i} style={msgStyle}>{msg}</p>
                                ))}
                            </div>

                            <div style={inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment[task.id] || ""}
                                    style={inputStyle}
                                    onChange={(e) =>
                                        setNewComment(prev => ({
                                            ...prev,
                                            [task.id]: e.target.value
                                        }))
                                    }
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handlePostComment(task.id)
                                    }
                                />

                                <Send
                                    size={18}
                                    style={sendIcon}
                                    onClick={() => handlePostComment(task.id)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* styles unchanged */
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: 'white', border: '1px solid #e1e4e8', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
const metaStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#444', marginBottom: '20px' };
const commentSection = { background: '#f6f8fa', padding: '15px', borderRadius: '12px' };
const commentHeader = { margin: '0 0 10px 0', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' };
const scrollBox = { maxHeight: '120px', overflowY: 'auto', marginBottom: '10px' };
const msgStyle = { fontSize: '0.8rem', background: 'white', padding: '10px', marginBottom: '8px', borderRadius: '8px', borderLeft: '4px solid #007bff' };
const inputWrapper = { position: 'relative', display: 'flex', alignItems: 'center' };
const inputStyle = { width: '100%', padding: '10px 35px 10px 12px', border: '1px solid #d1d5da', borderRadius: '8px' };
const sendIcon = { position: 'absolute', right: '10px', color: '#007bff', cursor: 'pointer' };
const selectStyle = { padding: '5px', borderRadius: '6px', border: '1px solid #ddd' };
const refreshBtn = { padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' };
const centerStyle = { display: 'flex', height: '80vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '15px' };

export default TaskList;