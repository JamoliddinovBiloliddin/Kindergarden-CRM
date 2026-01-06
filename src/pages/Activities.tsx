import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBranchedData } from '@/hooks/useBranchedData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, Plus, Clock, BookOpen, Dumbbell, Palette, Users } from 'lucide-react';
import { Activity } from '@/data/mockData';
import { toast } from 'sonner';

const Activities: React.FC = () => {
  const { t, user } = useApp();
  const { activities, addActivity, groups, parents, teachers, students } = useBranchedData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'educational' as Activity['type'], groupId: '', scheduledTime: '', duration: '', description: '' });

  const isParent = user?.role === 'parent';
  const currentParent = isParent ? parents.find(p => p.email === user?.email) : null;
  const isTeacher = user?.role === 'teacher';
  const currentTeacher = isTeacher ? teachers.find(t => t.email === user?.email) : null;

  const typeConfig = { educational: { icon: BookOpen, label: t('educational') || "Ta'limiy", color: 'bg-primary/10 text-primary border-primary/20' }, physical: { icon: Dumbbell, label: t('physical') || 'Jismoniy', color: 'bg-success/10 text-success border-success/20' }, creative: { icon: Palette, label: t('creative') || 'Ijodiy', color: 'bg-secondary/10 text-secondary border-secondary/20' }, social: { icon: Users, label: t('social') || 'Ijtimoiy', color: 'bg-accent/10 text-accent border-accent/20' } };
  const getGroup = (id: string) => groups.find(g => g.id === id);

  // Filter groups available for selection (Teachers only see their assigned groups)
  const availableGroups = groups.filter(g => {
    if (isTeacher && currentTeacher) {
      return (currentTeacher.groupIds && currentTeacher.groupIds.includes(g.id)) || g.teacherId === currentTeacher.id;
    }
    return true; // Admin sees all
  });

  // Filter activities based on role
  const filteredActivities = activities.filter(a => {
    if (isParent && currentParent) {
      // Show activities for groups where parent has children
      const parentStudents = students.filter(s => currentParent.childrenIds.includes(s.id));
      const studentGroupIds = parentStudents.map(s => s.groupId);
      return studentGroupIds.includes(a.groupId);
    }
    if (isTeacher && currentTeacher) {
      // Show activities for assigned groups
      const isAssignedGroup = (currentTeacher.groupIds && currentTeacher.groupIds.includes(a.groupId)) ||
        groups.find(g => g.id === a.groupId)?.teacherId === currentTeacher.id;
      return isAssignedGroup;
    }
    return true; // Admin sees all
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.groupId || !formData.scheduledTime) {
      toast.error(t('fill_all_fields') || "Barcha maydonlarni to'ldiring");
      return;
    }
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      groupId: formData.groupId,
      scheduledTime: formData.scheduledTime,
      duration: parseInt(formData.duration) || 30,
      description: formData.description
    };
    addActivity(newActivity);
    toast.success(t('activity_added') || "Mashg'ulot qo'shildi");
    setIsModalOpen(false);
    setFormData({ name: '', type: 'educational', groupId: '', scheduledTime: '', duration: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('activities')}</h1>
          <p className="text-muted-foreground">{isParent ? (t('my_child_activities') || "Farzandim mashg'ulotlari") : (t('activities_schedule') || "Mashg'ulotlar jadvali")}</p>
        </div>
        {!isParent && (
          <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            {t('add_activity') || "Mashg'ulot qo'shish"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(typeConfig).map(([type, config]) => { const count = filteredActivities.filter(a => a.type === type).length; const Icon = config.icon; return (<GlassCard key={type} hover><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center"><Icon className="w-5 h-5 text-primary-foreground" /></div><div><p className="text-xl font-bold">{count}</p><p className="text-xs text-muted-foreground">{config.label}</p></div></div></GlassCard>); })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => {
            const config = typeConfig[activity.type] || { icon: BookOpen, label: activity.type, color: 'bg-muted text-muted-foreground border-border' };
            const Icon = config.icon;
            const group = getGroup(activity.groupId);
            return (
              <GlassCard key={activity.id} hover>
                <div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"><Icon className="w-6 h-6 text-primary-foreground" /></div><div><h3 className="font-semibold">{activity.name}</h3><p className="text-sm text-muted-foreground">{group?.name}</p></div></div><Badge variant="outline" className={config.color}>{config.label}</Badge></div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{activity.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border/50"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="w-4 h-4" /><span>{activity.scheduledTime}</span></div><span className="text-sm font-medium">{activity.duration} {t('minutes') || 'daqiqa'}</span></div>
              </GlassCard>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">{t('no_activities_found') || "Mashg'ulotlar topilmadi"}</div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border/50 max-w-lg"><DialogHeader><DialogTitle className="text-xl">{t('new_activity') || "Yangi mashg'ulot"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>{t('activity_name') || "Mashg'ulot nomi"}</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ertalabki mashqlar" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>{t('type') || 'Turi'}</Label><Select value={formData.type} onValueChange={(v: Activity['type']) => setFormData({ ...formData, type: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="educational">{t('educational') || "Ta'limiy"}</SelectItem><SelectItem value="physical">{t('physical') || 'Jismoniy'}</SelectItem><SelectItem value="creative">{t('creative') || 'Ijodiy'}</SelectItem><SelectItem value="social">{t('social') || 'Ijtimoiy'}</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>{t('group') || 'Guruh'}</Label><Select value={formData.groupId} onValueChange={(v) => setFormData({ ...formData, groupId: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('select') || "Tanlang"} /></SelectTrigger><SelectContent>{availableGroups.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}</SelectContent></Select></div></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>{t('time') || 'Vaqt'}</Label><Input type="time" value={formData.scheduledTime} onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-border/50" /></div><div className="space-y-2"><Label>{t('duration_min') || 'Davomiyligi (daqiqa)'}</Label><Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="30" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
            <div className="space-y-2"><Label>{t('description') || 'Tavsif'}</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder={t('about_activity') || "Mashg'ulot haqida..."} className="rounded-xl bg-muted/50 border-border/50 resize-none" rows={3} /></div>
            <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">{t('cancel')}</Button><Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl">{t('save')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activities;
