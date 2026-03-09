
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0b1d3a]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
          <Camera size={28} />
          <span className="text-xl font-bold">Premium Portfolio</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/gallery"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Gallery
          </Link>
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </Link>

          {!isAuthenticated ? (
            <Link to="/admin-login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Admin Login
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/admin">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-600 text-white hover:bg-[#1a3a5c]"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
