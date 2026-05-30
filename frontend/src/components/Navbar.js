import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Shield,
  Dna
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="nav-dark fixed top-0 left-0 right-0 z-50" data-testid="navbar">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            data-testid="navbar-logo"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
              <Dna className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">Drug</span>
              <span className="text-violet-400">KG Text</span>
              <span className="text-white"> AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/demo">
              <Button className="btn-primary" data-testid="nav-generate">
                Generate
              </Button>
            </Link>
            
            <a 
              href="https://go.drugbank.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              DrugBank
            </a>
            
            <Link to="/#about" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
              About
            </Link>

            {isAuthenticated && (
              <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors" data-testid="nav-dashboard">
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors" data-testid="nav-admin">
                Admin
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-white hover:bg-white/10"
                    data-testid="user-menu-trigger"
                  >
                    <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800">
                  <div className="px-3 py-2 border-b border-neutral-800">
                    <p className="font-semibold text-white">{user?.name}</p>
                    <p className="text-sm text-neutral-400">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer text-white hover:bg-neutral-800">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer text-white hover:bg-neutral-800">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-neutral-800" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer text-red-400 hover:bg-neutral-800"
                    data-testid="logout-button"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-white/80 hover:text-white hover:bg-white/10"
                  data-testid="nav-login"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-800">
            <div className="flex flex-col gap-2">
              <Link to="/demo" className="px-4 py-3 text-white bg-violet-600" onClick={() => setMobileMenuOpen(false)}>
                Generate
              </Link>
              <a href="https://go.drugbank.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-3 text-white/80">
                DrugBank
              </a>
              <Link to="/#about" className="px-4 py-3 text-white/80" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="px-4 py-3 text-white" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="px-4 py-3 text-white" onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <div className="border-t border-neutral-800 mt-2 pt-4 px-4">
                {isAuthenticated ? (
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full py-3 text-left text-red-400">
                    Logout
                  </button>
                ) : (
                  <Link to="/login" className="block py-3 text-center text-white border border-neutral-700" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
