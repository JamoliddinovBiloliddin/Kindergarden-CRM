import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBranchedData } from '@/hooks/useBranchedData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { GraduationCap, Plus, Search, Edit, Trash2, User, Phone, Mail, Lock } from 'lucide-react';
import { Student, Parent, User as UserType } from '@/data/mockData';
import { toast } from 'sonner';

const Students: React.FC = () => {
  const { t, user } = useApp();
  const { students, addStudent, updateStudent, deleteStudent, groups, branches, addParent, updateParent, addUser, users, teachers, parents } = useBranchedData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    groupId: '',
    status: 'active' as 'active' | 'inactive',
    // Parent Data (for new students)
    // Parent Data (for new students)
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentPassword: '',
    photo: ''
  });

  // Access Control
  const isParent = user?.role === 'parent';
  const isTeacher = user?.role === 'teacher';
  const isDirector = user?.role === 'director';
  const isAdmin = user?.role === 'admin';

  // Branch Lock (for Branch Managers)
  const lockedBranchId = user?.branchId; // If user has branchId, they are locked to it

  const [filterBranch, setFilterBranch] = useState(lockedBranchId || 'all');

  const currentTeacher = isTeacher ? teachers.find(t => t.email === user?.email) : null;
  const currentParent = isParent ? parents.find(p => p.email === user?.email) : null;

  const filteredStudents = students.filter((s) => {
    // 1. Parent Restriction: Show ONLY their children
    if (isParent && currentParent) {
      const isChild = (currentParent.childrenIds && currentParent.childrenIds.includes(s.id)) || s.parentId === currentParent.id;
      if (!isChild) return false;
    }

    // 2. Teacher Restriction: Show ONLY students in assigned groups
    if (isTeacher && currentTeacher) {
      const assignedGroupIds = currentTeacher.groupIds || [];
      const legacyGroupIds = groups.filter(g => g.teacherId === currentTeacher.id).map(g => g.id);
      const allTeacherGroupIds = [...new Set([...assignedGroupIds, ...legacyGroupIds])];

      if (!allTeacherGroupIds.includes(s.groupId)) return false;
    }

    // 3. Branch Restriction (Filter)
    // If lockedBranchId exists, always enforce it. Otherwise iterate based on filter.
    const effectiveBranchFilter = lockedBranchId || filterBranch;
    if (effectiveBranchFilter !== 'all' && s.branchId !== effectiveBranchFilter) {
      return false;
    }

    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'all' || s.groupId === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const getGroup = (id: string) => groups.find(g => g.id === id);
  const getBranch = (id: string) => branches.find(b => b.id === id);

  const openModal = (student?: Student) => {
    if (student) {
      const studentParent = parents.find(p => p.id === student.parentId);
      setEditingStudent(student);
      setFormData({
        name: student.name,
        age: student.age.toString(),
        groupId: student.groupId,
        status: student.status,
        parentName: studentParent?.name || '',
        parentPhone: studentParent?.phone || '',
        parentEmail: studentParent?.email || '',
        parentPassword: '', // Don't show password for security, only update if changed
        photo: student.photo || ''
      });
    } else {
      setEditingStudent(null);
      // Smart Default: If branch filtered (or locked), use that branch to reset form?
      // Actually, we need to pick a group. Groups are branch-dependent.
      setFormData({ name: '', age: '', groupId: '', status: 'active', parentName: '', parentPhone: '', parentEmail: '', parentPassword: '', photo: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.groupId) {
      toast.error(t('fill_all_fields') || "Barcha maydonlarni to'ldiring");
      return;
    }

    const group = groups.find(g => g.id === formData.groupId);
    // CRITICAL: Trust the group's branch. Groups are strict children of branches.
    const branchId = group?.branchId || lockedBranchId || '1';

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        name: formData.name,
        age: parseInt(formData.age),
        groupId: formData.groupId,
        status: formData.status,
        branchId: branchId,
        photo: formData.photo
      });

      // Update Parent Info if changed
      if (editingStudent.parentId) {
        const existingParent = parents.find(p => p.id === editingStudent.parentId);
        if (existingParent) {
          updateParent({
            ...existingParent,
            name: formData.parentName,
            phone: formData.parentPhone,
            email: formData.parentEmail,
            // Only update password if provided
            ...(formData.parentPassword ? { password: formData.parentPassword } : {})
          });
        }
      }

      toast.success(t('student_updated') || "O'quvchi yangilandi");
    } else {
      // Logic for adding new student AND parent
      if (!formData.parentName || !formData.parentPhone || !formData.parentEmail || !formData.parentPassword) {
        toast.error(t('fill_parent_info') || "Ota-ona ma'lumotlarini ham to'ldiring");
        return;
      }

      // Check if email exists
      if (users.some(u => u.email.toLowerCase() === formData.parentEmail.toLowerCase())) {
        toast.error(t('email_exists') || "Bu email bilan foydalanuvchi mavjud");
        return;
      }
      if (formData.parentPassword.length < 4) {
        toast.error(t('password_min_length') || "Parol kamida 4 belgidan iborat bo'lishi kerak");
        return;
      }

      const newParentId = `parent-${Date.now()}`;

      const newParent: Parent = {
        id: newParentId,
        name: formData.parentName,
        phone: formData.parentPhone,
        email: formData.parentEmail,
        password: formData.parentPassword,
        role: 'parent',
        address: '',
        childrenIds: []
      };

      const newStudent: Student = {
        id: `student-${Date.now()}`,
        name: formData.name,
        age: parseInt(formData.age),
        groupId: formData.groupId,
        branchId: branchId,
        parentId: newParentId,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: formData.status,
        photo: formData.photo
      };

      // Link child to parent
      newParent.childrenIds = [newStudent.id];

      const newUser: UserType = {
        id: `user-${newParentId}`,
        name: formData.parentName,
        email: formData.parentEmail,
        role: 'parent',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        password: formData.parentPassword,
        branchId: branchId // Assign branchId to Parent User to ensure visibility in filtered Users list
      };

      addParent(newParent);
      addUser(newUser);
      addStudent(newStudent);

      toast.success(t('student_parent_created') || "Yangi o'quvchi va ota-ona hisobi yaratildi");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('delete_confirmation') || "Bu o'quvchini o'chirmoqchimisiz?")) {
      deleteStudent(id);
      toast.success(t('student_deleted') || "O'quvchi o'chirildi");
    }
  };

  const title = isParent ? (t('my_children') || 'Farzandlarim') : (t('students') || "O'quvchilar");

  // Parent View: Big Card(s)
  if (isParent) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h1>

        {filteredStudents.length === 0 ? (
          <GlassCard className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('no_data')}</h3>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => {
              const group = getGroup(student.groupId);
              const branch = getBranch(student.branchId);

              return (
                <GlassCard key={student.id} className="p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-primary/20">
                  {/* Decorative Background */}
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
                  <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl group-hover:bg-secondary/30 transition-all duration-500" />

                  <div className="relative flex flex-col items-center text-center">
                    {/* Avatar with Ring */}
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary to-secondary mb-6 shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden relative border-4 border-background">
                        {student.photo ? (
                          <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-16 h-16 text-muted-foreground/50" />
                        )}
                      </div>
                    </div>

                    {/* Name & Age */}
                    <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{student.name}</h2>
                    <p className="text-lg text-muted-foreground mb-8 font-medium bg-muted/30 px-4 py-1 rounded-full border border-border/50">
                      {student.age} {t('years_old') || 'yosh'}
                    </p>

                    {/* Info Grid */}
                    <div className="w-full grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center border border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">{t('group')}</span>
                        <span className="text-lg font-bold text-foreground">{group?.name || '-'}</span>
                      </div>
                      <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center border border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-semibold">{t('branch')}</span>
                        <span className="text-lg font-bold text-foreground">{branch?.name || '-'}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant={student.status === 'active' ? 'default' : 'secondary'}
                      className={`px-8 py-2.5 text-base font-medium rounded-full shadow-lg transition-all ${student.status === 'active'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/20'
                        : 'bg-muted text-muted-foreground'
                        }`}
                    >
                      {student.status === 'active' ? (t('status_active') || 'Faol') : (t('status_inactive') || 'Nofaol')}
                    </Badge>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Admin/Director/Teacher View: Table List
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">{`${t('total')}: ${students.length}`}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => openModal()} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg rounded-xl">
            <Plus className="w-5 h-5 mr-2" />{t('add_student') || "O'quvchi qo'shish"}
          </Button>
        )}
      </div>

      <GlassCard padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder={t('search') + '...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50" />
          </div>

          {/* Branch Filter - Hide if locked */}
          {(!lockedBranchId) && (
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('all_branches')} /></SelectTrigger>
              <SelectContent><SelectItem value="all">{t('all_branches')}</SelectItem>{branches.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}</SelectContent>
            </Select>
          )}

          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('filter_by_group')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_groups')}</SelectItem>
              {groups
                .filter(g => {
                  // Only show groups belonging to the active branch filter (or locked branch)
                  const activeBranch = lockedBranchId || (filterBranch !== 'all' ? filterBranch : null);
                  return activeBranch ? g.branchId === activeBranch : true;
                })
                .map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      <GlassCard padding="none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow className="border-border/50 hover:bg-transparent"><TableHead className="text-muted-foreground">{t('student')}</TableHead><TableHead className="text-muted-foreground">{t('age')}</TableHead><TableHead className="text-muted-foreground">{t('group')}</TableHead><TableHead className="text-muted-foreground">{t('branch')}</TableHead><TableHead className="text-muted-foreground">{t('status')}</TableHead>{isAdmin && <TableHead className="text-muted-foreground text-right">{t('actions')}</TableHead>}</TableRow></TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const group = getGroup(student.groupId);
                const branch = getBranch(student.branchId);
                return (
                  <TableRow key={student.id} className="border-border/50 hover:bg-muted/30">
                    <TableCell><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"><User className="w-5 h-5 text-primary-foreground" /></div><span className="font-medium">{student.name}</span></div></TableCell>
                    <TableCell>{student.age} yosh</TableCell>
                    <TableCell>{group?.name || '-'}</TableCell>
                    <TableCell>{branch?.name || '-'}</TableCell>
                    <TableCell><Badge variant={student.status === 'active' ? 'default' : 'secondary'} className={student.status === 'active' ? 'bg-success/10 text-success border-success/20' : ''}>{student.status === 'active' ? (t('active') || 'Faol') : (t('inactive') || 'Nofaol')}</Badge></TableCell>
                    {isAdmin && (
                      <TableCell className="text-right"><div className="flex justify-end gap-1"><button onClick={() => openModal(student)} className="p-2 rounded-lg hover:bg-muted/50"><Edit className="w-4 h-4 text-muted-foreground" /></button><button onClick={() => handleDelete(student.id)} className="p-2 rounded-lg hover:bg-destructive/10"><Trash2 className="w-4 h-4 text-destructive" /></button></div></TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {filteredStudents.length === 0 && (<div className="text-center py-12"><GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">{t('no_data')}</h3></div>)}
      </GlassCard>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border/50 max-w-2xl"><DialogHeader><DialogTitle className="text-xl">{editingStudent ? (t('edit_student') || "O'quvchini tahrirlash") : (t('add_student') || "Yangi o'quvchi va Ota-ona")}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">


            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-primary"><GraduationCap className="w-4 h-4" /> {t('student_info') || "O'quvchi Ma'lumotlari"}</h3>
              <div className="flex justify-center mb-4">
                <ImageUpload
                  value={formData.photo}
                  onChange={(base64) => setFormData({ ...formData, photo: base64 })}
                  label={t('photo_url') || "Rasm"}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t('full_name')}</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Alisher Umarov" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
                <div className="space-y-2"><Label>{t('age')}</Label><Input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} placeholder="4" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('group')}</Label>
                  <Select value={formData.groupId} onValueChange={(v) => setFormData({ ...formData, groupId: v })}>
                    <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('select')} /></SelectTrigger>
                    <SelectContent>
                      {groups
                        .filter(g => {
                          // In modal, restrict groups to the locked branch or currently filtered branch context
                          // If generic context, show all.
                          const activeBranch = lockedBranchId || (filterBranch !== 'all' ? filterBranch : null);
                          return activeBranch ? g.branchId === activeBranch : true;
                        })
                        .map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('status')}</Label>
                  <Select value={formData.status} onValueChange={(v: 'active' | 'inactive') => setFormData({ ...formData, status: v })}>
                    <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="active">{t('status_active')}</SelectItem><SelectItem value="inactive">{t('status_inactive')}</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>

              <div className="h-px bg-border/50 my-2" />
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="font-semibold flex items-center gap-2 text-primary"><User className="w-4 h-4" /> {t('parent_info') || "Ota-ona Ma'lumotlari (Login)"}</h3>
                <div className="space-y-2"><Label>{t('parent_name')}</Label><Input value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} placeholder="Vali Umarov" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>{t('phone')}</Label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} placeholder="+998..." className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
                  <div className="space-y-2"><Label>{t('email_login') || "Email (Login)"}</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="email" value={formData.parentEmail} onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })} placeholder="bali@example.uz" className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
                </div>

                <div className="space-y-2"><Label>{t('password')}</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="password" value={formData.parentPassword} onChange={(e) => setFormData({ ...formData, parentPassword: e.target.value })} placeholder={editingStudent ? (t('leave_empty') || "O'zgartirish uchun kiriting") : (t('password_min_length') || "Parol...")} className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
              </div>


            </div>
            <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">{t('cancel')}</Button><Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl">{t('save')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default Students;
