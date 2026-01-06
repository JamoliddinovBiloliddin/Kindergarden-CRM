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
import { Utensils, Plus, Coffee, Sun, Cookie, Moon, Flame } from 'lucide-react';
import { Meal } from '@/data/mockData';
import { toast } from 'sonner';

const Meals: React.FC = () => {
  const { t, user } = useApp();
  const { meals, addMeal, branches, parents, teachers, groups, students } = useBranchedData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'breakfast' as Meal['type'], date: new Date().toISOString().split('T')[0], branchId: '', menu: '', calories: '' });

  const isParent = user?.role === 'parent';
  const currentParent = isParent ? parents.find(p => p.email === user?.email) : null;
  const isTeacher = user?.role === 'teacher';
  const currentTeacher = isTeacher ? teachers.find(t => t.email === user?.email) : null;

  const mealTypeIcons = { breakfast: Coffee, lunch: Sun, snack: Cookie, dinner: Moon };
  const mealTypeLabels = {
    breakfast: t('meal_breakfast') || 'Nonushta',
    lunch: t('meal_lunch') || 'Tushlik',
    snack: t('meal_snack') || 'Poldnik',
    dinner: t('meal_dinner') || 'Kechki ovqat'
  };
  const mealTypeColors = { breakfast: 'bg-warning/10 text-warning border-warning/20', lunch: 'bg-success/10 text-success border-success/20', snack: 'bg-secondary/10 text-secondary border-secondary/20', dinner: 'bg-primary/10 text-primary border-primary/20' };

  // Filter allowed branches for selection (Admins only)
  // Teachers and parents cannot add meals, so this is mainly for Admin/Director

  // Filter meals based on role
  const filteredMeals = meals.filter(m => {
    if (isParent && currentParent) {
      // Parent -> Children -> Groups -> Branches
      const parentStudents = students.filter(s => currentParent.childrenIds.includes(s.id));
      const studentBranchIds = parentStudents.map(s => {
        const group = groups.find(g => g.id === s.groupId);
        return group?.branchId;
      }).filter(Boolean); // remove undefined
      return studentBranchIds.includes(m.branchId);
    }
    if (isTeacher && currentTeacher) {
      // Teacher -> Groups -> Branches
      const assignedGroups = groups.filter(g => (currentTeacher.groupIds && currentTeacher.groupIds.includes(g.id)) || g.teacherId === currentTeacher.id);
      const teacherBranchIds = assignedGroups.map(g => g.branchId);
      return teacherBranchIds.includes(m.branchId);
    }
    return true; // Admin/Director sees all
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.branchId || !formData.menu) {
      toast.error(t('fill_all_fields') || "Barcha maydonlarni to'ldiring");
      return;
    }
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      date: formData.date,
      branchId: formData.branchId,
      menu: formData.menu.split(',').map(m => m.trim()),
      calories: parseInt(formData.calories) || 0
    };
    addMeal(newMeal);
    toast.success(t('success') || "Muvaffaqiyatli");
    setIsModalOpen(false);
    setFormData({ name: '', type: 'breakfast', date: new Date().toISOString().split('T')[0], branchId: '', menu: '', calories: '' });
  };

  const todayMeals = filteredMeals.filter(m => m.date === new Date().toISOString().split('T')[0]);

  // Hide Add button for Parents and Teachers
  const canAdd = !isParent && !isTeacher;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('meals')}</h1>
          <p className="text-muted-foreground">{t('today_menu') || "Bugungi menyu va ovqatlanish jadvali"}</p>
        </div>
        {canAdd && (
          <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            {t('add_menu') || "Menyu qo'shish"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((type) => {
          const meal = todayMeals.find(m => m.type === type); const Icon = mealTypeIcons[type];
          // Note: If multiple branches associated, this simple check might pick just one meal per type randomly or first found.
          // For parents with kids in different branches, this might be confusing if we just show first.
          // ideally we should group by child/branch. But for now simple list.

          return (
            <GlassCard key={type} hover gradient={type === 'breakfast' ? 'warning' : type === 'lunch' ? 'success' : type === 'snack' ? 'secondary' : 'primary'}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"><Icon className="w-6 h-6 text-primary-foreground" /></div>
                <div><h3 className="font-semibold">{mealTypeLabels[type]}</h3><Badge variant="outline" className={mealTypeColors[type]}>{meal ? (t('meal_ready') || 'Tayyor') : (t('meal_not_set') || 'Belgilanmagan')}</Badge></div>
              </div>
              {meal ? (<div className="space-y-2"><div className="bg-muted/50 rounded-xl p-3"><ul className="text-sm space-y-1">{meal.menu.map((item, i) => (<li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />{item}</li>))}</ul></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><Flame className="w-4 h-4 text-warning" /><span>{meal.calories} {t('calories') || 'kaloriya'}</span></div></div>) : (<p className="text-sm text-muted-foreground">{t('no_menu_set') || "Hali menyu belgilanmagan"}</p>)}
            </GlassCard>
          );
        })}
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">{t('menu_history') || "Menyu tarixi"}</h3>
        <div className="space-y-3">
          {filteredMeals.length > 0 ? (
            filteredMeals.slice().reverse().slice(0, 10).map((meal) => {
              const Icon = mealTypeIcons[meal.type] || Utensils;
              const branch = branches.find(b => b.id === meal.branchId);
              const colorClass = mealTypeColors[meal.type] || 'bg-muted text-muted-foreground border-border';
              const label = mealTypeLabels[meal.type] || meal.type;

              return (
                <div key={meal.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{meal.name}</h4>
                      <p className="text-sm text-muted-foreground">{branch?.name} • {meal.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={colorClass}>{label}</Badge>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">{t('no_data') || "Ma'lumot yo'q"}</div>
          )}
        </div>
      </GlassCard>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border/50 max-w-lg"><DialogHeader><DialogTitle className="text-xl">{t('new_menu') || "Yangi menyu qo'shish"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>{t('menu_name') || 'Menyu nomi'}</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ertalabki nonushta" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>{t('meal_type') || 'Turi'}</Label><Select value={formData.type} onValueChange={(v: Meal['type']) => setFormData({ ...formData, type: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="breakfast">{t('meal_breakfast') || 'Nonushta'}</SelectItem><SelectItem value="lunch">{t('meal_lunch') || 'Tushlik'}</SelectItem><SelectItem value="snack">{t('meal_snack') || 'Poldnik'}</SelectItem><SelectItem value="dinner">{t('meal_dinner') || 'Kechki ovqat'}</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>{t('date') || 'Sana'}</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>{t('branches') || 'Filial'}</Label><Select value={formData.branchId} onValueChange={(v) => setFormData({ ...formData, branchId: v })}><SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder={t('select') || "Tanlang"} /></SelectTrigger><SelectContent>{branches.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}</SelectContent></Select></div><div className="space-y-2"><Label>{t('calories') || 'Kaloriya'}</Label><Input type="number" value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: e.target.value })} placeholder="350" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div></div>
            <div className="space-y-2"><Label>{t('menu_items') || 'Menyu (vergul bilan)'}</Label><Input value={formData.menu} onChange={(e) => setFormData({ ...formData, menu: e.target.value })} placeholder="Sut bo'tqa, Choy, Non" className="h-11 rounded-xl bg-muted/50 border-border/50" /></div>
            <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">{t('cancel')}</Button><Button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground rounded-xl">{t('save')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Meals;
