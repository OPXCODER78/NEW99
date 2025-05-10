import { useState } from 'react';
import { Menu, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  onMenuButtonClick: () => void;
}

const AdminHeader = ({ onMenuButtonClick }: AdminHeaderProps) => {
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={onMenuButtonClick}
            >
              <Menu size={24} />
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:block">
              <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <Bell size={20} />
            </button>
            
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <User size={16} />
                  </div>
                  <span className="ml-2 text-gray-700 hidden md:block">
                    {user?.email}
                  </span>
                  <ChevronDown size={16} className="ml-1 text-gray-400" />
                </button>
              </div>
              
              {userMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  onBlur={() => setUserMenuOpen(false)}
                >
                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    View Site
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;