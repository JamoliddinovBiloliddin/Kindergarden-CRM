import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useData } from '@/hooks/useData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Power, Shield, Settings, Mail, Phone, Lock } from 'lucide-react';
import { User } from '@/data/mockData';
import { toast } from 'sonner';

const CRMManagement: React.FC = () => {
    const { t } = useApp();
    const { users, addUser, updateUser, deleteUser } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        status: 'active' as 'active' | 'inactive'
    });

    // Filter only Directors (Clients)
    const directors = users.filter(u =>
        u.role === 'director' &&
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                phone: '', // Mock data doesn't strictly have phone on User interface but logically Directors have it.
                password: '',
                status: user.status
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', phone: '', password: '', status: 'active' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            updateUser({
                ...editingUser,
                name: formData.name,
                email: formData.email,
                status: formData.status,
                ...(formData.password ? { password: formData.password } : {})
            });
            toast.success("Client account updated successfully");
        } else {
            if (!formData.name || !formData.email || !formData.password) {
                toast.error("Please fill all required fields");
                return;
            }

            const exists = users.some(u => u.email === formData.email);
            if (exists) {
                toast.error("Email already exists");
                return;
            }

            addUser({
                id: Date.now().toString(),
                createdAt: new Date().toISOString().split('T')[0],
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'director',
                status: formData.status
            });
            toast.success("New CRM Instance (Director) created");
        }
        setIsModalOpen(false);
    };

    const toggleStatus = (user: User) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        updateUser({ ...user, status: newStatus });
        toast.info(`Client ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">CRM Management</h1>
                    <p className="text-muted-foreground">Create and manage Kindergarten Hub instances (Director Accounts)</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="gradient-bg hover:opacity-90 text-white shadow-lg rounded-xl">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New CRM
                </Button>
            </div>

            <GlassCard title="Active Clients">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 rounded-xl bg-muted/50 border-border/50"
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Director / Org Name</TableHead>
                                <TableHead>Contact (Login)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {directors.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/30">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{user.name}</div>
                                                <div className="text-xs text-muted-foreground uppercase">Director</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            {user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={user.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}>
                                            {user.status === 'active' ? 'Active' : 'Suspended'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {user.createdAt || '2024-01-01'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => toggleStatus(user)} title={user.status === 'active' ? 'Suspend' : 'Activate'}>
                                                <Power className={`w-4 h-4 ${user.status === 'active' ? 'text-red-500' : 'text-green-500'}`} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                                                <Edit className="w-4 h-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Manage Permissions (Mock)">
                                                <Shield className="w-4 h-4 text-indigo-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {directors.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No clients found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </GlassCard>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="glass-card border-border/50 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-display">{editingUser ? 'Edit Client Details' : 'Provision New CRM Instance'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Director / Organization Name</Label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Happy Kids Kindergarten"
                                    className="pl-10 rounded-xl bg-muted/50 border-border/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Email (System Login)</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="director@example.com"
                                    className="pl-10 rounded-xl bg-muted/50 border-border/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{editingUser ? 'New Password (leave empty to keep)' : 'Initial Password'}</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="******"
                                    className="pl-10 rounded-xl bg-muted/50 border-border/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive (Suspended)</option>
                            </select>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" className="gradient-bg text-white rounded-xl">
                                {editingUser ? 'Update Client' : 'Provision System'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CRMManagement;
