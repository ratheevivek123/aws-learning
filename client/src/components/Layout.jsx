import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <aside className="w-full md:w-64 glass-sidebar flex flex-col fixed md:relative z-10">
                <div className="p-8">
                    <h2 className="text-2xl font-bold tracking-tight">TaskHub<span className="text-indigo-500">.</span></h2>
                </div>
                
                <nav className="flex-1 px-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                    <Link 
                        to="/" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                            location.pathname === '/' 
                            ? 'bg-indigo-500/10 text-indigo-400' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                        <Link 
                            to="/" 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all"
                        >
                            <Users size={20} />
                            Employees
                        </Link>
                    )}
                </nav>

                <div className="p-6 border-t border-white/10 flex items-center gap-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 flex flex-col">
                        <span className="font-semibold text-sm truncate">{user?.name}</span>
                        <span className="text-xs text-slate-400 capitalize">{user?.role}</span>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
            
            <main className="flex-1 p-6 md:p-12 w-full pt-32 md:pt-12">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
