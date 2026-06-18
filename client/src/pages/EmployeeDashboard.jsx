import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle } from 'lucide-react';

const EmployeeDashboard = () => {
    const { api } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyTasks = async () => {
        try {
            const response = await api.get('/tasks/my-tasks');
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const updateStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/status/${taskId}`, { status: newStatus });
            fetchMyTasks(); 
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update task status');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-slate-400 animate-pulse text-lg">Loading your tasks...</div>;

    const getAvailableStatuses = (currentStatus) => {
        const flow = {
            'pending': ['in_progress'],
            'in_progress': ['completed'],
            'completed': [], 
            'approved': [],
            'rejected': ['in_progress']
        };
        return flow[currentStatus] || [];
    };

    return (
        <div className="dashboard-container">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">My Tasks</h1>
                    <p className="text-slate-400">Track and manage your assigned tasks</p>
                </div>
            </header>

            <div className="tasks-grid">
                {tasks.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-16 glass-card border-dashed">
                        <CheckCircle size={48} className="text-slate-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">You're all caught up!</h3>
                        <p className="text-slate-400">No tasks assigned to you right now.</p>
                    </div>
                ) : (
                    tasks.map(task => {
                        const nextStatuses = getAvailableStatuses(task.status);
                        return (
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
                                <p className="text-slate-400 text-sm mb-6 flex-1">{task.description}</p>
                                
                                <div className="flex justify-between items-center text-sm text-slate-400 pt-4 border-t border-white/10 mb-4">
                                    {task.deadline ? (
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                        </div>
                                    ) : (
                                        <span>No deadline</span>
                                    )}
                                </div>
                                
                                {nextStatuses.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {nextStatuses.map(status => (
                                            <button 
                                                key={status}
                                                className="btn-outline text-xs py-1.5 px-3"
                                                onClick={() => updateStatus(task.id, status)}
                                            >
                                                Mark as {status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;
