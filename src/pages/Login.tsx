import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Baby, Mail, Lock, Eye, EyeOff, Sparkles, Settings, Check, Sun, Moon, Palette } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const { isAuthenticated, login, t, language, setLanguage, theme, setTheme, colorTheme, setColorTheme } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      toast.success('Muvaffaqiyatli kirildi!');
    } else {
      toast.error(t('invalid_credentials'));
    }
  };

  const demoAccounts = [
    { email: 'director@kindergarten.uz', role: 'Director' },
    { email: 'admin@kindergarten.uz', role: 'Admin' },
    { email: 'teacher@kindergarten.uz', role: 'Teacher' },
    { email: 'super@kindergarten.uz', role: 'Superadmin' },
  ];

  const languages = [
    { code: 'uz' as const, label: "O'z", flag: '🇺🇿' },
    { code: 'ru' as const, label: 'Ру', flag: '🇷🇺' },
    { code: 'en' as const, label: 'En', flag: '🇬🇧' },
  ];

  const colorThemes = [
    { id: 'default' as const, colors: ['#3b82f6', '#8b5cf6', '#d946ef'] },
    { id: 'ocean' as const, colors: ['#06b6d4', '#14b8a6', '#3b82f6'] },
    { id: 'sunset' as const, colors: ['#f97316', '#ec4899', '#eab308'] },
    { id: 'forest' as const, colors: ['#22c55e', '#10b981', '#84cc16'] },
    { id: 'berry' as const, colors: ['#a855f7', '#ec4899', '#8b5cf6'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />


      <div className="absolute top-4 right-4 flex gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${language === lang.code
              ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
              : 'bg-card/60 backdrop-blur-xl border border-border/20 hover:bg-muted/50'
              }`}
          >
            {lang.flag} {lang.label}
          </button>
        ))}

        <Sheet>
          <SheetTrigger asChild>
            <button className="px-3 py-1.5 rounded-lg bg-card/60 backdrop-blur-xl border border-border/20 hover:bg-muted/50 transition-all">
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t('settings')}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Theme Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span className="font-medium">{t('theme')}</span>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </div>

              {/* Color Theme */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="font-medium">{t('color_theme')}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setColorTheme(theme.id)}
                      className={cn(
                        'p-3 rounded-xl border transition-all duration-200 text-left relative flex items-center gap-3',
                        colorTheme === theme.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/50 bg-muted/30'
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {theme.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{t(`theme_${theme.id}`)}</h4>
                        <p className="text-[10px] text-muted-foreground">{t(`theme_${theme.id}_desc`)}</p>
                      </div>
                      {colorTheme === theme.id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="w-full max-w-md relative z-10">
        <GlassCard className="p-8" padding="none">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg flex items-center justify-center mx-auto mb-4">
                <Baby className="w-10 h-10 text-primary-foreground" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-warning animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Yulduzcha
            </h1>
            <p className="text-muted-foreground text-sm">{t('login_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@kindergarten.uz"
                  className="pl-11 h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">{t('password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl bg-muted/50 border-border/50 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-primary-foreground font-medium shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>{t('loading')}</span>
                </div>
              ) : (
                t('login')
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center mb-3">Demo hisoblar (parol: 1234)</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('1234');
                  }}
                  className="px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-xs text-left transition-colors"
                >
                  <span className="font-medium text-foreground">{account.role}</span>
                  <br />
                  <span className="text-muted-foreground truncate block">{account.email}</span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div >
  );
};

export default Login;
