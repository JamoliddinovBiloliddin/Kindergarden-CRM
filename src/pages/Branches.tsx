import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useData } from '@/hooks/useData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, Search, MapPin, Phone, Users, Edit, Trash2 } from 'lucide-react';
import { Branch } from '@/data/mockData';
import { toast } from 'sonner';
import { LocationPicker } from '@/components/ui/LocationPicker';

const Branches: React.FC = () => {
  const { t } = useApp();
  const { branches, addBranch, updateBranch, deleteBranch, groups, students } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', capacity: '', location: { lat: 41.2995, lng: 69.2401 } });

  const calculateStats = (branchId: string) => {
    const branchGroups = groups.filter(g => g.branchId === branchId);
    // Count students in groups belonging to this branch
    const studentCount = students.filter(s => branchGroups.some(g => g.id === s.groupId)).length;
    return { groupsCount: branchGroups.length, studentsCount: studentCount };
  };

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch = (branch.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (branch.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (filterGroup === 'all') return matchesSearch;
    const branchGroups = groups.filter(g => g.branchId === branch.id);
    return matchesSearch && branchGroups.some(g => g.id === filterGroup);
  });

  const openModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({ name: branch.name, address: branch.address, phone: branch.phone, capacity: branch.capacity.toString(), location: branch.location });
    } else {
      setEditingBranch(null);
      setFormData({ name: '', address: '', phone: '', capacity: '', location: { lat: 41.2995, lng: 69.2401 } });
    }
    setIsModalOpen(true);
  };

  const handleLocationChange = async (loc: { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, location: loc }));

    // Reverse geocoding
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`);
      const data = await response.json();

      if (data.address) {
        // Construct address: Region, City/District, Road, House Number
        const parts = [];

        // Clean up region name (remove 'viloyati', 'region', etc.)
        if (data.address.state) {
          let state = data.address.state;
          state = state.replace(/viloyati|region|district/gi, '').trim();
          parts.push(state);
        }

        if (data.address.city || data.address.town || data.address.county) parts.push(data.address.city || data.address.town || data.address.county);
        if (data.address.district || data.address.suburb || data.address.neighbourhood) parts.push(data.address.district || data.address.suburb || data.address.neighbourhood);
        if (data.address.road) parts.push(data.address.road);
        if (data.address.house_number) parts.push(data.address.house_number);

        const newAddress = parts.join(', ');
        if (newAddress) {
          setFormData(prev => ({ ...prev, address: newAddress }));
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      // Optional: toast.error("Manzilni aniqlab bo'lmadi");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone || !formData.capacity) { toast.error("Barcha maydonlarni to'ldiring"); return; }

    if (editingBranch) {
      updateBranch({
        ...editingBranch,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        capacity: parseInt(formData.capacity),
        location: formData.location
      });
      toast.success(t('branch_updated') || 'Filial yangilandi');
    } else {
      const newBranch: Branch = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        capacity: parseInt(formData.capacity),
        studentsCount: 0,
        groupsCount: 0,
        location: formData.location
      };
      addBranch(newBranch);
      toast.success(t('branch_added') || "Yangi filial qo'shildi");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    // Safety check: Prevent deletion if branch has data
    const stats = calculateStats(id);
    if (stats.studentsCount > 0 || stats.groupsCount > 0) {
      toast.error("Bu filialda o'quvchilar yoki guruhlar mavjud. O'chirishdan oldin ularni boshqa filialga o'tkazing yoki o'chiring.");
      return;
    }

    if (confirm(t('delete_confirmation') || "Bu filialni o'chirmoqchimisiz?")) {
      deleteBranch(id);
      toast.success(t('branch_deleted') || "Filial o'chirildi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('branches')}</h1>
          <p className="text-muted-foreground">{t('total')}: {branches.length}</p>
        </div>
        <Button onClick={() => openModal()} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg rounded-xl">
          <Plus className="w-5 h-5 mr-2" />{t('add_branch')}
        </Button>
      </div>

      <GlassCard padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder={t('search') + '...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50" />
          </div>
          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('filter_by_group')} /></SelectTrigger>
            <SelectContent><SelectItem value="all">{t('all_branches')}</SelectItem>{groups.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch, i) => {
          const stats = calculateStats(branch.id);
          return (
            <GlassCard key={branch.id} hover gradient={i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'accent'}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"><Building2 className="w-6 h-6 text-primary-foreground" /></div>
                  <div><h3 className="font-semibold text-foreground">{branch.name}</h3><p className="text-sm text-muted-foreground">{branch.phone}</p></div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(branch)} className="p-2 rounded-lg hover:bg-muted/50"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                  <button onClick={() => handleDelete(branch.id)} className="p-2 rounded-lg hover:bg-destructive/10"><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-muted-foreground mt-0.5" /><p className="text-sm text-muted-foreground line-clamp-2">{branch.address}</p></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">{branch.phone}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/50 rounded-xl p-3 text-center"><div className="flex items-center justify-center gap-1 mb-1"><Users className="w-4 h-4 text-primary" /></div><p className="text-xl font-bold">{stats.studentsCount}</p><p className="text-xs text-muted-foreground">{t('students')}</p></div>
                <div className="bg-muted/50 rounded-xl p-3 text-center"><div className="flex items-center justify-center gap-1 mb-1"><Building2 className="w-4 h-4 text-secondary" /></div><p className="text-xl font-bold">{stats.groupsCount}</p><p className="text-xs text-muted-foreground">{t('groups')}</p></div>
              </div>
              <div><div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{t('capacity')}</span><span className="font-medium">{stats.studentsCount}/{branch.capacity}</span></div><div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${Math.min((stats.studentsCount / branch.capacity) * 100, 100)}%` }} /></div></div>
            </GlassCard>
          );
        })}
      </div>

      {filteredBranches.length === 0 && (<GlassCard className="text-center py-12"><Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">{t('no_data')}</h3><p className="text-muted-foreground">{t('branch_not_found') || "Filial topilmadi"}</p></GlassCard>)}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border/50 max-w-lg">
          <DialogHeader><DialogTitle className="text-xl">{editingBranch ? t('edit_branch') : t('add_branch')}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>{t('branch_name')}</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Yulduzcha Markaziy" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <div className="space-y-2"><Label>{t('address')}</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Toshkent sh., Chilonzor tumani" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t('phone')}</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+998 71 123 45 67" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
              <div className="space-y-2"><Label>{t('capacity')}</Label><Input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} placeholder="100" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            </div>
            <div className="space-y-2">
              <Label>{t('location')}</Label>
              <LocationPicker
                value={formData.location}
                onChange={handleLocationChange}
              />
            </div>
            <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">{t('cancel')}</Button><Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl">{t('save')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branches;
