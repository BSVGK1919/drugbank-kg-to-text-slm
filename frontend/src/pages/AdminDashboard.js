import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getRecentGenerations, getAllUsers, getHealthStatus } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, FileText, Zap, Activity, Server, Database, CheckCircle2, XCircle, Loader2, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentGenerations, setRecentGenerations] = useState([]);
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      const [statsData, generationsData, usersData, healthData] = await Promise.all([
        getAdminStats(), getRecentGenerations(10), getAllUsers(), getHealthStatus()
      ]);
      setStats(statsData);
      setRecentGenerations(generationsData.generations || []);
      setUsers(usersData.users || []);
      setHealth(healthData);
    } catch (error) {
      console.error('getMyGenerations failed:', error.response?.status, error.response?.data);
      toast.error(error.response?.data?.detail || 'Failed to load');

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" data-testid="admin-dashboard">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container-app">
          {/* Header */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">Admin Control Center</h1>
                <p className="text-neutral-500">Platform analytics and monitoring</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up delay-100">
            {[
              { icon: Users, value: stats?.total_users || 0, label: 'Total Users', trend: '+12%' },
              { icon: FileText, value: stats?.total_generations || 0, label: 'Generations', trend: '+8%' },
              { icon: Activity, value: stats?.generations_today || 0, label: 'Today' },
              { icon: Zap, value: `${Math.round(stats?.avg_latency_ms || 0)}ms`, label: 'Avg Latency' }
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-violet-900/30 border border-violet-500/30 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  {stat.trend && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <TrendingUp className="w-3 h-3" />{stat.trend}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Generations */}
            <div className="lg:col-span-2 card-dark fade-up delay-200" data-testid="recent-generations-table">
              <div className="p-6 border-b border-neutral-800">
                <h2 className="text-lg font-bold text-white">Recent Generations</h2>
              </div>
              <div className="p-6">
                {recentGenerations.length === 0 ? (
                  <p className="text-center py-8 text-neutral-500">No data</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-neutral-800">
                          <TableHead className="text-neutral-400">User</TableHead>
                          <TableHead className="text-neutral-400">Input</TableHead>
                          <TableHead className="text-neutral-400">Latency</TableHead>
                          <TableHead className="text-neutral-400">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentGenerations.map((gen, i) => (
                          <TableRow key={gen.id || i} className="border-neutral-800">
                            <TableCell className="text-white font-medium">{gen.user_name || 'Anonymous'}</TableCell>
                            <TableCell className="max-w-[200px] truncate font-mono text-xs text-neutral-400">{gen.input_triples}...</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 bg-violet-900/30 text-violet-400 border border-violet-500/30 text-xs font-mono">
                                {gen.latency_ms}ms
                              </span>
                            </TableCell>
                            <TableCell className="text-neutral-500 text-sm">{new Date(gen.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 fade-up delay-300">
              {/* System Status */}
              <div className="card-dark" data-testid="system-status">
                <div className="p-6 border-b border-neutral-800">
                  <h2 className="text-lg font-bold text-white">System Status</h2>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { icon: Server, label: 'API', status: true, text: 'Online' },
                    { icon: Database, label: 'Database', status: health?.database === 'connected', text: health?.database === 'connected' ? 'Connected' : 'Error' },
                    { icon: Zap, label: 'Model', status: health?.hf_token_configured, text: health?.hf_token_configured ? 'Active' : 'Not Set' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-neutral-500" />
                        <span className="text-sm text-neutral-400">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status ? (
                          <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium text-emerald-400">{item.text}</span></>
                        ) : (
                          <><XCircle className="w-4 h-4 text-amber-400" /><span className="text-sm font-medium text-amber-400">{item.text}</span></>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Users */}
              <div className="card-dark" data-testid="users-list">
                <div className="p-6 border-b border-neutral-800">
                  <h2 className="text-lg font-bold text-white">Users</h2>
                </div>
                <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                  {users.slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center gap-3 p-3 hover:bg-neutral-800/50 transition-colors">
                      <div className={`w-9 h-9 flex items-center justify-center text-white text-sm font-semibold ${u.is_admin ? 'bg-violet-600' : 'bg-neutral-700'}`}>
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{u.email}</p>
                      </div>
                      {u.is_admin && <span className="px-2 py-0.5 bg-violet-600 text-white text-xs">Admin</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
