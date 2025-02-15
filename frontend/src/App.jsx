// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { AddTask, GetTasks, ToggleTask, DeleteTask } from "../wailsjs/go/main/App";
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const result = await GetTasks();
            setTasks(result || []);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const task = {
                title: newTask,
                done: false,
                created_at: new Date().toISOString(),
                priority: 1
            };
            
            await AddTask(task);
            setNewTask("");
            await loadTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleToggle = async (id) => {
        try {
            await ToggleTask(id);
            await loadTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await DeleteTask(id);
            await loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="container">
            <h1>Todo List</h1>
            
            <form onSubmit={handleSubmit} className="task-form">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter new task"
                    className="task-input"
                />
                <button type="submit" className="add-button">Add Task</button>
            </form>

            <div className="task-list">
                {tasks.map((task) => (
                    <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                        <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggle(task.id)}
                        />
                        <span>{task.title}</span>
                        <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;