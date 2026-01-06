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
import { Baby, Plus, Search, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react';
import { Parent } from '@/data/mockData';
import { toast } from 'sonner';

const Parents: React.FC = () => {
  const { t, user } = useApp();
  const { parents, addParent, updateParent, deleteParent, students, branches } = useBranchedData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const isAdmin = user?.role === 'admin';
  const isAdminOrDirector = user?.role === 'admin' || user?.role === 'director';

  const filteredParents = parents.filter((parent) => {
    const matchesSearch = (parent.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (parent.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (parent.phone || '').includes(searchTerm);

    const parentChildren = students.filter(s => parent.childrenIds.includes(s.id));
    const matchesBranch = filterBranch === 'all' || parentChildren.some(child => child.branchId === filterBranch);

    return matchesSearch && matchesBranch;
  });

  const getChildren = (ids: string[]) => students.filter(s => ids.includes(s.id));

  const openModal = (parent?: Parent) => {
    if (parent) {
      setEditingParent(parent);
      setFormData({
        name: parent.name,
        email: parent.email,
        phone: parent.phone,
        address: parent.address,
      });
    } else {
      setEditingParent(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error(t('fill_required_fields') || 'Ism va telefon raqamini kiriting');
      return;
    }

    if (editingParent) {
      updateParent({
        ...editingParent,
        ...formData
      });
      toast.success(t('parent_updated') || 'Ma\'lumotlar yangilandi');
    } else {
      const newParent: Parent = {
        id: Date.now().toString(),
        ...formData,
        childrenIds: [],
      };
      addParent(newParent);
      toast.success(t('parent_added') || 'Yangi ota-ona qo\'shildi');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('delete_confirmation') || 'Bu ota-onani o\'chirmoqchimisiz?')) {
      deleteParent(id);
      toast.success(t('parent_deleted') || 'Ota-ona o\'chirildi');
    }
  };

  const gradients = ['primary', 'secondary', 'accent', 'success', 'warning'] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {t('parents')}
          </h1>
          <p className="text-muted-foreground">{t('total')}: {parents.length}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => openModal()} className="gradient-bg hover:opacity-90 text-white shadow-lg rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            {t('add_parent') || "Ota-ona qo'shish"}
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
          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-muted/50 border-border/50">
              <SelectValue placeholder={t('branches') || "Filial"} />
            </SelectTrigger>
            <SelectContent className="glass-card border-border/50">
              <SelectItem value="all">Barcha filiallar</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParents.map((parent, index) => {
          const children = getChildren(parent.childrenIds);
          return (
            <GlassCard key={parent.id} hover gradient={gradients[index % gradients.length]}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    {(parent.name || '?').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{parent.name}</h3>
                    <p className="text-sm text-muted-foreground">{children.length} farzand</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button onClick={() => openModal(parent)} className="p-2 rounded-lg hover:bg-muted/50">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleDelete(parent.id)} className="p-2 rounded-lg hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{parent.email || 'Belgilanmagan'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{parent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{parent.address || 'Belgilanmagan'}</span>
                </div>
              </div>

              {children.length > 0 && (
                <div className="pt-3 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">Farzandlar:</p>
                  <div className="space-y-2">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Baby className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{child.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {filteredParents.length === 0 && (
        <GlassCard className="text-center py-12">
          <Baby className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('no_data')}</h3>
          <p className="text-muted-foreground">{t('parent_not_found') || "Ota-ona topilmadi"}</p>
        </GlassCard>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-card border-border/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {editingParent ? (t('edit_parent') || 'Ota-onani tahrirlash') : (t('add_parent') || 'Yangi ota-ona')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>To'liq ism</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ism Familiya"
                className="h-11 rounded-xl bg-muted/50 border-border/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.uz"
                  className="h-11 rounded-xl bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="h-11 rounded-xl bg-muted/50 border-border/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Manzil</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Toshkent, Chilonzor tumani"
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

export default Parents;
