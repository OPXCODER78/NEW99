import { Link, NavLink, useLocation } from 'react-router-dom';
import { Newspaper, LayoutDashboard, FileText, Folder as FolderTag, MessageSquare, Users, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AdminSidebar = ({ open, setOpen }: AdminSidebarProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const navLinks = [
    { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { name: 'Posts', to: '/admin/posts', icon: FileText },
    { name: 'Categories', to: '/admin/categories', icon: FolderTag },
    { name: 'Comments', to: '/admin/comments', icon: MessageSquare },
  ];
  
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-gray-800">
          <Link to="/" className="flex items-center text-white">
            <Newspaper className="h-8 w-8 text-primary-400" />
            <span className="ml-2 text-xl font-bold">Admin</span>
          </Link>
          <button 
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-300" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="px-2 py-4 space-y-1 border-t border-gray-700">
            <Link 
              to="/"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-300" />
              Settings
            </Link>
            <button 
              onClick={signOut}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-300" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;