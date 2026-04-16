import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, User, Loader2 } from 'lucide-react';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Fetch Tasks from Django on Load
    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/tasks/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load tasks. Make sure you are logged in.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // 2. Handle Assignment Change (Backend update)
    const handleAssignChange = async (taskId, newAssignee) => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.patch(`http://127.0.0.1:8000/api/tasks/${taskId}/`,
                { assignedTo: newAssignee },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            // Update local state
            setTasks(tasks.map(t => t.id === taskId ? { ...t, assignedTo: newAssignee } : t));
        } catch (err) {
            alert("Could not update assignment.");
        }
    };

    if (loading) return <div style={centerStyle}><Loader2 className="animate-spin" /> Loading Tasks...</div>;
    if (error) return <div style={{...centerStyle, color: 'red'}}>{error}</div>;

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Team Task Board</h2>
                <button onClick={() => window.location.reload()} style={refreshBtn}>Refresh</button>
            </div>

            <div style={gridStyle}>
                {tasks.length === 0 ? <p>No tasks found. Add some in Django Admin!</p> : tasks.map(task => (
                    <div key={task.id} style={cardStyle}>
                        <h3 style={{ marginTop: 0 }}>{task.title}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{task.description}</p>

                        {/* Requirement: Collaborate in Teams */}
                        <div style={metaStyle}>
                            <User size={16} />
                            <label>Assigned to:</label>
                            <select
                                value={task.assignedTo || ""}
                                onChange={(e) => handleAssignChange(task.id, e.target.value)}
                                style={selectStyle}
                            >
                                <option value="Unassigned">Unassigned</option>
                                <option value="Collince">Collince</option>
                                <option value="Member 2">Group Member 2</option>
                                <option value="Member 3">Group Member 3</option>
                            </select>
                        </div>

                        {/* Requirement: Comment on Tasks */}
                        <div style={commentSection}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MessageSquare size={14} /> Comments
                            </h4>
                            <div style={scrollBox}>
                                {task.comments && task.comments.map((msg, i) => (
                                    <p key={i} style={msgStyle}>{msg}</p>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Press Enter to comment..."
                                style={inputStyle}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        // Logic to post comment would go here
                                        e.target.value = "";
                                    }
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Styles ---
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: 'white', border: '1px solid #eee', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const metaStyle = { display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0', fontSize: '0.85rem', color: '#555' };
const commentSection = { background: '#f8f9fa', padding: '12px', borderRadius: '8px', marginTop: '15px' };
const msgStyle = { fontSize: '0.75rem', background: 'white', padding: '8px', marginBottom: '8px', borderRadius: '6px', borderLeft: '4px solid #007bff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '10px', boxSizing: 'border-box' };
const selectStyle = { padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' };
const centerStyle = { display: 'flex', height: '50vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' };
const scrollBox = { maxHeight: '150px', overflowY: 'auto' };
const refreshBtn = { padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#eee', cursor: 'pointer' };

export default TaskList;