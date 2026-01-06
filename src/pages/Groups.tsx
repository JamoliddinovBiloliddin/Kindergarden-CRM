import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBranchedData } from '@/hooks/useBranchedData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Search, UserCheck, Calendar, Edit, Trash2, Lock } from 'lucide-react';
import { Group } from '@/data/mockData';
import { toast } from 'sonner';

const Groups: React.FC = () => {
  const { t, user } = useApp();
  const { groups, addGroup, updateGroup, deleteGroup, branches, teachers, students } = useBranchedData();
  const [searchTerm, setSearchTerm] = useState('');
  // Access Control logic
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const isAdminOrDirector = user?.role === 'admin' || user?.role === 'director';

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({ name: '', branchId: '', teacherId: '', ageRange: '' });

  // Branch Lock
  const lockedBranchId = user?.branchId;
  const initialBranch = lockedBranchId || 'all';

  const [filterBranch, setFilterBranch] = useState(initialBranch);

  // Get current teacher entity if role is teacher
  const currentTeacher = isTeacher ? teachers.find(t => t.email === user?.email) : null;

  const filteredGroups = groups.filter((g) => {
    // Teacher Constraint: Only show assigned groups
    if (isTeacher && currentTeacher) {
      const isAssigned = (currentTeacher.groupIds && currentTeacher.groupIds.includes(g.id)) || g.teacherId === currentTeacher.id;
      if (!isAssigned) return false;
    }

    const matchesSearch = (g.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Strict Branch Filter
    const activeBranchFilter = lockedBranchId || filterBranch;
    const matchesBranch = activeBranchFilter === 'all' || g.branchId === activeBranchFilter;

    return matchesSearch && matchesBranch;
  });

  const getBranch = (id: string) => branches.find(b => b.id === id);
  const getTeacher = (id: string) => teachers.find(t => t.id === id);
  const getStudentCount = (groupId: string) => students.filter(s => s.groupId === groupId).length;

  const openModal = (group?: Group) => {
    if (group) {
      setEditingGroup(group);
      setFormData({ name: group.name, branchId: group.branchId, teacherId: group.teacherId, ageRange: group.ageRange });
    } else {
      setEditingGroup(null);
      // Smart Default: If branch is locked or filtered, use it.
      const defaultBranch = lockedBranchId || (filterBranch !== 'all' ? filterBranch : '');
      setFormData({ name: '', branchId: defaultBranch, teacherId: '', ageRange: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.branchId || !formData.teacherId || !formData.ageRange) {
      toast.error(t('fill_required_fields') || "Barcha maydonlarni to'ldiring");
      return;
    }

    if (editingGroup) {
      updateGroup({
        ...editingGroup,
        name: formData.name,
        branchId: formData.branchId,
        teacherId: formData.teacherId,
        ageRange: formData.ageRange
      });
      toast.success(t('group_updated') || 'Guruh yangilandi');
    } else {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: formData.name,
        branchId: formData.branchId,
        teacherId: formData.teacherId,
        ageRange: formData.ageRange,
        studentsCount: 0
      };
      addGroup(newGroup);
      toast.success(t('group_added') || "Yangi guruh qo'shildi");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('delete_confirmation') || "Bu guruhni o'chirmoqchimisiz?")) {
      deleteGroup(id);
      toast.success(t('group_deleted') || "Guruh o'chirildi");
    }
  };

  const gradients = ['primary', 'secondary', 'accent', 'success', 'warning'] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('groups')}</h1>
          <p className="text-muted-foreground">{t('total')}: {filteredGroups.length}</p>
        </div>

        {isAdmin && (
          <Button onClick={() => openModal()} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            {t('add_group') || "Guruh qo'shish"}
          </Button>
        )}
      </div>

      <GlassCard padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input placeholder={t('search') + '...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50" /></div>
          {isAdminOrDirector && !lockedBranchId && (
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('filter_by_branch') || "Filial bo'yicha"} /></SelectTrigger>
              <SelectContent><SelectItem value="all">{t('all_branches') || "Barcha filiallar"}</SelectItem>{branches.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}</SelectContent>
            </Select>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group, i) => {
          const branch = getBranch(group.branchId);
          const teacher = getTeacher(group.teacherId);
          const studentCount = getStudentCount(group.id);
          return (
            <GlassCard key={group.id} hover gradient={gradients[i % gradients.length]}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"><Users className="w-6 h-6 text-primary-foreground" /></div>
                  <div><h3 className="font-semibold text-foreground">{group.name}</h3><p className="text-sm text-muted-foreground">{branch?.name}</p></div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button onClick={() => openModal(group)} className="p-2 rounded-lg hover:bg-muted/50"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => handleDelete(group.id)} className="p-2 rounded-lg hover:bg-destructive/10"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                )}
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">{teacher?.name || (t('not_assigned') || 'Tayinlanmagan')}</p></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">{t('age_range')}: {group.ageRange} {t('years_old')}</p></div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center"><p className="text-2xl font-bold">{studentCount}</p><p className="text-xs text-muted-foreground">{t('students') || "O'quvchilar"}</p></div>
            </GlassCard>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (<GlassCard className="text-center py-12"><Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">{t('no_data')}</h3></GlassCard>)}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border/50 max-w-lg"><DialogHeader><DialogTitle className="text-xl">{editingGroup ? (t('edit_group') || 'Guruhni tahrirlash') : (t('new_group') || 'Yangi guruh')}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('group_name')}</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Qaldirg'och" className="h-11 rounded-xl bg-muted/50 border-border/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('branch')}</Label>
                {/* Lock input if branch is locked or filtered */}
                <Select
                  value={formData.branchId}
                  onValueChange={(v) => setFormData({ ...formData, branchId: v })}
                  disabled={!!lockedBranchId}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('select_branch_first')} /></SelectTrigger>
                  <SelectContent>{branches.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('teacher')}</Label>
                <Select value={formData.teacherId} onValueChange={(v) => setFormData({ ...formData, teacherId: v })}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('select')} /></SelectTrigger>
                  <SelectContent>
                    {teachers
                      .filter(t => !formData.branchId || t.branchId === formData.branchId)
                      .map((t) => (<SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>{t('age_range') || "Yosh oralig'i"}</Label><Input value={formData.ageRange} onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })} placeholder="3-4" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">{t('cancel')}</Button><Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl">{t('save')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
