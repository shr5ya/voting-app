import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Moon, Sun, User, LogOut, Settings, HelpCircle, Monitor, Menu, X, Home, BarChart2, Users, Award, CalendarDays, ShieldAlert } from 'lucide-react';
import { GlassContainer } from '@/components/ui/glass-components';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get the resolved theme (fixed "resolvedTheme" which wasn't defined)
  const resolvedTheme = theme;
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.includes(path)) return true;
    return false;
  };
  
  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl ${
  scrolled 
    ? 'bg-electra-navy/80 shadow-md' 
    : 'bg-electra-navy/60'
} py-4 px-4 md:px-6 mb-8 flex items-center justify-between border-b border-white/20 dark:border-white/5`}>

        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <div className="h-9 w-9 rounded-md bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mr-2 shadow-lg shadow-primary/20 dark:shadow-primary/30 transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-600 group-hover:to-primary">
              Electra
            </h1>
          </Link>
          
          {isAuthenticated && (
            <div className="hidden md:flex ml-8 space-x-2">
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                    : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Home className="h-4 w-4" />
                  Dashboard
                </span>
              </Link>
              <Link 
                to="/elections" 
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/elections')
                    ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                    : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Elections
                </span>
              </Link>
              {user?.role === 'admin' && (
                <>
                  <Link 
                    to="/candidates" 
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive('/candidates')
                        ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                        : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      Candidates
                    </span>
                  </Link>
                  <Link 
                    to="/voters" 
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive('/voters')
                        ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                        : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      Voters
                    </span>
                  </Link>
                  <a 
                    href="http://localhost:8080/admin/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      Admin Panel
                    </span>
                  </a>
                </>
              )}
              <Link 
                to="/results" 
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/results')
                    ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                    : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="h-4 w-4" />
                  Results
                </span>
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-9 h-9 transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/10"
              >
                {resolvedTheme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-1 border-white/20 dark:border-white/5">
              <DropdownMenuItem onClick={() => setTheme('light')} className="transition-colors duration-200">
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="transition-colors duration-200">
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="transition-colors duration-200">
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full px-3 gap-2 hover:shadow-md hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300">
                  <User className="h-4 w-4" />
                  <span className="font-medium hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 mt-1 p-2 border-white/20 dark:border-white/5">
                <div className="flex items-center justify-start gap-3 p-3 mb-1 border-b border-gray-200/50 dark:border-gray-700/30">
                  <div className="rounded-full h-10 w-10 bg-primary/20 flex items-center justify-center shadow-inner">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link to="/profile">
                  <DropdownMenuItem className="rounded-md mt-1 transition-colors duration-200 focus:bg-primary/10 dark:focus:bg-primary/20">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/settings">
                  <DropdownMenuItem className="rounded-md transition-colors duration-200 focus:bg-primary/10 dark:focus:bg-primary/20">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/help">
                  <DropdownMenuItem className="rounded-md transition-colors duration-200 focus:bg-primary/10 dark:focus:bg-primary/20">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="my-1 bg-gray-200/50 dark:bg-gray-700/30" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="rounded-md transition-colors duration-200 focus:bg-red-500/10 dark:focus:bg-red-500/20 text-red-500 dark:text-red-400 focus:text-red-600 dark:focus:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {location.pathname !== '/login' && location.pathname !== '/register' && (
                <Link to="/login">
                  <Button variant="ghost" className="border border-gray-200/50 dark:border-gray-700/30 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300">
                    Log In
                  </Button>
                </Link>
              )}
              {location.pathname !== '/register' && location.pathname !== '/login' && (
                <Link to="/register">
                  <Button variant="default" className="transition-all duration-300">Sign Up</Button>
                </Link>
              )}
            </>
          )}
          
          {/* Mobile menu toggle button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full w-9 h-9 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[72px] bottom-0 md:hidden z-40 p-4 overflow-y-auto bg-white/80 dark:bg-electra-navy/80 backdrop-blur-md">
          <div className="flex flex-col gap-2 py-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Home className="h-5 w-5" />
                    Dashboard
                  </span>
                </Link>
                <Link 
                  to="/elections" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive('/elections')
                      ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5" />
                    Elections
                  </span>
                </Link>
                {user?.role === 'admin' && (
                  <>
                    <Link 
                      to="/candidates" 
                      className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive('/candidates')
                          ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                          : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Award className="h-5 w-5" />
                        Candidates
                      </span>
                    </Link>
                    <Link 
                      to="/voters" 
                      className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive('/voters')
                          ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                          : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Users className="h-5 w-5" />
                        Voters
                      </span>
                    </Link>
                    <a 
                      href="http://localhost:8080/admin/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm"
                    >
                      <span className="flex items-center gap-3">
                        <ShieldAlert className="h-5 w-5" />
                        Admin Panel
                      </span>
                    </a>
                  </>
                )}
                <Link 
                  to="/results" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive('/results')
                      ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <BarChart2 className="h-5 w-5" />
                    Results
                  </span>
                </Link>
                <Link 
                  to="/profile" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive('/profile')
                      ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    Profile
                  </span>
                </Link>
                <Link 
                  to="/settings" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive('/settings')
                      ? 'bg-primary/15 dark:bg-primary/20 text-primary font-medium shadow-sm' 
                      : 'hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    Settings
                  </span>
                </Link>
                <div className="mt-4 border-t border-gray-200/50 dark:border-gray-700/30 pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200 text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                  >
                    <span className="flex items-center gap-3">
                      <LogOut className="h-5 w-5" />
                      Log out
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4 p-4">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-lg">Log In</Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button variant="default" className="w-full h-12 text-lg">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;