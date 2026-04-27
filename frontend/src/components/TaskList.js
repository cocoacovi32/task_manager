import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Loader2, Send, Trash2, Plus, Calendar } from 'lucide-react';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState({});
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');

    // Load tasks from localStorage on mount
    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        } else {
            // Default sample tasks
            const defaultTasks = [
                {
                    id: 1,
                    title: 'Design Homepage',
                    description: 'Create mockups and design for the new homepage',
                    assignedTo: 'Collince',
                    deadline: '2026-05-15',
                    comments: ['Started working on this', 'Completed initial designs']
                },
                {
                    id: 2,
                    title: 'Backend API Setup',
                    description: 'Set up REST API endpoints',
                    assignedTo: 'Member 2',
                    deadline: '2026-05-10',
                    comments: ['In progress']
                },
                {
                    id: 3,
                    title: 'Database Schema',
                    description: 'Design and create database schema',
                    assignedTo: '',
                    deadline: '2026-05-20',
                    comments: ['Pending review']
                }
            ];
            setTasks(defaultTasks);
            localStorage.setItem('tasks', JSON.stringify(defaultTasks));
        }
        setLoading(false);
    }, []);

    // Save tasks to localStorage whenever they change
    const saveTasks = (updatedTasks) => {
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const handleAssignChange = (taskId, newAssignee) => {
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, assignedTo: newAssignee } : t
        );
        saveTasks(updatedTasks);
    };

    const handleDeadlineChange = (taskId, newDeadline) => {
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, deadline: newDeadline } : t
        );
        saveTasks(updatedTasks);
    };

    const handlePostComment = (taskId) => {
        const commentText = newComment[taskId];
        if (!commentText || !commentText.trim()) return;

        const updatedTasks = tasks.map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    comments: [...(t.comments || []), commentText]
                };
            }
            return t;
        });
        saveTasks(updatedTasks);
        setNewComment({ ...newComment, [taskId]: "" });
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;

        const newTask = {
            id: Math.max(...tasks.map(t => t.id), 0) + 1,
            title: newTaskTitle,
            description: newTaskDesc,
            assignedTo: '',
            deadline: newTaskDeadline,
            comments: []
        };

        saveTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskDeadline('');
    };

    const handleDeleteTask = (taskId) => {
        saveTasks(tasks.filter(t => t.id !== taskId));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No deadline';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getDeadlineStatus = (deadline) => {
        if (!deadline) return { color: '#999', text: 'No deadline' };
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return { color: '#ff4444', text: `Overdue by ${Math.abs(daysLeft)} days` };
        if (daysLeft === 0) return { color: '#ff9800', text: 'Due today' };
        if (daysLeft <= 3) return { color: '#ff9800', text: `Due in ${daysLeft} days` };
        return { color: '#28a745', text: `Due in ${daysLeft} days` };
    };

    if (loading) {
        return <div style={centerStyle}><Loader2 style={{animation: 'spin 1s linear infinite'}} /> Loading Board...</div>;
    }

    return (
        <div style={{ padding: '30px', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <div style={headerStyle}>
                <h2>Team Task Board</h2>
                <p style={{color: '#666', fontSize: '14px'}}>📌 Tasks saved locally in your browser</p>
            </div>

            {/* Add New Task Section */}
            <div style={addTaskStyle}>
                <h3 style={{marginTop: 0}}>Add New Task</h3>
                <input
                    type="text"
                    placeholder="Task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{...inputStyle, marginBottom: '10px'}}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <textarea
                    placeholder="Task description..."
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    style={{...inputStyle, marginBottom: '10px', minHeight: '60px', resize: 'vertical'}}
                />
                <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    style={{...inputStyle, marginBottom: '10px'}}
                />
                <button onClick={handleAddTask} style={addBtnStyle}>
                    <Plus size={16} /> Add Task
                </button>
            </div>

            {/* Tasks Grid */}
            <div style={gridStyle}>
                {tasks.length === 0 ? (
                    <div style={{...centerStyle, gridColumn: '1 / -1'}}>
                        No tasks yet. Create one above!
                    </div>
                ) : (
                    tasks.map(task => {
                        const deadlineStatus = getDeadlineStatus(task.deadline);
                        return (
                            <div key={task.id} style={cardStyle}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px'}}>
                                    <h3 style={{ margin: '0', color: '#333', flex: 1 }}>{task.title}</h3>
                                    <button 
                                        onClick={() => handleDeleteTask(task.id)}
                                        style={deleteBtn}
                                        title="Delete task"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>{task.description}</p>

                                {/* Deadline Section */}
                                <div style={{...metaStyle, marginBottom: '15px'}}>
                                    <Calendar size={16} />
                                    <span style={{fontWeight: '500'}}>Deadline:</span>
                                    <input
                                        type="date"
                                        value={task.deadline || ''}
                                        onChange={(e) => handleDeadlineChange(task.id, e.target.value)}
                                        style={{...selectStyle, flex: 1}}
                                    />
                                </div>

                                {/* Deadline Status */}
                                <div style={{
                                    backgroundColor: '#f0f0f0',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    marginBottom: '15px',
                                    fontSize: '0.85rem',
                                    color: deadlineStatus.color,
                                    fontWeight: '600'
                                }}>
                                    {formatDate(task.deadline)} • {deadlineStatus.text}
                                </div>

                                {/* Assignee Section */}
                                <div style={metaStyle}>
                                    <User size={16} />
                                    <span style={{fontWeight: '500'}}>Assignee:</span>
                                    <select
                                        value={task.assignedTo || ""}
                                        onChange={(e) => handleAssignChange(task.id, e.target.value)}
                                        style={selectStyle}
                                    >
                                        <option value="">Unassigned</option>
                                        <option value="Collince">Collince</option>
                                        <option value="Member 2">Member 2</option>
                                        <option value="Member 3">Member 3</option>
                                    </select>
                                </div>

                                {/* Comments Section */}
                                <div style={commentSection}>
                                    <h4 style={commentHeader}><MessageSquare size={14} /> Activity</h4>
                                    <div style={scrollBox}>
                                        {task.comments && task.comments.length > 0 ? (
                                            task.comments.map((msg, i) => (
                                                <p key={i} style={msgStyle}>{msg}</p>
                                            ))
                                        ) : (
                                            <p style={{fontSize: '0.8rem', color: '#999', textAlign: 'center'}}>No comments yet</p>
                                        )}
                                    </div>
                                    <div style={inputWrapper}>
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={newComment[task.id] || ""}
                                            style={commentInputStyle}
                                            onChange={(e) => setNewComment({...newComment, [task.id]: e.target.value})}
                                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment(task.id)}
                                        />
                                        <Send size={18} style={sendIcon} onClick={() => handlePostComment(task.id)} />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const headerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '30px', 
    borderBottom: '2px solid #eee', 
    paddingBottom: '10px' 
};
const addTaskStyle = {
    backgroundColor: 'white',
    border: '2px solid #007bff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px'
};
const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
    gap: '25px' 
};
const cardStyle = { 
    backgroundColor: 'white', 
    border: '1px solid #e1e4e8', 
    padding: '24px', 
    borderRadius: '16px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
};
const metaStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    fontSize: '0.85rem', 
    color: '#444', 
    marginBottom: '20px' 
};
const commentSection = { 
    background: '#f6f8fa', 
    padding: '15px', 
    borderRadius: '12px' 
};
const commentHeader = { 
    margin: '0 0 10px 0', 
    fontSize: '0.8rem', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px', 
    color: '#666', 
    textTransform: 'uppercase', 
    letterSpacing: '0.5px' 
};
const scrollBox = { 
    maxHeight: '120px', 
    overflowY: 'auto', 
    marginBottom: '10px',
    minHeight: '40px'
};
const msgStyle = { 
    fontSize: '0.8rem', 
    background: 'white', 
    padding: '10px', 
    marginBottom: '8px', 
    borderRadius: '8px', 
    borderLeft: '4px solid #007bff', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
};
const inputWrapper = { 
    position: 'relative', 
    display: 'flex', 
    alignItems: 'center' 
};
const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
};
const commentInputStyle = { 
    width: '100%', 
    padding: '10px 35px 10px 12px', 
    border: '1px solid #d1d5da', 
    borderRadius: '8px', 
    fontSize: '0.85rem',
    boxSizing: 'border-box'
};
const sendIcon = { 
    position: 'absolute', 
    right: '10px', 
    color: '#007bff', 
    cursor: 'pointer',
    transition: 'color 0.2s'
};
const selectStyle = { 
    padding: '5px', 
    borderRadius: '6px', 
    border: '1px solid #ddd', 
    cursor: 'pointer' 
};
const addBtnStyle = { 
    padding: '10px 20px', 
    borderRadius: '8px', 
    border: 'none', 
    background: '#007bff', 
    color: 'white', 
    fontWeight: '600', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};
const deleteBtn = {
    background: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
};
const centerStyle = { 
    display: 'flex', 
    height: '80vh', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column', 
    gap: '15px', 
    color: '#666' 
};

export default TaskList;
