import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, Sun, Moon, Wheat, Home, BarChart3, Info, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('croppredict_theme');
    if (stored === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('croppredict_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('croppredict_theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/predict', label: 'Predict', icon: Wheat, protected: true },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, protected: true },
    { path: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border/50'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              CropPredict
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button asChild className="gap-2">
                  <Link to="/register">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => {
              if (link.protected && !isAuthenticated) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all',
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-border my-2" />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 transition-all"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-all"
                >
                  <LogIn className="h-5 w-5" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium bg-primary text-primary-foreground transition-all"
                >
                  <UserPlus className="h-5 w-5" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
