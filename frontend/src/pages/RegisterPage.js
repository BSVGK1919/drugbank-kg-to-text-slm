import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, ArrowRight, Check, Dna } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(name, email, password);
    
    if (result.success) {
      toast.success('Account created');
      navigate('/login');
    } else {
      setError(result.error);
      toast.error('Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-black" data-testid="register-page">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-violet-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop"
            alt="Molecular structure"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-md z-10">
          <div className="w-12 h-1 bg-white mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Join DrugKG Text AI
          </h2>
          <p className="text-violet-100 text-lg mb-8 leading-relaxed">
            Create your account to unlock pharmaceutical knowledge graph 
            transformation capabilities.
          </p>
          
          <ul className="space-y-4">
            {[
              'Save and organize generations',
              'Export research documentation',
              'Track processing analytics',
              'Access generation history'
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
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

          <h1 className="text-3xl font-black text-white mb-2">Create account</h1>
          <p className="text-neutral-400 mb-8">
            Start transforming knowledge graphs today
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-500/30 text-red-400 text-sm" data-testid="register-error">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-semibold">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="input-dark"
                data-testid="register-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-dark"
                data-testid="register-email-input"
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
                  minLength={6}
                  className="input-dark pr-10"
                  data-testid="register-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500">Minimum 6 characters</p>
            </div>

            <Button 
              type="submit" 
              className="btn-primary w-full" 
              disabled={loading}
              data-testid="register-submit-button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-neutral-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
