import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useData } from '@/hooks/useData';
import { Bell, Search, Sun, Moon, Globe, Check, Info, AlertTriangle, CheckCircle, XCircle, Menu, Building2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { t, theme, setTheme, language, setLanguage, user, currentBranch, setCurrentBranch } = useApp();
  const { notifications, markAsRead, markAllAsRead, branches } = useData();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('good_morning');
    if (hour < 18) return t('good_afternoon');
    return t('good_evening');
  };

  const languages = [
    { code: 'uz' as const, label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => n.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-20 p-4 lg:p-6 pb-0 lg:pb-6">
      <GlassCard padding="sm" className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-foreground">
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('search') + '...'}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Branch Selector for Super Admin */}
          {(user?.role === 'superadmin' || !user?.branchId) && (
            <div className="hidden md:block mr-2">
              <Select
                value={currentBranch}
                onValueChange={setCurrentBranch}
              >
                <SelectTrigger className="w-[180px] h-10 rounded-xl bg-muted/50 border-border/50">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_branches') || "Barcha filiallar"}</SelectItem>
                  {branches.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Branch Indicator for Directors/Others */}
          {user?.branchId && (
            <div className="hidden md:flex items-center gap-2 mr-4 px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                {branches.find(b => b.id === user.branchId)?.name || 'My Branch'}
              </span>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
                <Globe className="w-5 h-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border/50">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? 'bg-primary/10 text-primary' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-xl hover:bg-muted/50 transition-colors relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-card border-border/50 shadow-xl rounded-xl">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h4 className="font-semibold">{t('notifications')}</h4>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                    onClick={() => user && markAllAsRead(user.id)}
                  >
                    {t('mark_all_read')}
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px]">
                {userNotifications.length > 0 ? (
                  <div className="py-2">
                    {userNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border/50 last:border-0 ${!notification.read ? 'bg-primary/5' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </p>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                {notification.date}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 opacity-20 mb-2" />
                    <p className="text-sm">{t('no_notifications')}</p>
                  </div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </GlassCard>
    </header>
  );
};
