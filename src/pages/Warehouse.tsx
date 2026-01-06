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
import { Warehouse as WarehouseIcon, Plus, Search, AlertTriangle, Package } from 'lucide-react';
import { WarehouseItem } from '@/data/mockData';
import { toast } from 'sonner';

const Warehouse: React.FC = () => {
  const { t } = useApp();
  const { warehouseItems, addWarehouseItem, branches } = useBranchedData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', quantity: '', unit: '', minStock: '', branchId: '' });

  //   useEffect(() => { localStorage.setItem('warehouseItems', JSON.stringify(items)); }, [items]); // Removed local persistence

  const items = warehouseItems; // Alias for convenience or refactor below
  const categories = [...new Set(items.map(i => i.category))];
  const lowStockItems = items.filter(i => i.quantity <= i.minStock);
  const filteredItems = items.filter((item) => { const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()); const matchesCategory = filterCategory === 'all' || item.category === filterCategory; return matchesSearch && matchesCategory; });
  const getBranch = (id: string) => branches.find(b => b.id === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.quantity || !formData.unit) {
      toast.error(t('fill_all_fields') || "Barcha maydonlarni to'ldiring");
      return;
    }
    const newItem: WarehouseItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      minStock: parseInt(formData.minStock) || 10,
      branchId: formData.branchId,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    addWarehouseItem(newItem);
    toast.success(t('product_added') || "Mahsulot qo'shildi");
    setIsModalOpen(false);
    setFormData({ name: '', category: '', quantity: '', unit: '', minStock: '', branchId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('warehouse')}</h1><p className="text-muted-foreground">{t('warehouse_management') || "Ombor boshqaruvi"}</p></div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg rounded-xl"><Plus className="w-5 h-5 mr-2" />{t('add_product') || "Mahsulot qo'shish"}</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard gradient="primary"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"><Package className="w-6 h-6 text-primary-foreground" /></div><div><p className="text-2xl font-bold">{items.length}</p><p className="text-sm text-muted-foreground">{t('total_products') || "Jami mahsulotlar"}</p></div></div></GlassCard>
        <GlassCard gradient="secondary"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center"><WarehouseIcon className="w-6 h-6 text-secondary-foreground" /></div><div><p className="text-2xl font-bold">{categories.length}</p><p className="text-sm text-muted-foreground">{t('categories') || "Kategoriyalar"}</p></div></div></GlassCard>
        <GlassCard><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-warning" /></div><div><p className="text-2xl font-bold">{lowStockItems.length}</p><p className="text-sm text-muted-foreground">{t('low_stock') || "Kam qolgan"}</p></div></div></GlassCard>
      </div>

      {lowStockItems.length > 0 && (<GlassCard className="border-warning/30 bg-warning/5"><div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-5 h-5 text-warning" /><h3 className="font-semibold text-warning">{t('low_stock_items') || "Kam qolgan mahsulotlar"}</h3></div><div className="flex flex-wrap gap-2">{lowStockItems.map((item) => (<Badge key={item.id} variant="outline" className="bg-warning/10 text-warning border-warning/20">{item.name}: {item.quantity} {item.unit}</Badge>))}</div></GlassCard>)}

      <GlassCard padding="md"><div className="flex flex-col sm:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input placeholder={t('search') + '...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 rounded-xl bg-muted/50 border-border/50" /></div><Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('category') || "Kategoriya"} /></SelectTrigger><SelectContent><SelectItem value="all">{t('categories') || "Barcha kategoriyalar"}</SelectItem>{categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select></div></GlassCard>

      <GlassCard padding="none">
        <div className="overflow-x-auto"><Table><TableHeader><TableRow className="border-border/50 hover:bg-transparent"><TableHead className="text-muted-foreground">{t('product_name') || "Mahsulot"}</TableHead><TableHead className="text-muted-foreground">{t('category') || "Kategoriya"}</TableHead><TableHead className="text-muted-foreground">{t('quantity') || "Miqdor"}</TableHead><TableHead className="text-muted-foreground">{t('branch') || "Filial"}</TableHead><TableHead className="text-muted-foreground">{t('updated') || "Yangilangan"}</TableHead><TableHead className="text-muted-foreground">{t('status') || "Holat"}</TableHead></TableRow></TableHeader>
          <TableBody>{filteredItems.map((item) => { const branch = getBranch(item.branchId); const isLowStock = item.quantity <= item.minStock; return (<TableRow key={item.id} className="border-border/50 hover:bg-muted/30"><TableCell className="font-medium">{item.name}</TableCell><TableCell>{item.category}</TableCell><TableCell>{item.quantity} {item.unit}</TableCell><TableCell>{branch?.name || '-'}</TableCell><TableCell>{item.lastUpdated}</TableCell><TableCell><Badge variant="outline" className={isLowStock ? 'bg-warning/10 text-warning border-warning/20' : 'bg-success/10 text-success border-success/20'}>{isLowStock ? (t('low') || 'Kam') : (t('sufficient') || 'Yetarli')}</Badge></TableCell></TableRow>); })}</TableBody>
        </Table></div>
      </GlassCard>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border/50 max-w-lg"><DialogHeader><DialogTitle className="text-xl">{t('new_product') || "Yangi mahsulot"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>{t('product_name') || "Mahsulot nomi"}</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Guruch" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>{t('category') || "Kategoriya"}</Label><Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Oziq-ovqat" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div><div className="space-y-2"><Label>{t('branch') || "Filial"}</Label><Select value={formData.branchId} onValueChange={(v) => setFormData({ ...formData, branchId: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('select') || "Tanlang"} /></SelectTrigger><SelectContent>{branches.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}</SelectContent></Select></div></div>
            <div className="grid grid-cols-3 gap-4"><div className="space-y-2"><Label>{t('quantity') || "Miqdor"}</Label><Input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="50" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div><div className="space-y-2"><Label>{t('unit') || "Birlik"}</Label><Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="kg" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div><div className="space-y-2"><Label>{t('min_stock') || "Min. zaxira"}</Label><Input type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} placeholder="10" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
            <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">{t('cancel')}</Button><Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl">{t('save')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Warehouse;
