import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Newspaper, Search, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Newspaper className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ModernBlog</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive 
                    ? 'border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                }
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/category/technology" 
                className={({ isActive }) => 
                  isActive 
                    ? 'border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                }
              >
                Technology
              </NavLink>
              <NavLink 
                to="/category/lifestyle" 
                className={({ isActive }) => 
                  isActive 
                    ? 'border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                }
              >
                Lifestyle
              </NavLink>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1 pl-3 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <button type="submit" className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600">
                <Search size={16} />
              </button>
            </form>
            
            {user ? (
              <div className="ml-3 relative">
                <div className="flex space-x-2">
                  {userRole === 'admin' && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">Dashboard</Button>
                    </Link>
                  )}
                  <Link to="/user/profile">
                    <Button variant="ghost" size="sm" className="flex items-center">
                      <User size={18} className="mr-1" />
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" size="sm">Sign Out</Button>
                </div>
              </div>
            ) : (
              <div className="ml-3 flex space-x-2">
                <Link to="/auth/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-primary-500 text-base font-medium text-primary-700 bg-primary-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/category/technology"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Technology
            </Link>
            <Link 
              to="/category/lifestyle"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Lifestyle
            </Link>
            
            <form onSubmit={handleSearch} className="px-4 pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-3 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-4 space-y-2">
                {userRole === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="block text-base font-medium text-gray-500 hover:text-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link 
                  to="/user/profile" 
                  className="block text-base font-medium text-gray-500 hover:text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-base font-medium text-gray-500 hover:text-gray-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-4 flex flex-col space-y-2">
                <Link 
                  to="/auth/login" 
                  className="block text-center py-2 px-4 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth/register" 
                  className="block text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;