import React, { useState, useEffect } from 'react';
import { AddTask, GetTasks, ToggleTask, DeleteTask } from "../wailsjs/go/main/App";
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [dueTime, setDueTime] = useState("");
    const [priority, setPriority] = useState(1);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const result = await GetTasks();
            setTasks(result || []);
        } catch (error) {
            console.error('Error loading tasks:', error);
            setError('Failed to load tasks');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) {
            setError("Task cannot be empty");
            return;
        }

        try {
            let dueDatetime = null;
            if (dueDate) {
                dueDatetime = dueTime 
                    ? new Date(`${dueDate}T${dueTime}:00`).toISOString()
                    : new Date(`${dueDate}T00:00:00`).toISOString();
            }

            const task = {
                title: newTask,
                done: false,
                created_at: new Date().toISOString(),
                due_date: dueDatetime,
                priority: parseInt(priority)
            };
            
            await AddTask(task);
            setNewTask("");
            setDueDate("");
            setDueTime("");
            setPriority(1);
            setError("");
            await loadTasks();
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task');
        }
    };

    const handleToggle = async (id) => {
        try {
            await ToggleTask(id);
            await loadTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
            setError('Failed to update task');
        }
    };

    const confirmDelete = (task) => {
        setTaskToDelete(task);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        if (!taskToDelete) return;
        
        try {
            await DeleteTask(taskToDelete.id);
            setShowDeleteConfirm(false);
            setTaskToDelete(null);
            await loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Failed to delete task');
        }
    };

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString();
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 3: return 'priority-high';
            case 2: return 'priority-medium';
            case 1: return 'priority-low';
            default: return '';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 3: return 'High';
            case 2: return 'Medium';
            case 1: return 'Low';
            default: return 'Unknown';
        }
    };

    const activeTasks = tasks.filter(task => !task.done);
    const completedTasks = tasks.filter(task => task.done);

    return (
        <div className="container">
            <h1>Todo List</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="task-form">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter new task"
                    className="task-input"
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="date-input"
                />
                <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="time-input"
                />
                <select 
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="priority-select"
                >
                    <option value={1}>Low Priority</option>
                    <option value={2}>Medium Priority</option>
                    <option value={3}>High Priority</option>
                </select>
                <button type="submit" className="add-button">Add Task</button>
            </form>

            <div className="tasks-section">
                <h2>Active Tasks</h2>
                <div className="task-list">
                    {activeTasks.map((task) => (
                        <div key={task.id} className={`task-item ${getPriorityClass(task.priority)}`}>
                            <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => handleToggle(task.id)}
                                className="task-checkbox"
                            />
                            <div className="task-content">
                                <span className="task-title">{task.title}</span>
                                {task.due_date && (
                                    <span className="task-due-date">
                                        Due: {formatDateTime(task.due_date)}
                                    </span>
                                )}
                                <span className="task-priority">
                                    {getPriorityLabel(task.priority)}
                                </span>
                            </div>
                            <button 
                                onClick={() => confirmDelete(task)}
                                className="delete-button"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {completedTasks.length > 0 && (
                <div className="tasks-section">
                    <h2>Completed Tasks</h2>
                    <div className="task-list">
                        {completedTasks.map((task) => (
                            <div key={task.id} className="task-item completed">
                                <input
                                    type="checkbox"
                                    checked={task.done}
                                    onChange={() => handleToggle(task.id)}
                                    className="task-checkbox"
                                />
                                <div className="task-content">
                                    <span className="task-title">{task.title}</span>
                                    {task.due_date && (
                                        <span className="task-due-date">
                                            Due: {formatDateTime(task.due_date)}
                                        </span>
                                    )}
                                    <span className="task-priority">
                                        {getPriorityLabel(task.priority)}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => confirmDelete(task)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Delete Task</h3>
                        <p>Are you sure you want to delete this task?</p>
                        <p className="modal-task-title">{taskToDelete?.title}</p>
                        <div className="modal-buttons">
                            <button 
                                onClick={() => setShowDeleteConfirm(false)}
                                className="modal-button cancel"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="modal-button delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;