import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
                            <Home className="w-6 h-6 mr-2" />
                            HostelApp
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-700 font-medium hidden sm:block">
                                    Hello, {user.name} ({user.role})
                                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-1" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
