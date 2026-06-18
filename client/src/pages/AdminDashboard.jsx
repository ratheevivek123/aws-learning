import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Calendar, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const { api } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        deadline: '',
        assigned_to: ''
    });

    const fetchData = async () => {
        try {
            const [tasksRes, employeesRes] = await Promise.all([
                api.get('/tasks/all'),
                api.get('/user/employees')
            ]);
            setTasks(tasksRes.data.tasks);
            setEmployees(employeesRes.data.employees);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks/create', newTask);
            setShowForm(false);
            setNewTask({ title: '', description: '', priority: 'medium', deadline: '', assigned_to: '' });
            fetchData();
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-slate-400 animate-pulse text-lg">Loading dashboard...</div>;

    return (
        <div className="dashboard-container">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Overview</h1>
                    <p className="text-slate-400">Manage all tasks and employees</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    <PlusCircle size={18} />
                    {showForm ? 'Cancel' : 'New Task'}
                </button>
            </header>

            {showForm && (
                <div className="glass-card p-8 mb-8 animate-fade-in-up">
                    <h2 className="text-xl font-semibold mb-6">Create New Task</h2>
                    <form onSubmit={handleCreateTask} className="space-y-6">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Title</label>
                            <input
                                type="text"
                                required
                                value={newTask.title}
                                onChange={e => setNewTask({...newTask, title: e.target.value})}
                                placeholder="Task title"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Description</label>
                            <textarea
                                value={newTask.description}
                                onChange={e => setNewTask({...newTask, description: e.target.value})}
                                placeholder="Task details..."
                                className="input-field"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Priority</label>
                                <select 
                                    value={newTask.priority}
                                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                                    className="input-field appearance-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Deadline</label>
                                <input
                                    type="date"
                                    value={newTask.deadline}
                                    onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Assign To</label>
                                <select 
                                    required
                                    value={newTask.assigned_to}
                                    onChange={e => setNewTask({...newTask, assigned_to: e.target.value})}
                                    className="input-field appearance-none"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">Create Task</button>
                    </form>
                </div>
            )}

            <div className="tasks-grid">
                {tasks.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-16 glass-card border-dashed">
                        <AlertCircle size={48} className="text-slate-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Tasks Found</h3>
                        <p className="text-slate-400">Get started by creating a new task.</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="glass-card p-6 flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 transition-all duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className={`badge badge-${task.status}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <span className={`w-3 h-3 rounded-full ${
                                    task.priority === 'low' ? 'bg-green-500' :
                                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} title={`Priority: ${task.priority}`}></span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                            <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{task.description}</p>
                            
                            <div className="flex justify-between items-center text-sm text-slate-400 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                                        {task.employee_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate max-w-[100px]">{task.employee_name}</span>
                                </div>
                                {task.deadline && (
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
