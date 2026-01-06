import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Switch } from '@/components/ui/switch';
import { Globe, Moon, Sun, Palette, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { t, language, setLanguage, theme, setTheme, colorTheme, setColorTheme } = useApp();

  const languages = [
    { code: 'uz' as const, label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  const colorThemes = [
    { id: 'default' as const, colors: ['#3b82f6', '#8b5cf6', '#d946ef'] },
    { id: 'ocean' as const, colors: ['#06b6d4', '#14b8a6', '#3b82f6'] },
    { id: 'sunset' as const, colors: ['#f97316', '#ec4899', '#eab308'] },
    { id: 'forest' as const, colors: ['#22c55e', '#10b981', '#84cc16'] },
    { id: 'berry' as const, colors: ['#a855f7', '#ec4899', '#8b5cf6'] },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="mb-8"><h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('settings')}</h1><p className="text-muted-foreground">{t('settings_subtitle')}</p></div>

      <GlassCard>
        <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"><Globe className="w-5 h-5 text-primary-foreground" /></div><div><h3 className="font-semibold">{t('language')}</h3><p className="text-sm text-muted-foreground">{t('select_language')}</p></div></div>
        <div className="grid grid-cols-3 gap-3">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={cn('p-4 rounded-xl border-2 transition-all duration-200 text-left', language === lang.code ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50 bg-muted/30')}><span className="text-2xl mb-2 block">{lang.flag}</span><span className="font-medium text-sm">{lang.label}</span>{language === lang.code && (<Check className="w-4 h-4 text-primary absolute top-2 right-2" />)}</button>))}</div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">{theme === 'dark' ? (<Moon className="w-5 h-5 text-secondary-foreground" />) : (<Sun className="w-5 h-5 text-secondary-foreground" />)}</div><div><h3 className="font-semibold">{t('theme')}</h3><p className="text-sm text-muted-foreground">{t('select_theme_mode')}</p></div></div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30"><div className="flex items-center gap-3"><Sun className="w-5 h-5 text-warning" /><span className="font-medium">{t('light_mode')}</span></div><Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} /><div className="flex items-center gap-3"><span className="font-medium">{t('dark_mode')}</span><Moon className="w-5 h-5 text-primary" /></div></div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center"><Palette className="w-5 h-5 text-accent-foreground" /></div><div><h3 className="font-semibold">{t('color_theme')}</h3><p className="text-sm text-muted-foreground">{t('select_color_theme')}</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{colorThemes.map((theme) => (<button key={theme.id} onClick={() => setColorTheme(theme.id)} className={cn('p-4 rounded-xl border-2 transition-all duration-200 text-left relative', colorTheme === theme.id ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50 bg-muted/30')}><div className="flex items-center gap-2 mb-2">{theme.colors.map((color, i) => (<div key={i} className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: color }} />))}</div><h4 className="font-medium">{t(`theme_${theme.id}`)}</h4><p className="text-xs text-muted-foreground">{t(`theme_${theme.id}_desc`)}</p>{colorTheme === theme.id && (<div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></div>)}</button>))}</div>
      </GlassCard>

      <GlassCard gradient="primary">
        <h3 className="font-semibold mb-4">{t('preview_appearance')}</h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium shadow-lg">{t('button_primary')}</button>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-secondary to-accent text-secondary-foreground font-medium shadow-lg">{t('button_secondary')}</button>
          <button className="px-4 py-2 rounded-xl bg-success text-success-foreground font-medium shadow-lg">{t('button_success')}</button>
          <button className="px-4 py-2 rounded-xl bg-warning text-warning-foreground font-medium shadow-lg">{t('button_warning')}</button>
        </div>
      </GlassCard>

      <GlassCard className="border-destructive/30 bg-destructive/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-destructive">{t('danger_zone')}</h3>
            <p className="text-sm text-muted-foreground">{t('manage_system_data')}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-background/50 border border-destructive/20">
          <div>
            <h4 className="font-medium text-foreground">{t('reset_system')}</h4>
            <p className="text-sm text-muted-foreground">{t('reset_system_desc')}</p>
          </div>
          <button
            onClick={() => {
              if (confirm(t('confirm_reset'))) {
                localStorage.clear();
                toast.success(t('system_reset_success'));
                setTimeout(() => window.location.reload(), 1000);
              }
            }}
            className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-medium shadow-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {t('clear_data')}
          </button>
        </div>
      </GlassCard>
    </div>);
};

export default Settings;
