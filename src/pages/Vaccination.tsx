import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBranchedData } from '@/hooks/useBranchedData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Syringe, Plus, CheckCircle, Clock, AlertCircle, ShieldAlert } from 'lucide-react';
import { Vaccination } from '@/data/mockData';
import { toast } from 'sonner';

const VaccinationPage: React.FC = () => {
  const { t, user } = useApp();
  const { vaccinations, addVaccination, students, parents } = useBranchedData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', vaccineName: '', date: new Date().toISOString().split('T')[0], nextDoseDate: '', status: 'completed' as Vaccination['status'], notes: '' });

  const isParent = user?.role === 'parent';
  const currentParent = isParent ? parents.find(p => p.email === user?.email) : null;
  const isTeacher = user?.role === 'teacher';

  const getStudent = (id: string) => students.find(s => s.id === id);
  const statusConfig = { completed: { icon: CheckCircle, label: t('status_completed') || 'Bajarilgan', color: 'bg-success/10 text-success border-success/20' }, scheduled: { icon: Clock, label: t('status_scheduled') || 'Rejalashtirilgan', color: 'bg-warning/10 text-warning border-warning/20' }, overdue: { icon: AlertCircle, label: t('status_overdue') || 'Kechiktirilgan', color: 'bg-destructive/10 text-destructive border-destructive/20' } };

  // Filter vaccinations based on role
  const filteredVaccinations = vaccinations.filter(v => {
    if (isParent && currentParent) {
      // Show only if student belongs to parent
      return currentParent.childrenIds.includes(v.studentId);
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.vaccineName || !formData.date) {
      toast.error(t('fill_all_fields') || "Barcha maydonlarni to'ldiring");
      return;
    }
    const newVaccination: Vaccination = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      vaccineName: formData.vaccineName,
      date: formData.date,
      nextDoseDate: formData.nextDoseDate || undefined,
      status: formData.status,
      notes: formData.notes || undefined
    };
    addVaccination(newVaccination);
    toast.success(t('vaccination_added') || "Emlash qo'shildi");
    setIsModalOpen(false);
    setFormData({ studentId: '', vaccineName: '', date: new Date().toISOString().split('T')[0], nextDoseDate: '', status: 'completed', notes: '' });
  };

  if (isTeacher) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('access_denied') || 'Kirish taqiqlangan'}</h2>
        <p className="text-muted-foreground">{t('teacher_no_access') || "O'qituvchilar ushbu sahifaga kira olmaydi."}</p>
      </div>
    );
  }

  const completedCount = filteredVaccinations.filter(v => v.status === 'completed').length;
  const scheduledCount = filteredVaccinations.filter(v => v.status === 'scheduled').length;
  const overdueCount = filteredVaccinations.filter(v => v.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('vaccination')}</h1>
          <p className="text-muted-foreground">{isParent ? (t('my_child_vaccination') || "Farzandim emlash vaqtlar") : "Emlash jadvali va tarixi"}</p>
        </div>
        {!isParent && (
          <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            {t('add_vaccination') || "Emlash qo'shish"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard gradient="success"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-success" /></div><div><p className="text-2xl font-bold">{completedCount}</p><p className="text-sm text-muted-foreground">{t('status_completed') || 'Bajarilgan'}</p></div></div></GlassCard>
        <GlassCard gradient="warning"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center"><Clock className="w-6 h-6 text-warning" /></div><div><p className="text-2xl font-bold">{scheduledCount}</p><p className="text-sm text-muted-foreground">{t('status_scheduled') || 'Rejalashtirilgan'}</p></div></div></GlassCard>
        <GlassCard><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center"><AlertCircle className="w-6 h-6 text-destructive" /></div><div><p className="text-2xl font-bold">{overdueCount}</p><p className="text-sm text-muted-foreground">{t('status_overdue') || 'Kechiktirilgan'}</p></div></div></GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">{t('vaccination_list') || "Emlash ro'yxati"}</h3>
        <div className="space-y-3">
          {filteredVaccinations.length > 0 ? (
            filteredVaccinations.map((v) => {
              const student = getStudent(v.studentId);
              const config = statusConfig[v.status] || { icon: AlertCircle, label: v.status, color: 'bg-muted text-muted-foreground border-border' };
              const StatusIcon = config.icon;
              return (
                <div key={v.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                      <Syringe className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{v.vaccineName}</h4>
                      <p className="text-sm text-muted-foreground">{student?.name || "Noma'lum"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{v.date}</p>
                      {v.nextDoseDate && (<p className="text-xs text-muted-foreground">{t('next_dose') || 'Keyingi'}: {v.nextDoseDate}</p>)}
                    </div>
                    <Badge variant="outline" className={config.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">{t('no_data') || "Ma'lumot yo'q"}</div>
          )}
        </div>
      </GlassCard>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border/50 max-w-lg"><DialogHeader><DialogTitle className="text-xl">{t('new_vaccination') || 'Yangi emlash'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>{t('student') || "O'quvchi"}</Label><Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('select') || "Tanlang"} /></SelectTrigger><SelectContent>{students.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-2"><Label>{t('vaccine_name') || 'Emlash nomi'}</Label><Input value={formData.vaccineName} onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })} placeholder="BCG, Polio..." className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>{t('date') || 'Sana'}</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-border/50" /></div><div className="space-y-2"><Label>{t('next_dose_date') || 'Keyingi doza'}</Label><Input type="date" value={formData.nextDoseDate} onChange={(e) => setFormData({ ...formData, nextDoseDate: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
            <div className="space-y-2"><Label>{t('status') || 'Holat'}</Label><Select value={formData.status} onValueChange={(v: Vaccination['status']) => setFormData({ ...formData, status: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="completed">{t('status_completed') || 'Bajarilgan'}</SelectItem><SelectItem value="scheduled">{t('status_scheduled') || 'Rejalashtirilgan'}</SelectItem><SelectItem value="overdue">{t('status_overdue') || 'Kechiktirilgan'}</SelectItem></SelectContent></Select></div>
            <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">{t('cancel')}</Button><Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl">{t('save')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VaccinationPage;
