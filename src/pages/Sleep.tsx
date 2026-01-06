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
import { Bed, Plus, Moon, Clock, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { SleepRecord } from '@/data/mockData';
import { toast } from 'sonner';

const Sleep: React.FC = () => {
  const { t, user } = useApp();
  const { sleepRecords, addSleepRecord, students, parents, teachers, groups } = useBranchedData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', date: new Date().toISOString().split('T')[0], startTime: '13:00', endTime: '15:00', quality: 'good' as SleepRecord['quality'], notes: '' });

  const isParent = user?.role === 'parent';
  const currentParent = isParent ? parents.find(p => p.email === user?.email) : null;
  const isTeacher = user?.role === 'teacher';
  const currentTeacher = isTeacher ? teachers.find(t => t.email === user?.email) : null;

  const getStudent = (id: string) => students.find(s => s.id === id);
  const qualityConfig = { good: { icon: ThumbsUp, label: t('good') || 'Yaxshi', color: 'bg-success/10 text-success border-success/20' }, fair: { icon: Minus, label: t('fair') || "O'rtacha", color: 'bg-warning/10 text-warning border-warning/20' }, poor: { icon: ThumbsDown, label: t('poor') || 'Yomon', color: 'bg-destructive/10 text-destructive border-destructive/20' } };
  const calculateDuration = (start: string, end: string) => { const [startH, startM] = start.split(':').map(Number); const [endH, endM] = end.split(':').map(Number); const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM); const hours = Math.floor(totalMinutes / 60); const minutes = totalMinutes % 60; return `${hours} ${t('hours') || 'soat'} ${minutes > 0 ? `${minutes} ${t('minutes') || 'daqiqa'}` : ''}`; };

  // Filter students available for selection (Teachers only see their assigned students)
  const availableStudents = students.filter(s => {
    if (isTeacher && currentTeacher) {
      return currentTeacher.groupIds.includes(s.groupId);
    }
    return true; // Admin sees all (Parents don't select students usually, they just view)
  });

  // Filter sleep records based on role
  const filteredRecords = sleepRecords.filter(r => {
    if (isParent && currentParent) {
      return currentParent.childrenIds.includes(r.studentId);
    }
    if (isTeacher && currentTeacher) {
      const student = getStudent(r.studentId);
      return student && currentTeacher.groupIds.includes(student.groupId);
    }
    return true; // Admin sees all
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.date) {
      toast.error(t('fill_all_fields') || "Barcha maydonlarni to'ldiring");
      return;
    }
    const newRecord: SleepRecord = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      quality: formData.quality,
      notes: formData.notes || undefined
    };
    addSleepRecord(newRecord);
    toast.success(t('sleep_record_added') || "Uyqu yozuvi qo'shildi");
    setIsModalOpen(false);
    setFormData({ studentId: '', date: new Date().toISOString().split('T')[0], startTime: '13:00', endTime: '15:00', quality: 'good', notes: '' });
  };

  const todayRecords = filteredRecords.filter(r => r.date === new Date().toISOString().split('T')[0]);
  const goodSleep = filteredRecords.filter(r => r.quality === 'good').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('sleep')}</h1>
          <p className="text-muted-foreground">{isParent ? (t('my_child_sleep') || "Farzandim uyqusi") : (t('sleep_monitoring') || "Bolalar uyqusi monitoringi")}</p>
        </div>
        {!isParent && (
          <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            {t('add_record') || "Yozuv qo'shish"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard gradient="primary"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"><Bed className="w-6 h-6 text-primary-foreground" /></div><div><p className="text-2xl font-bold">{todayRecords.length}</p><p className="text-sm text-muted-foreground">{t('recorded_today') || 'Bugun yozilgan'}</p></div></div></GlassCard>
        <GlassCard gradient="success"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center"><ThumbsUp className="w-6 h-6 text-success" /></div><div><p className="text-2xl font-bold">{goodSleep}</p><p className="text-sm text-muted-foreground">{t('good_sleep') || 'Yaxshi uyqu'}</p></div></div></GlassCard>
        <GlassCard gradient="secondary"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center"><Moon className="w-6 h-6 text-secondary-foreground" /></div><div><p className="text-2xl font-bold">{filteredRecords.length > 0 ? Math.round((goodSleep / filteredRecords.length) * 100) : 0}%</p><p className="text-sm text-muted-foreground">{t('good_sleep_percentage') || 'Yaxshi uyqu %'}</p></div></div></GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">{t('sleep_records') || 'Uyqu yozuvlari'}</h3>
        <div className="space-y-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.slice().reverse().map((record) => {
              const student = getStudent(record.studentId);
              const config = qualityConfig[record.quality] || { icon: Minus, label: record.quality, color: 'bg-muted text-muted-foreground border-border' };
              const QualityIcon = config.icon;
              return (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                      <Bed className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{student?.name || "Noma'lum"}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{record.startTime} - {record.endTime}</span>
                        <span className="text-xs">({calculateDuration(record.startTime, record.endTime)})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:block">{record.date}</span>
                    <Badge variant="outline" className={config.color}>
                      <QualityIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Bed className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('no_records_yet') || "Hozircha yozuvlar yo'q"}</p>
            </div>
          )}
        </div>
      </GlassCard>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border/50 max-w-lg"><DialogHeader><DialogTitle className="text-xl">{t('new_sleep_record') || 'Uyqu yozuvi'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>{t('student') || "O'quvchi"}</Label><Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('select') || "Tanlang"} /></SelectTrigger><SelectContent>{availableStudents.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-2"><Label>{t('date') || 'Sana'}</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>{t('start_time') || 'Boshlanish vaqti'}</Label><Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-border/50" /></div><div className="space-y-2"><Label>{t('end_time') || 'Tugash vaqti'}</Label><Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
            <div className="space-y-2"><Label>{t('quality') || 'Sifati'}</Label><Select value={formData.quality} onValueChange={(v: SleepRecord['quality']) => setFormData({ ...formData, quality: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="good">{t('good') || 'Yaxshi'}</SelectItem><SelectItem value="fair">{t('fair') || "O'rtacha"}</SelectItem><SelectItem value="poor">{t('poor') || 'Yomon'}</SelectItem></SelectContent></Select></div>
            <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">{t('cancel')}</Button><Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl">{t('save')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sleep;
