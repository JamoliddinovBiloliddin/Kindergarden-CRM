import React, { useState, useEffect } from 'react';
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
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Complaint } from '@/data/mockData';
import { toast } from 'sonner';

const Complaints: React.FC = () => {
  const { t, user } = useApp();
  const { complaints, addComplaint, updateComplaint, parents } = useBranchedData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [formData, setFormData] = useState({ subject: '', description: '' });
  const [responseText, setResponseText] = useState('');

  const isParent = user?.role === 'parent';
  const currentParent = isParent ? parents.find(p => p.email === user?.email) : null;

  // Filter complaints based on role
  const filteredComplaints = complaints.filter(c => {
    if (isParent && currentParent) {
      return c.parentId === currentParent.id;
    }
    return true; // Admin/Director see all
  });

  const statusConfig = {
    pending: { icon: Clock, label: t('status_pending') || 'Kutilmoqda', color: 'bg-warning/10 text-warning border-warning/20' },
    in_progress: { icon: AlertCircle, label: t('status_in_progress') || 'Ko\'rib chiqilmoqda', color: 'bg-info/10 text-info border-info/20' },
    resolved: { icon: CheckCircle, label: t('status_resolved') || 'Hal qilindi', color: 'bg-success/10 text-success border-success/20' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      toast.error(t('fill_all_fields') || 'Barcha maydonlarni to\'ldiring');
      return;
    }

    // Auto-tag with parent ID if parent, or user ID if admin (though admin usually responds)
    const authorId = isParent && currentParent ? currentParent.id : user?.id || 'unknown';

    const newComplaint: Complaint = {
      id: Date.now().toString(),
      parentId: authorId,
      subject: formData.subject,
      description: formData.description,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    addComplaint(newComplaint);
    toast.success(t('complaint_sent') || 'Murojaat yuborildi');
    setIsModalOpen(false);
    setFormData({ subject: '', description: '' });
  };

  const handleResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText || !selectedComplaint) return;

    updateComplaint({
      ...selectedComplaint,
      status: 'resolved',
      response: responseText,
    });
    toast.success(t('response_sent') || 'Javob yuborildi');
    setIsResponseModalOpen(false);
    setResponseText('');
    setSelectedComplaint(null);
  };

  const openResponseModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setResponseText(complaint.response || '');
    setIsResponseModalOpen(true);
  };

  const pendingCount = filteredComplaints.filter(c => c.status === 'pending').length;
  const resolvedCount = filteredComplaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {t('complaints')}
          </h1>
          <p className="text-muted-foreground">{t('complaints_subtitle') || 'Shikoyat va takliflar'}</p>
        </div>
        {/* Only Parents can create complaints usually, or maybe Staff too? Requirement says "Parent complaint submission". Admin responds. */}
        {/* Assuming Admin doesn't need to CREATE complaints about themselves, but maybe about others? Let's leave it open for now or restrict to Parent if strictly requested.
            User said "Automate complaint submission for parents".
            Let's allow everyone to create for now, but usually it's parents.
        */}
        <Button onClick={() => setIsModalOpen(true)} className="gradient-bg hover:opacity-90 text-white shadow-lg rounded-xl">
          <Plus className="w-5 h-5 mr-2" />
          {t('send_complaint') || 'Murojaat yuborish'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard gradient="warning">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">{t('status_pending') || 'Kutilmoqda'}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard gradient="primary">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{filteredComplaints.length}</p>
              <p className="text-sm text-muted-foreground">{t('total') || 'Jami'}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard gradient="success">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{resolvedCount}</p>
              <p className="text-sm text-muted-foreground">{t('status_resolved') || 'Hal qilindi'}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Complaints List */}
      <GlassCard>
        <h3 className="text-lg font-display font-semibold mb-4">{t('complaints_list') || 'Murojaatlar'}</h3>
        <div className="space-y-4">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => {
              const config = statusConfig[complaint.status] || { icon: AlertCircle, label: complaint.status, color: 'bg-muted text-muted-foreground border-border' };
              const StatusIcon = config.icon;
              const author = parents.find(p => p.id === complaint.parentId);
              return (
                <div key={complaint.id} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{complaint.subject}</h4>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>{complaint.date}</span>
                          {/* Show author name if Admin */}
                          {!isParent && author && (
                            <>
                              <span>•</span>
                              <span>{author.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={config.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{complaint.description}</p>

                  {complaint.response && (
                    <div className="p-3 rounded-lg bg-success/5 border border-success/20 mb-3">
                      <p className="text-sm font-medium text-success mb-1">{t('response') || 'Javob'}:</p>
                      <p className="text-sm text-muted-foreground">{complaint.response}</p>
                    </div>
                  )}

                  {(user?.role === 'director' || user?.role === 'admin') && complaint.status !== 'resolved' && (
                    <Button size="sm" onClick={() => openResponseModal(complaint)} className="gradient-bg hover:opacity-90 text-white rounded-lg">
                      <Send className="w-4 h-4 mr-2" />
                      {t('reply') || 'Javob berish'}
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('no_data') || "Ma'lumot yo'q"}
            </div>
          )}
        </div>
      </GlassCard>

      {/* New Complaint Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-card border-border/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">{t('new_complaint') || 'Yangi murojaat'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('subject') || 'Mavzu'}</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder={t('subject_placeholder') || "Murojaat mavzusi"}
                className="h-11 rounded-xl bg-muted/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('description') || 'Tavsif'}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('description_placeholder') || "Batafsil yozing..."}
                className="rounded-xl bg-muted/50 border-border/50 resize-none"
                rows={4}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">
                {t('cancel')}
              </Button>
              <Button type="submit" className="gradient-bg hover:opacity-90 text-white rounded-xl">
                {t('send') || 'Yuborish'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="glass-card border-border/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">{t('reply') || 'Javob berish'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleResponse} className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium mb-1">{selectedComplaint?.subject}</p>
              <p className="text-sm text-muted-foreground">{selectedComplaint?.description}</p>
            </div>
            <div className="space-y-2">
              <Label>{t('response') || 'Javob'}</Label>
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder={t('response_placeholder') || "Javobingizni yozing..."}
                className="rounded-xl bg-muted/50 border-border/50 resize-none"
                rows={4}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsResponseModalOpen(false)} className="rounded-xl">
                {t('cancel')}
              </Button>
              <Button type="submit" className="gradient-bg hover:opacity-90 text-white rounded-xl">
                <Send className="w-4 h-4 mr-2" />
                {t('send') || 'Yuborish'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Complaints;
