import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useData } from '@/hooks/useData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Users, Building2, Wallet, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SuperAdminDashboard: React.FC = () => {
    const { t } = useApp();
    const { users, branches, students } = useData();

    const directors = users.filter(u => u.role === 'director');
    const activeDirectors = directors.filter(u => u.status === 'active').length;
    const totalBranches = branches.length;
    const totalStudents = students.length;

    const stats = [
        {
            title: "Active CRMs (Directors)",
            value: directors.length,
            active: activeDirectors,
            icon: Building2,
            color: 'from-blue-500 to-indigo-600',
            trend: "+12% this month"
        },
        {
            title: "Total Branches",
            value: totalBranches,
            icon: Activity,
            color: 'from-purple-500 to-pink-600',
            trend: "+5% this month"
        },
        {
            title: "Total Students Served",
            value: totalStudents,
            icon: Users,
            color: 'from-emerald-500 to-teal-600',
            trend: "+8% this month"
        },
        {
            title: "Platform Revenue",
            value: "45M UZS",
            icon: Wallet,
            color: 'from-amber-500 to-orange-600',
            trend: "+15% this month"
        },
    ];

    // Mock data for Platform Growth
    const data = [
        { month: 'Jan', clients: 4 },
        { month: 'Feb', clients: 7 },
        { month: 'Mar', clients: 12 },
        { month: 'Apr', clients: 18 },
        { month: 'May', clients: 25 },
        { month: 'Jun', clients: 40 },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-display text-foreground mb-2">Super Admin Dashboard</h1>
                <p className="text-muted-foreground">Platform Overview & Management</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <GlassCard key={i} hover>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold font-display">{stat.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium">
                            <TrendingUp className="w-4 h-4" />
                            {stat.trend}
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard>
                    <h3 className="text-lg font-semibold mb-6">Platform Growth (New Clients)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                                />
                                <Area type="monotone" dataKey="clients" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorClients)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard gradient="accent">
                    <div className="flex flex-col h-full bg-white/5 p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-4 text-white">System Health</h3>
                        <div className="space-y-4 flex-1">
                            <div className="flex justify-between items-center text-white/90">
                                <span>Server Status</span>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">Operational</span>
                            </div>
                            <div className="flex justify-between items-center text-white/90">
                                <span>Database Load</span>
                                <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[30%]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-white/90">
                                <span>Storage Usage</span>
                                <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-400 w-[65%]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-sm text-white/60">Last backed up: 1 hour ago</p>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
