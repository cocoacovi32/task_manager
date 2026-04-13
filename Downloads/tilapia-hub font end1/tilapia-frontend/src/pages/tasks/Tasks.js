import { useEffect, useState } from "react";
import API from "../../services/api";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({});

    const fetchTasks = () => {
        API.get("tasks/").then(res => setTasks(res.data));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {
        await API.post("tasks/add/", newTask);
        fetchTasks();
    };

    return (
        <div className="p-6">
            <h2>Tasks</h2>

            <input placeholder="Title" onChange={e => setNewTask({...newTask, title:e.target.value})} />
            <input placeholder="Deadline" onChange={e => setNewTask({...newTask, deadline:e.target.value})} />
            <input placeholder="Priority" onChange={e => setNewTask({...newTask, priority:e.target.value})} />

            <button onClick={addTask}>Add Task</button>

            {tasks.map(task => (
                <div key={task.id} className="bg-white p-3 mt-2">
                    <h3>{task.title}</h3>
                    <p>{task.priority}</p>
                    <p>{task.deadline}</p>
                </div>
            ))}
        </div>
    );
}

export default Tasks;