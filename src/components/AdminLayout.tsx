import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white/70 dark:bg-gray-800/80 shadow-lg transition-all duration-300 ease-in-out fixed h-full z-10 backdrop-blur-xl rounded-xl m-2 border border-white/30",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-primary/90 p-2 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Electra</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto bg-primary/90 p-2 rounded-lg">
              <Vote className="h-6 w-6 text-white" />
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex"
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
                <Avatar className={cn("h-10 w-10", collapsed ? "mx-auto" : "")}>
                  <AvatarImage src="/avatar-admin.png" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="mt-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <Avatar className={cn("h-10 w-10", collapsed ? "mx-auto" : "")}>
                  <AvatarImage src="/avatar-voter.png" alt="Voter" />
                  <AvatarFallback>VO</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="mt-2">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">Voter</p>
                  </div>
                )}
              </>
            )}
          </div>

          <nav>
            <ul className="space-y-2 mt-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full flex items-center justify-start py-2 px-4 rounded-xl transition-all duration-200 glass-tile",
                      collapsed ? "justify-center" : "",
                      window.location.pathname.includes(item.path)
                        ? "bg-white/60 dark:bg-primary/20 text-primary shadow-lg border border-primary/30 backdrop-blur-xl"
                        : "hover:bg-white/40 hover:shadow-md hover:border hover:border-primary/10"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <span className={cn(
                      "flex items-center",
                      collapsed ? "justify-center" : ""
                    )}>
                      {item.icon}
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full border-t dark:border-gray-700 p-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center justify-start py-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300",
              collapsed ? "justify-center" : ""
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="md:hidden fixed bottom-4 right-4 z-30 bg-primary text-white shadow-lg rounded-full h-12 w-12"
        >
          <List />
        </Button>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        collapsed ? "ml-20" : "ml-64"
      )}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
