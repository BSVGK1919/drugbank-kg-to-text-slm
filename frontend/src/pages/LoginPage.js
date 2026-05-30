import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, ArrowRight, Dna } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } else {
      setError(result.error);
      toast.error('Authentication failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-black" data-testid="login-page">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center">
              <Dna className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span className="text-white">Drug</span>
              <span className="text-violet-400">KG Text</span>
              <span className="text-white"> AI</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2">Sign in</h1>
          <p className="text-neutral-400 mb-8">
            Access your research library and saved generations
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-500/30 text-red-400 text-sm" data-testid="login-error">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-dark"
                data-testid="login-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-dark pr-10"
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="btn-primary w-full" 
              disabled={loading}
              data-testid="login-submit-button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-neutral-400 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-neutral-950 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1644088379091-d574269d422f?w=1200&h=800&fit=crop"
            alt="Knowledge graph"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="relative max-w-md z-10">
          <div className="accent-line" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Pharmaceutical Knowledge Intelligence
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Transform complex drug relationship data into actionable clinical insights 
            with enterprise-grade natural language processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
