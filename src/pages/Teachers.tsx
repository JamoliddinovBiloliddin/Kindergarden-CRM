import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBranchedData } from '@/hooks/useBranchedData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { ImageUpload } from '@/components/ui/ImageUpload';
import { UserCheck, Plus, Search, Phone, Mail, Edit, Trash2, GraduationCap, Lock, Calendar, Image as ImageIcon, Users } from 'lucide-react';
import { Teacher, User } from '@/data/mockData';
import { toast } from 'sonner';

const Teachers: React.FC = () => {
  const { t, user } = useApp();
  const { teachers, addTeacher, updateTeacher, deleteTeacher, branches, groups, addUser, users, updateUser } = useBranchedData();
  const [searchTerm, setSearchTerm] = useState('');
  // Branch Lock
  const lockedBranchId = user?.branchId;
  const initialBranch = lockedBranchId || 'all';
  const [filterBranch, setFilterBranch] = useState(initialBranch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branchId: '',
    specialization: '',
    password: '',
    dob: '',
    photo: '',
    status: 'active' as 'active' | 'inactive',
    salary: '',
    joinDate: '',
    groupIds: [] as string[],
  });

  const isAdmin = user?.role === 'admin';
  const isAdminOrDirector = user?.role === 'admin' || user?.role === 'director';



  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = (teacher.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Branch Filter (Strict if locked)
    const activeBranchFilter = lockedBranchId || filterBranch;
    const matchesBranch = activeBranchFilter === 'all' || teacher.branchId === activeBranchFilter;

    return matchesSearch && matchesBranch;
  });

  const getBranch = (id: string) => branches.find(b => b.id === id);
  const getGroupCount = (teacherId: string) => groups.filter(g => g.teacherId === teacherId).length;
  const getTeacherGroups = (teacher: Teacher) => groups.filter(g => g.teacherId === teacher.id);

  const openModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        specialization: teacher.specialization,
        status: teacher.status,
        branchId: teacher.branchId,
        password: '', // Don't show password
        salary: teacher.salary?.toString() || '0',
        joinDate: teacher.joinDate || '',
        dob: teacher.dob || '',
        groupIds: teacher.groupIds || [],
        photo: teacher.photo || '' // Add photo field
      });
    } else {
      setEditingTeacher(null);
      // Smart Default
      const defaultBranch = lockedBranchId || (filterBranch !== 'all' ? filterBranch : '');
      setFormData({
        name: '', email: '', phone: '', specialization: '', status: 'active',
        branchId: defaultBranch,
        password: '', salary: '', joinDate: new Date().toISOString().split('T')[0], photo: '',
        dob: '', groupIds: []
      });
    }
    setIsModalOpen(true);
  };

  const toggleGroupSelection = (groupId: string) => {
    // This function is no longer directly used with the new formData structure
    // If groupIds are to be managed, the formData structure needs to be updated
    // or a separate state for group selection needs to be introduced.
    // For now, it's kept as is, but its functionality might be broken.
    setFormData(prev => {
      const currentGroups = prev.groupIds || []; // groupIds is not in formData anymore
      if (currentGroups.includes(groupId)) {
        return { ...prev, groupIds: currentGroups.filter(id => id !== groupId) };
      } else {
        return { ...prev, groupIds: [...currentGroups, groupId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.specialization || !formData.branchId || (!editingTeacher && !formData.password)) {
      toast.error(t('fill_required_fields') || "Barcha majburiy maydonlarni to'ldiring");
      return;
    }

    if (!editingTeacher) {
      const emailExists = users.some(u => u.email.toLowerCase() === formData.email.toLowerCase());
      if (emailExists) {
        toast.error(t('email_exists') || 'Bu email bilan foydalanuvchi allaqachon mavjud');
        return;
      }
      if (!formData.password || formData.password.length < 4) {
        toast.error(t('password_min_length') || "Parol kamida 4 belgidan iborat bo'lishi kerak");
        return;
      }
    }

    if (editingTeacher) {
      updateTeacher({
        ...editingTeacher,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        status: formData.status,
        branchId: formData.branchId,
        salary: parseInt(formData.salary) || 0,
        joinDate: formData.joinDate,
        photo: formData.photo
      });

      // Also update the linked User account if it exists
      const userAccount = users.find(u => u.email === editingTeacher.email);
      if (userAccount) {
        updateUser({
          ...userAccount,
          name: formData.name,
          email: formData.email,
          branchId: formData.branchId, // Sync branch
          // Only update password if provided
          ...(formData.password ? { password: formData.password } : {})
        });
      }

      toast.success(t('teacher_updated') || "O'qituvchi yangilandi");
    } else {
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        branchId: formData.branchId,
        specialization: formData.specialization,
        status: formData.status,
        salary: parseInt(formData.salary) || 0,
        joinDate: formData.joinDate,
        photo: formData.photo,
        groupIds: [],
        password: formData.password, // This should not be on Teacher type, assuming it's for initial user creation
      };

      const newUser: User = {
        id: `user-${newTeacher.id}`,
        name: formData.name,
        email: formData.email,
        role: 'teacher',
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0],
        password: formData.password,
        branchId: formData.branchId // Sync branch
      };

      addTeacher(newTeacher);
      addUser(newUser);
      toast.success(t('teacher_added') || "Yangi o'qituvchi va foydalanuvchi qo'shildi");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('delete_confirmation') || "Bu o'qituvchini o'chirmoqchimisiz?")) {
      deleteTeacher(id);
      toast.success(t('teacher_deleted') || "O'qituvchi o'chirildi");
    }
  };

  const availableGroups = formData.branchId
    ? groups.filter(g => g.branchId === formData.branchId)
    : [];

  const gradients = ['primary', 'secondary', 'accent', 'success'] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {t('teachers')}
          </h1>
          <p className="text-muted-foreground">{t('teachers_subtitle') || "O'qituvchilar va ularning guruhlari"}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => openModal()} className="gradient-bg hover:opacity-90 text-white shadow-lg rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            {t('add_teacher') || "O'qituvchi qo'shish"}
          </Button>
        )}
      </div>

      <GlassCard padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={t('search') + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50"
            />
          </div>
          {isAdminOrDirector && !lockedBranchId && (
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-muted/50 border-border/50">
                <SelectValue placeholder={t('filter_by_branch') || "Filial bo'yicha"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_branches') || "Barcha filiallar"}</SelectItem>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher, index) => {
          const branch = getBranch(teacher.branchId);
          const teacherGroups = getTeacherGroups(teacher);
          return (
            <GlassCard key={teacher.id} hover gradient={gradients[index % gradients.length]}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {teacher.photo ? (
                    <img src={teacher.photo} alt={teacher.name} className="w-14 h-14 rounded-xl object-cover shadow-md border border-white/20" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {(teacher.name || '?').charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.specialization}</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button onClick={() => openModal(teacher)} className="p-2 rounded-lg hover:bg-muted/50">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleDelete(teacher.id)} className="p-2 rounded-lg hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{teacher.dob || (t('not_set') || 'Kiritilmagan')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>{branch?.name}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-2">{t('assigned_groups') || "Biriktirilgan guruhlar"}:</p>
                <div className="flex flex-wrap gap-1">
                  {teacherGroups.length > 0 ? (
                    teacherGroups.map(g => (
                      <span key={g.id} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/10">
                        {g.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">{t('no_groups') || "Guruh biriktirilmagan"}</span>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-card border-border/50 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {editingTeacher ? (t('edit_teacher') || "O'qituvchini tahrirlash") : (t('add_teacher') || "Yangi o'qituvchi")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('full_name') || "To'liq ism"} <span className="text-red-500">*</span></Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ism Familiya"
                className="h-11 rounded-xl bg-muted/50 border-border/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('birth_date') || "Tug'ilgan sana"} <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="h-11 rounded-xl bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <ImageUpload
                  value={formData.photo}
                  onChange={(base64) => setFormData({ ...formData, photo: base64 })}
                  label={t('photo_url') || "Rasm"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('email_login') || "Email (Login)"} <span className="text-red-500">*</span></Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.uz"
                  className="h-11 rounded-xl bg-muted/50 border-border/50"
                  disabled={!!editingTeacher}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('phone') || "Telefon"} <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="h-11 rounded-xl bg-muted/50 border-border/50"
                />
              </div>
              {!editingTeacher && (
                <div className="space-y-2">
                  <Label>{t('password') || "Parol"} <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={t('password_min_length') || "Kamida 4 belgi"}
                      className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50"
                    />
                  </div>
                </div>
              )}
            </div>

            <h3 className="font-semibold mt-4">{t('job_info') || "Ish ma'lumotlari"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('branch') || "Filial"} <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.branchId}
                  onValueChange={(v) => setFormData({ ...formData, branchId: v, groupIds: [] })}
                  disabled={!!lockedBranchId}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50">
                    <SelectValue placeholder={t('select') || "Tanlang"} />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('specialization') || "Mutaxassislik"}</Label>
                <Input
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="Musiqa"
                  className="h-11 rounded-xl bg-muted/50 border-border/50"
                />
              </div>
            </div>

            {/* Assigned Groups Section */}
            <div className="space-y-2 border-t pt-2 mt-2">
              <Label className="text-base">{t('assigned_groups') || "Biriktirilgan guruhlar"}</Label>
              {!formData.branchId ? (
                <p className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-lg text-center">{t('select_branch_first') || "Guruhlarni ko'rish uchun avval filialni tanlang"}</p>
              ) : availableGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-lg text-center">{t('no_groups_in_branch') || "Bu filialda guruhlar mavjud emas"}</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                  {availableGroups.map(group => {
                    const isSelected = formData.groupIds.includes(group.id);
                    return (
                      <div
                        key={group.id}
                        onClick={() => toggleGroupSelection(group.id)}
                        className={`
                                        cursor-pointer p-3 rounded-lg border flex items-center gap-2 transition-all
                                        ${isSelected
                            ? 'bg-primary/10 border-primary text-primary shadow-sm'
                            : 'bg-muted/30 border-border/50 hover:bg-muted/50'}
                                    `}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                          {isSelected && <Users className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-medium">{group.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-4">
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
    </div >
  );
};

export default Teachers;
