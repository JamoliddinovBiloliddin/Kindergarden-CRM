import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBranchedData } from '@/hooks/useBranchedData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Users, Building2, Wallet, UserCheck, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const Dashboard: React.FC = () => {
  const { t, user } = useApp();
  const { students, groups, teachers, financialRecords, branches } = useBranchedData();

  // Calculate monthly finance data dynamically
  const getMonthlyFinanceData = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d;
    }).reverse();

    return last6Months.map(date => {
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const month = date.getMonth();

      const monthlyRecords = financialRecords.filter(r => {
        const rDate = new Date(r.date);
        return rDate.getMonth() === month && rDate.getFullYear() === year; // Simplified check
      });

      const revenue = monthlyRecords
        .filter(r => r.type === 'revenue')
        .reduce((sum, r) => sum + r.amount, 0);

      const expenses = monthlyRecords
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + r.amount, 0);

      return {
        month: monthKey,
        revenue,
        expenses
      };
    });
  };

  const monthlyFinanceData = getMonthlyFinanceData();

  // If no data, show some dummy data for visualization in demo
  const displayData = monthlyFinanceData.every(d => d.revenue === 0 && d.expenses === 0)
    ? [
      { month: 'Jan', revenue: 40000000, expenses: 24000000 },
      { month: 'Feb', revenue: 30000000, expenses: 13980000 },
      { month: 'Mar', revenue: 20000000, expenses: 9800000 },
      { month: 'Apr', revenue: 27800000, expenses: 3908000 },
      { month: 'May', revenue: 18900000, expenses: 4800000 },
      { month: 'Jun', revenue: 23900000, expenses: 3800000 },
    ]
    : monthlyFinanceData;

  const formatCurrency = (value: number) => new Intl.NumberFormat('uz-UZ').format(value) + " so'm";
  const formatShort = (value: number) => value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : (value / 1000).toFixed(0) + 'K';

  // Calculate generic stats
  const totalStudents = students.length;
  const totalGroups = groups.length;
  const totalStaff = teachers.length;

  const totalRevenue = financialRecords
    .filter(r => r.type === 'revenue')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = financialRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalProfit = totalRevenue - totalExpenses;


  // Calculate branch specific stats
  const branchesWithStats = branches.map(branch => {
    const branchStudents = students.filter(s => {
      const group = groups.find(g => g.id === s.groupId);
      return group?.branchId === branch.id;
    }).length;

    // Fallback: if student-group linking isn't fully set up, or if we want to use the direct count from groups
    // Actually, students are linked to groups, and groups to branches. 
    // Let's also count groups in this branch.
    const branchGroups = groups.filter(g => g.branchId === branch.id).length;

    return {
      ...branch,
      studentsCount: branchStudents, // Override the static count
      groupsCount: branchGroups      // Override the static count
    };
  });

  const stats = [
    { title: t('total_students'), value: totalStudents, icon: Users, color: 'from-primary to-primary/80' },
    { title: t('total_groups'), value: totalGroups, icon: Building2, color: 'from-secondary to-secondary/80' },
    { title: t('total_revenue'), value: formatShort(totalRevenue), icon: Wallet, color: 'from-emerald-500 to-teal-600' },
    { title: t('total_staff'), value: totalStaff, icon: UserCheck, color: 'from-accent to-accent/80' },
  ];

  // Teacher Dashboard Logic
  if (user?.role === 'teacher') {
    // Logic adapted from Groups.tsx for consistency
    const currentTeacher = teachers.find(t => t.email === user?.email);

    let teacherGroups = groups;

    if (currentTeacher) {
      teacherGroups = groups.filter(g => {
        const matchId = g.teacherId === user.id || g.teacherId === currentTeacher.id;
        const matchArray = currentTeacher.groupIds?.includes(g.id);
        return matchId || matchArray;
      });
    }

    const teacherStudents = students.filter(s => teacherGroups.some(g => g.id === s.groupId));

    const teacherStats = [
      {
        title: t('my_groups'),
        value: teacherGroups.length,
        icon: Building2,
        color: 'from-secondary to-secondary/80'
      },
      {
        title: t('students'),
        value: teacherStudents.length,
        icon: Users,
        color: 'from-primary to-primary/80'
      }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('dashboard')}</h1>
          <p className="text-muted-foreground">{t('welcome')}, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teacherStats.map((stat, i) => (
            <GlassCard key={i} hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('dashboard')}</h1>
        <p className="text-muted-foreground">{t('dashboard_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-6">{t('financial_report')}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatShort} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name={t('revenue')} />
                <Area type="monotone" dataKey="expenses" stroke="hsl(var(--secondary))" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" name={t('expenses')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard gradient="success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('revenue')}</p>
                <h3 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
                <div className="flex items-center gap-1 mt-2 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <ArrowUpRight className="w-7 h-7 text-white" />
              </div>
            </div>
          </GlassCard>
          <GlassCard gradient="warning">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('expenses')}</p>
                <h3 className="text-2xl font-bold">{formatCurrency(totalExpenses)}</h3>
                <div className="flex items-center gap-1 mt-2 text-warning">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+8.2%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg">
                <TrendingDown className="w-7 h-7 text-white" />
              </div>
            </div>
          </GlassCard>
          <GlassCard gradient="primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('profit')}</p>
                <h3 className="text-2xl font-bold">{formatCurrency(totalProfit)}</h3>
                <div className="flex items-center gap-1 mt-2 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+18.7%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Wallet className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-6">{t('branch_statistics')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branchesWithStats.map((branch, i) => (
            <GlassCard key={branch.id} hover gradient={i === 0 ? 'primary' : i === 1 ? 'secondary' : 'accent'} padding="md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-foreground">{branch.name}</h4>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">{branch.address}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{branch.studentsCount}</p>
                  <p className="text-xs text-muted-foreground">{t('students')}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{branch.groupsCount}</p>
                  <p className="text-xs text-muted-foreground">{t('groups')}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{t('capacity')}</span>
                  <span className="font-medium">{branch.studentsCount}/{branch.capacity}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${Math.min((branch.studentsCount / branch.capacity) * 100, 100)}%` }} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
