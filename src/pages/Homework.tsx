import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBranchedData } from '@/hooks/useBranchedData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClipboardList, Plus, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Homework } from '@/data/mockData';
import { toast } from 'sonner';

const HomeworkPage: React.FC = () => {
  const { t, user } = useApp();
  const { homeworks, addHomework, updateHomework, groups, teachers, parents, students } = useBranchedData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    groupId: '',
    title: '',
    description: '',
    dueDate: '',
    status: 'active' as Homework['status'],
  });

  const isTeacher = user?.role === 'teacher';
  const currentTeacher = isTeacher ? teachers.find(t => t.email === user?.email) : null;
  const isParent = user?.role === 'parent';
  const currentParent = isParent ? parents.find(p => p.email === user?.email) : null;

  const getGroup = (id: string) => groups.find(g => g.id === id);

  // Filter groups available for selection (Teachers only see their assigned groups)
  const availableGroups = groups.filter(g => {
    if (isTeacher && currentTeacher) {
      return (currentTeacher.groupIds && currentTeacher.groupIds.includes(g.id)) || g.teacherId === currentTeacher.id;
    }
    return true; // Admin sees all
  });

  // Filter homeworks based on role
  const filteredHomeworks = homeworks.filter(h => {
    if (isTeacher && currentTeacher) {
      // Show only homeworks for assigned groups
      const isAssignedGroup = (currentTeacher.groupIds && currentTeacher.groupIds.includes(h.groupId)) ||
        groups.find(g => g.id === h.groupId)?.teacherId === currentTeacher.id;
      return isAssignedGroup;
    }
    if (isParent && currentParent) {
      // Find parent's children
      const parentStudents = students.filter(s => currentParent.childrenIds.includes(s.id));
      const studentGroupIds = parentStudents.map(s => s.groupId);
      // Show homeworks for groups where parent has children
      return studentGroupIds.includes(h.groupId);
    }
    return true; // Admin sees all
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groupId || !formData.title || !formData.dueDate) {
      toast.error(t('fill_all_fields') || 'Barcha maydonlarni to\'ldiring');
      return;
    }

    const newHomework: Homework = {
      id: Date.now().toString(),
      groupId: formData.groupId,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      assignedDate: new Date().toISOString().split('T')[0],
      status: formData.status,
    };
    addHomework(newHomework);
    toast.success(t('homework_added') || 'Uy vazifasi qo\'shildi');
    setIsModalOpen(false);
    setFormData({ groupId: '', title: '', description: '', dueDate: '', status: 'active' });
  };

  const toggleStatus = (id: string) => {
    // Parents should not be able to toggle global status of homework. 
    // Maybe they can mark as done for their child? 
    // But data model 'Homework' status is global (active/completed). 
    // Usually 'completed' means teacher closed the assignment.
    // So parents should probably NOT toggle this.
    if (isParent) return;

    const homework = homeworks.find(h => h.id === id);
    if (homework) {
      updateHomework({ ...homework, status: homework.status === 'active' ? 'completed' : 'active' });
    }
  };

  const activeHomeworks = filteredHomeworks.filter(h => h.status === 'active');
  const completedHomeworks = filteredHomeworks.filter(h => h.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {t('homework')}
          </h1>
          <p className="text-muted-foreground">{isParent ? (t('my_child_homework') || "Farzandim uy vazifalari") : (t('homework') || "Uy vazifalari")}</p>
        </div>
        {!isParent && (
          <Button onClick={() => setIsModalOpen(true)} className="gradient-bg hover:opacity-90 text-white shadow-lg rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            {t('add_homework') || "Vazifa qo'shish"}
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard gradient="primary">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{activeHomeworks.length}</p>
              <p className="text-sm text-muted-foreground">{t('active_tasks') || 'Faol vazifalar'}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard gradient="success">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{completedHomeworks.length}</p>
              <p className="text-sm text-muted-foreground">{t('completed_tasks') || 'Bajarilgan'}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Active Homeworks */}
      <GlassCard>
        <h3 className="text-lg font-display font-semibold mb-4">{t('active_tasks') || 'Faol vazifalar'}</h3>
        <div className="space-y-3">
          {activeHomeworks.length > 0 ? (
            activeHomeworks.map((homework) => {
              const group = getGroup(homework.groupId);
              const isOverdue = new Date(homework.dueDate) < new Date();
              return (
                <div key={homework.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Only teachers/admins can toggle status */}
                    <button
                      onClick={() => toggleStatus(homework.id)}
                      disabled={isParent}
                      className={`w-6 h-6 rounded-full border-2 border-primary hover:bg-primary/20 transition-colors ${isParent ? 'cursor-default opacity-50' : ''}`}
                    />
                    <div>
                      <h4 className="font-medium">{homework.title}</h4>
                      <p className="text-sm text-muted-foreground">{group?.name} • {homework.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{homework.dueDate}</p>
                      <p className="text-xs text-muted-foreground">{t('due_date') || 'Muddat'}</p>
                    </div>
                    <Badge variant="outline" className={isOverdue ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-warning/10 text-warning border-warning/20'}>
                      {isOverdue ? (t('overdue') || 'Muddati o\'tgan') : (t('active') || 'Faol')}
                    </Badge>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('no_active_tasks') || "Faol vazifalar yo'q"}</p>
          )}
        </div>
      </GlassCard>

      {/* Completed Homeworks */}
      {completedHomeworks.length > 0 && (
        <GlassCard>
          <h3 className="text-lg font-display font-semibold mb-4">{t('completed_tasks') || 'Bajarilgan vazifalar'}</h3>
          <div className="space-y-3">
            {completedHomeworks.map((homework) => {
              const group = getGroup(homework.groupId);
              return (
                <div key={homework.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 opacity-60">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleStatus(homework.id)}
                      disabled={isParent}
                      className={`w-6 h-6 rounded-full bg-success flex items-center justify-center ${isParent ? 'cursor-default' : ''}`}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </button>
                    <div>
                      <h4 className="font-medium line-through">{homework.title}</h4>
                      <p className="text-sm text-muted-foreground">{group?.name}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    {t('completed') || 'Bajarildi'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-card border-border/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">{t('new_homework') || 'Yangi uy vazifasi'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('group') || 'Guruh'}</Label>
              <Select value={formData.groupId} onValueChange={(v) => setFormData({ ...formData, groupId: v })}>
                <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50">
                  <SelectValue placeholder={t('select') || "Tanlang"} />
                </SelectTrigger>
                <SelectContent>
                  {availableGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('title') || 'Vazifa nomi'}</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Raqamlarni o'rganish"
                className="h-11 rounded-xl bg-muted/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('description') || 'Tavsif'}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Vazifa haqida batafsil..."
                className="rounded-xl bg-muted/50 border-border/50 resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('due_date') || 'Muddat'}</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="h-11 rounded-xl bg-muted/50 border-border/50"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                {t('cancel')}
              </Button>
              <Button type="submit" className="gradient-bg hover:opacity-90 text-white rounded-xl">
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeworkPage;
