import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useData } from '@/hooks/useData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QrCode, Download, RefreshCw, User, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const QRCodePage: React.FC = () => {
  const { t, user } = useApp();
  const { students, groups, parents } = useData();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [scanHistory, setScanHistory] = useState<Array<{ id: string; studentId: string; time: string; type: 'in' | 'out' }>>(() => {
    const saved = localStorage.getItem('scanHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const isParent = user?.role === 'parent';
  const currentParent = isParent ? parents.find(p => p.email === user?.email) : null;
  const isTeacher = user?.role === 'teacher';

  // If parent, auto-select first child on mount
  useEffect(() => {
    if (isParent && currentParent && currentParent.childrenIds.length > 0) {
      setSelectedStudent(currentParent.childrenIds[0]);
    }
  }, [isParent, currentParent]);

  React.useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const getStudent = (id: string) => students.find(s => s.id === id);
  const getGroup = (id: string) => groups.find(g => g.id === id);

  const simulateScan = (type: 'in' | 'out') => {
    if (!selectedStudent) {
      toast.error(t('select_student_error'));
      return;
    }
    const newScan = {
      id: Date.now().toString(),
      studentId: selectedStudent,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      type,
    };
    setScanHistory([newScan, ...scanHistory]);
    setScanHistory([newScan, ...scanHistory]);
    toast.success(type === 'in' ? t('check_in_success') : t('check_out_success'));
  };

  const todayScans = scanHistory.filter(s => {
    // strict filtering for parent
    if (isParent && currentParent) {
      return currentParent.childrenIds.includes(s.studentId);
    }
    return true;
  });

  const availableStudents = students.filter(s => {
    if (isParent && currentParent) {
      return currentParent.childrenIds.includes(s.id);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {t('qr_code')}
          </h1>
          <p className="text-muted-foreground">{isParent ? t('my_child_attendance') : t('qr_code_subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Generator */}
        <GlassCard>
          <h3 className="text-lg font-display font-semibold mb-6">QR Kod</h3>

          {!isParent && (
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label>{t('select_student_qr')}</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50">
                    <SelectValue placeholder={t('select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStudents.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedStudent && (
            <div className="text-center">
              {/* Simulated QR Code */}
              <div className="w-48 h-48 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-2 bg-card rounded-xl flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-sm ${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-medium mb-1">{getStudent(selectedStudent)?.name}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {getGroup(getStudent(selectedStudent)?.groupId || '')?.name}
              </p>
              {!isParent && (
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" className="rounded-xl">
                    <Download className="w-4 h-4 mr-2" />
                    {t('download')}
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('refresh')}
                  </Button>
                </div>
              )}
            </div>
          )}

          {!selectedStudent && (
            <div className="text-center py-12">
              <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('select_student_qr')}</p>
            </div>
          )}
        </GlassCard>

        {/* Scan Simulator / History */}
        <GlassCard>
          {/* Simulator only for Admin/Director/Teacher */}
          {!isParent && (
            <>
              <h3 className="text-lg font-display font-semibold mb-6">{t('scan_simulator')}</h3>
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-2xl border-4 border-dashed border-primary/30 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-primary/50" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('click_to_simulate')}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => simulateScan('in')} className="gradient-bg hover:opacity-90 text-white rounded-xl">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('check_in')}
                  </Button>
                  <Button onClick={() => simulateScan('out')} variant="outline" className="rounded-xl">
                    <Clock className="w-4 h-4 mr-2" />
                    {t('check_out')}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Today's Scans */}
          <div className={isParent ? 'mt-0' : 'mt-8 border-t pt-4'}>
            <h4 className="font-medium mb-3">{isParent ? t('attendance_history') : t('attendance_today')}</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todayScans.slice(0, 10).map((scan) => {
                const student = getStudent(scan.studentId);
                return (
                  <div key={scan.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm">
                        {student?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{student?.name}</p>
                        <p className="text-xs text-muted-foreground">{scan.time}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${scan.type === 'in' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {scan.type === 'in' ? t('scanned_in') : t('scanned_out')}
                    </span>
                  </div>
                );
              })}
              {todayScans.length === 0 && (
                <p className="text-center text-muted-foreground py-4">{t('no_data')}</p>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Stats - Hide global stats for parent, or show only their child stats */}
      {!isParent && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard gradient="success">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{todayScans.filter(s => s.type === 'in').length}</p>
                <p className="text-sm text-muted-foreground">{t('arrived')}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard gradient="warning">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{todayScans.filter(s => s.type === 'out').length}</p>
                <p className="text-sm text-muted-foreground">{t('left')}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard gradient="primary">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{students.length}</p>
                <p className="text-sm text-muted-foreground">{t('total_students')}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default QRCodePage;
