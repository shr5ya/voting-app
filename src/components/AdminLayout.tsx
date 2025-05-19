import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Vote, BarChart2, Settings, 
  LogOut, ChevronRight, ChevronLeft, List 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = "Admin Dashboard", 
  subtitle = "Manage your elections and voting system."
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      path: '/dashboard' 
    },
    { 
      name: 'Elections', 
      icon: <Vote className="h-5 w-5" />, 
      path: '/elections'
    },
    { 
      name: 'Voters', 
      icon: <Users className="h-5 w-5" />, 
      path: '/voters'
    },
    { 
      name: 'Results', 
      icon: <BarChart2 className="h-5 w-5" />, 
      path: '/results/1'
    },
    { 
      name: 'Settings', 
      icon: <Settings className="h-5 w-5" />, 
      path: '/settings'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-subtle dark:bg-gradient-dark">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg transition-all duration-300 ease-in-out fixed h-screen z-10 border-r border-gray-100/50 dark:border-gray-800/50 shadow-sm",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100/70 dark:border-gray-800/70">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-md">
                <Vote className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Electra
              </span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto bg-primary p-2 rounded-md">
              <Vote className="h-5 w-5 text-white" />
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="py-4">
          <div className={cn(
            "px-4 mb-6",
            collapsed ? "text-center" : ""
          )}>
            {user?.role === 'admin' ? (
              <>
                <Avatar className={cn("h-10 w-10 ring-2 ring-primary/10 ring-offset-2 ring-offset-white dark:ring-offset-gray-900", collapsed ? "mx-auto" : "")}>
                  <AvatarImage src="/avatar-admin.png" alt="Admin" />
                  <AvatarFallback className="bg-primary text-white">AD</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="mt-2">
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <Avatar className={cn("h-10 w-10 ring-2 ring-primary/10 ring-offset-2 ring-offset-white dark:ring-offset-gray-900", collapsed ? "mx-auto" : "")}>
                  <AvatarImage src="/avatar-voter.png" alt="Voter" />
                  <AvatarFallback className="bg-primary text-white">VO</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="mt-2">
                    <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Voter</p>
                  </div>
                )}
              </>
            )}
          </div>

          <nav>
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = location.pathname.includes(item.path);
                return (
                  <li key={item.name}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full flex items-center justify-start py-2 px-3 rounded-md transition-colors",
                        collapsed ? "justify-center" : "",
                        isActive
                          ? "bg-primary/10 text-primary dark:bg-primary/20 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      <span className={cn(
                        "flex items-center",
                        collapsed ? "justify-center" : ""
                      )}>
                        {React.cloneElement(item.icon, { 
                          className: cn(
                            "h-5 w-5", 
                            isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                          )
                        })}
                        {!collapsed && <span className="ml-3">{item.name}</span>}
                      </span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full border-t border-gray-100/70 dark:border-gray-800/70 p-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center justify-start py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-red-600 dark:hover:text-red-400",
              collapsed ? "justify-center" : ""
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-red-500" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="md:hidden fixed bottom-4 right-4 z-30 bg-primary text-white shadow-md rounded-full h-10 w-10"
        >
          <List className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        collapsed ? "ml-20" : "ml-64"
      )}>
        {/* Header */}
        <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-100/50 dark:border-gray-800/50 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
