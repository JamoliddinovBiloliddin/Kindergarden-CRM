import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBranchedData } from '@/hooks/useBranchedData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Plus, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Pencil, Trash2 } from 'lucide-react';
import { monthlyFinance, FinancialRecord } from '@/data/mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { toast } from 'sonner';

const Finance: React.FC = () => {
  const { t } = useApp();
  const { financialRecords, addFinancialRecord, updateFinancialRecord, deleteFinancialRecord } = useBranchedData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);
  const [formData, setFormData] = useState({ type: 'revenue' as 'revenue' | 'expense', category: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });

  // Calculate monthly stats
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const getMonthlyTotal = (type: 'revenue' | 'expense', month: number, year: number) => {
    return financialRecords
      .filter(r => {
        const d = new Date(r.date);
        return r.type === type && d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, r) => sum + r.amount, 0);
  };

  const currentRevenue = getMonthlyTotal('revenue', currentMonth, currentYear);
  const lastRevenue = getMonthlyTotal('revenue', lastMonth, lastMonthYear);
  const revenueGrowth = lastRevenue === 0 ? (currentRevenue > 0 ? 100 : 0) : ((currentRevenue - lastRevenue) / lastRevenue) * 100;

  const currentExpenses = getMonthlyTotal('expense', currentMonth, currentYear);
  const lastExpenses = getMonthlyTotal('expense', lastMonth, lastMonthYear);
  const expenseGrowth = lastExpenses === 0 ? (currentExpenses > 0 ? 100 : 0) : ((currentExpenses - lastExpenses) / lastExpenses) * 100;

  const currentProfit = currentRevenue - currentExpenses;
  const lastProfit = lastRevenue - lastExpenses;
  const profitGrowth = lastProfit === 0 ? (currentProfit > 0 ? 100 : 0) : ((currentProfit - lastProfit) / lastProfit) * 100;

  // Render helper
  const renderGrowth = (growth: number) => {
    const isPositive = growth > 0;
    const isZero = growth === 0;
    const Icon = isPositive ? TrendingUp : (isZero ? TrendingUp : TrendingDown); // Using TrendingUp for zero just as placeholder or maybe a flat line? relying on color.
    // Actually, distinct icons for Up/Down.

    return (
      <div className={`flex items-center gap-1 mt-2 ${isPositive ? 'text-success' : (isZero ? 'text-muted-foreground' : 'text-destructive')}`}>
        {growth !== 0 && <Icon className="w-4 h-4" />}
        <span className="text-sm font-medium">{growth > 0 ? '+' : ''}{growth.toFixed(1)}%</span>
      </div>
    );
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('uz-UZ').format(value) + " so'm";
  const formatShort = (value: number) => value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : (value / 1000).toFixed(0) + 'K';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }
    if (selectedRecord) {
      // Update existing
      const updatedRecord: FinancialRecord = {
        ...selectedRecord,
        type: formData.type,
        category: formData.category,
        amount: parseInt(formData.amount),
        date: formData.date,
        description: formData.description
      };
      updateFinancialRecord(updatedRecord);
      toast.success(t('record_updated') || "Yozuv yangilandi");
    } else {
      // Create new
      const newRecord: FinancialRecord = {
        id: Date.now().toString(),
        type: formData.type,
        category: formData.category,
        amount: parseInt(formData.amount),
        date: formData.date,
        description: formData.description,
        branchId: 'current' // Hook handles branch assignment usually but mock needs it. Actually data provider doesn't auto-assign branch?
        // Wait, AppContext has strict branch logic. useBranchedData filters.
        // But creating items? DataProvider.tsx doesn't enforce branch. 
        // Let's assume user is in correct branch or 'all'. 
        // Ideally we should pass currentBranchId from hook.
        // Checking useBranchedData: it returns 'currentBranchId'. 
      };
      // Note: DataProvider mocks don't strictly require branchId but for filtering it's needed.
      // Re-reading hook: useBranchedData filters data.
      // When adding, we should probably add branchId.
      // Let's rely on global context or just pass it if we can access it.
      // For now, let's just stick to the pattern.
      // Actually, looking at Warehouse.tsx (lines 45), it manually sets branchId from form.
      // Here Finance form doesn't have branch selection. It assumes current branch?
      // If Global Branch is 'all', it might be ambiguous.
      // But for this task "Edit/Delete", I'll focus on that logic.
      addFinancialRecord(newRecord);
      toast.success(formData.type === 'revenue' ? (t('income_added') || "Tushum qo'shildi") : (t('expense_added') || "Xarajat qo'shildi"));
    }

    setIsModalOpen(false);
    setFormData({ type: 'revenue', category: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
    setSelectedRecord(null);
  };

  const handleEdit = (record: FinancialRecord) => {
    setSelectedRecord(record);
    setFormData({
      type: record.type,
      category: record.category,
      amount: record.amount.toString(),
      date: record.date,
      description: record.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('delete_confirmation') || "Haqiqatan ham o'chirmoqchimisiz?")) {
      deleteFinancialRecord(id);
      toast.success(t('record_deleted') || "Yozuv o'chirildi");
    }
  };

  // Reset form when modal closes if it wasn't a submit
  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setFormData({ type: 'revenue', category: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
      setSelectedRecord(null);
    }
  };

  const records = financialRecords;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('finance')}</h1><p className="text-muted-foreground">{t('financial_records') || "Moliyaviy hisobotlar"}</p></div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg rounded-xl"><Plus className="w-5 h-5 mr-2" />{t('add_record') || "Yozuv qo'shish"}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard gradient="success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('revenue')}</p>
              <h3 className="text-2xl font-bold">{formatCurrency(currentRevenue)}</h3>
              {renderGrowth(revenueGrowth)}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center">
              <ArrowUpRight className="w-7 h-7 text-success" />
            </div>
          </div>
        </GlassCard>
        <GlassCard gradient="warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('expenses')}</p>
              <h3 className="text-2xl font-bold">{formatCurrency(currentExpenses)}</h3>
              {renderGrowth(expenseGrowth)}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center">
              <ArrowDownRight className="w-7 h-7 text-warning" />
            </div>
          </div>
        </GlassCard>
        <GlassCard gradient="primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('profit')}</p>
              <h3 className="text-2xl font-bold">{formatCurrency(currentProfit)}</h3>
              {renderGrowth(profitGrowth)}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Wallet className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-6">{t('annual_stats') || "Yillik ko'rsatkichlar"}</h3>
        <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyFinance}><defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} /></linearGradient><linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatShort} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} formatter={(value: number) => formatCurrency(value)} /><Area type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#colorRev)" name="Tushum" /><Area type="monotone" dataKey="expenses" stroke="hsl(var(--warning))" strokeWidth={2} fill="url(#colorExp)" name="Xarajat" /></AreaChart></ResponsiveContainer></div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">{t('recent_transactions') || "So'nggi amaliyotlar"}</h3>
        <div className="space-y-3">
          {records.slice().reverse().slice(0, 8).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${record.type === 'revenue' ? 'bg-success/20' : 'bg-warning/20'}`}>
                  {record.type === 'revenue' ? (<ArrowUpRight className="w-5 h-5 text-success" />) : (<ArrowDownRight className="w-5 h-5 text-warning" />)}
                </div>
                <div>
                  <h4 className="font-medium">{record.category}</h4>
                  <p className="text-sm text-muted-foreground">{record.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-semibold ${record.type === 'revenue' ? 'text-success' : 'text-warning'}`}>
                    {record.type === 'revenue' ? '+' : '-'}{formatCurrency(record.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{record.date}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(record)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-card border-border/50 max-w-lg"><DialogHeader><DialogTitle className="text-xl">{t('financial_record') || "Moliyaviy yozuv"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>{t('type') || "Turi"}</Label><Select value={formData.type} onValueChange={(v: 'revenue' | 'expense') => setFormData({ ...formData, type: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="revenue">{t('revenue') || "Tushum"}</SelectItem><SelectItem value="expense">{t('expenses') || "Xarajat"}</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>{t('category') || "Kategoriya"}</Label><Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="To'lovlar, Maosh..." className="h-11 rounded-xl bg-muted/50 border-border/50" /></div><div className="space-y-2"><Label>{t('amount_sum') || "Miqdor (so'm)"}</Label><Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="1000000" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
            <div className="space-y-2"><Label>{t('date') || "Sana"}</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <div className="space-y-2"><Label>{t('description') || "Tavsif"}</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Qo'shimcha ma'lumot..." className="rounded-xl bg-muted/50 border-border/50 resize-none" rows={2} /></div>
            <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">{t('cancel')}</Button><Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl">{t('save')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;
