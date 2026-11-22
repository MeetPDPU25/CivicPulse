import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  PlusCircle, 
  ListOrdered, 
  LayoutDashboard, 
  LogOut, 
  User, 
  Menu, 
  X,
  FileCheck2,
  HardHat,
  Search
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3.5 group py-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-900/30 group-hover:scale-105 transition-all duration-200">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  CivicPulse
                </span>
                <span className="text-[10px] tracking-wider uppercase font-bold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/40 shadow-sm backdrop-blur-sm">
                  Gov Portal
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 hidden sm:block mt-0.5">
                Public Complaint &amp; Civic Issue Tracking
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {/* Citizen Navigation */}
                {user?.role === 'citizen' && (
                  <>
                    <Link 
                      to="/citizen/dashboard" 
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                      Dashboard
                    </Link>
                    <Link 
                      to="/citizen/submit" 
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      File Complaint
                    </Link>
                    <Link 
                      to="/citizen/complaints" 
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <ListOrdered className="w-4 h-4 text-amber-400" />
                      My Complaints
                    </Link>
                  </>
                )}

                {/* Admin Navigation */}
                {user?.role === 'admin' && (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                      Admin Analytics
                    </Link>
                    <Link 
                      to="/admin/complaints" 
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4 text-purple-400" />
                      Manage Complaints
                    </Link>
                  </>
                )}

                {/* Staff Navigation */}
                {user?.role === 'staff' && (
                  <Link 
                    to="/staff/dashboard" 
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <HardHat className="w-4 h-4 text-amber-400" />
                    Field Work Queue
                  </Link>
                )}
              </>
            ) : null}
          </nav>

          {/* Right Action Profile / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">{user?.name}</div>
                  <div className="text-[10px] capitalize text-blue-400 font-medium">
                    {user?.role} {user?.department_name ? `• ${user.department_name}` : ''}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 px-4 pt-2 pb-4 space-y-1 bg-slate-900">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'citizen' && (
                <>
                  <Link
                    to="/citizen/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/citizen/submit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
                  >
                    File Complaint
                  </Link>
                  <Link
                    to="/citizen/complaints"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
                  >
                    My Complaints
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
                  >
                    Admin Analytics
                  </Link>
                  <Link
                    to="/admin/complaints"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
                  >
                    Manage Complaints
                  </Link>
                </>
              )}
              {user?.role === 'staff' && (
                <Link
                  to="/staff/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
                >
                  Field Work Queue
                </Link>
              )}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center px-3">
                <span className="text-xs text-slate-400">{user?.name} ({user?.role})</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 font-semibold"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 rounded-md bg-slate-800 text-white font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
