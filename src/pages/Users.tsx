import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useBranchedData } from '@/hooks/useBranchedData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users as UsersIcon, Plus, Search, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/data/mockData';

const Users: React.FC = () => {
  const { t, user } = useApp();
  const { users, addUser, updateUser, deleteUser, branches } = useBranchedData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher' as User['role'],
    status: 'active' as User['status'],
    branchId: undefined as string | undefined,
  });

  // Basic search filter first. Tab filter happens during render.
  const filteredUsers = users.filter((u) => {
    return u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const roleConfig = {
    director: { label: t('role_director'), color: 'bg-primary/10 text-primary border-primary/20' },
    admin: { label: t('role_admin'), color: 'bg-secondary/10 text-secondary border-secondary/20' },
    teacher: { label: t('role_teacher'), color: 'bg-success/10 text-success border-success/20' },
    parent: { label: t('role_parent'), color: 'bg-warning/10 text-warning border-warning/20' },
    superadmin: { label: t('role_superadmin'), color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status,
        branchId: user.branchId
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'teacher', status: 'active', branchId: undefined });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!editingUser && !formData.password)) {
      toast.error(t('fill_all_fields_error'));
      return;
    }

    if (['director', 'admin', 'teacher'].includes(formData.role) && !formData.branchId) {
      toast.error(t('branch_required_error'));
      return;
    }

    if (editingUser) {
      updateUser({
        ...editingUser,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        branchId: formData.branchId,
      });
      toast.success(t('user_updated'));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0],
        password: formData.password,
        branchId: formData.branchId,
      };
      addUser(newUser);
      toast.success(t('user_added'));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('delete_user_confirm'))) {
      deleteUser(id);
      toast.success(t('user_deleted'));
    }
  };

  // Only director and admin can access this page
  if (user?.role !== 'director' && user?.role !== 'admin') {
    return (
      <GlassCard className="text-center py-12">
        <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('no_permission')}</h3>
        <p className="text-muted-foreground">{t('no_permission_desc')}</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {t('users')}
          </h1>
          <p className="text-muted-foreground">{t('users_subtitle')}</p>
        </div>
        <Button onClick={() => openModal()} className="gradient-bg hover:opacity-90 text-white shadow-lg rounded-xl">
          <Plus className="w-5 h-5 mr-2" />
          {t('add_user')}
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <GlassCard padding="md" className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('search') + '...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50 w-full"
              />
            </div>
            <TabsList className="bg-muted/50 border border-border/50 p-1 h-12 w-full md:w-auto overflow-x-auto flex-nowrap justify-start">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">{t('filter_all')}</TabsTrigger>
              <TabsTrigger value="director" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">{t('filter_directors')}</TabsTrigger>
              <TabsTrigger value="admin" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">{t('filter_admins')}</TabsTrigger>
              <TabsTrigger value="teacher" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">{t('filter_teachers')}</TabsTrigger>
              <TabsTrigger value="parent" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">{t('filter_parents')}</TabsTrigger>
            </TabsList>
          </div>
        </GlassCard>

        {['all', 'director', 'admin', 'teacher', 'parent'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers
                .filter(u => tab === 'all' || u.role === tab)
                .map((user) => (
                  <GlassCard key={user.id} hover>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-medium shadow-md">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openModal(user)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={roleConfig[user.role].color}>
                        {roleConfig[user.role].label}
                      </Badge>
                      <Badge variant="outline" className={user.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground'}>
                        {user.status === 'active' ? t('status_active') : t('status_inactive')}
                      </Badge>
                    </div>
                  </GlassCard>
                ))}
            </div>
            {filteredUsers.filter(u => tab === 'all' || u.role === tab).length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('no_data')}</h3>
                <p className="text-muted-foreground">{t('no_users_found')}</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-card border-border/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {editingUser ? t('edit_user') : t('new_user')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('full_name_label')}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ism Familiya"
                className="h-11 rounded-xl bg-muted/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('email')}</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.uz"
                className="h-11 rounded-xl bg-muted/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>{editingUser ? t('new_password_placeholder') : t('password')}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="h-11 rounded-xl bg-muted/50 border-border/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('role')}</Label>
                <Select value={formData.role} onValueChange={(v: User['role']) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="director">{t('role_director')}</SelectItem>
                    <SelectItem value="admin">{t('role_admin')}</SelectItem>
                    <SelectItem value="teacher">{t('role_teacher')}</SelectItem>
                    <SelectItem value="parent">{t('role_parent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('status_label')}</Label>
                <Select value={formData.status} onValueChange={(v: User['status']) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('status_active')}</SelectItem>
                    <SelectItem value="inactive">{t('status_inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Branch Selection for Admins/Directors/Teachers */}
            {(formData.role === 'director' || formData.role === 'admin' || formData.role === 'teacher') && (
              <div className="space-y-2">
                <Label>{t('branch')} <span className="text-red-500">*</span></Label>
                <Select value={formData.branchId} onValueChange={(v) => setFormData({ ...formData, branchId: v === 'all' ? undefined : v })}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50">
                    <SelectValue placeholder={t('all_branches')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_branches')}</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t('branch_select_hint')}
                </p>
              </div>
            )}
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

export default Users;
