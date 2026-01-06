import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  UserCheck,
  Utensils,
  Syringe,
  PlayCircle,
  Warehouse,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Baby,
  Bed,
  ClipboardList,
  UserPlus,
  MessageSquare,
  QrCode,
  Menu,
  X,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'super_dashboard', path: '/super-dashboard', roles: ['superadmin'] },
  { icon: Building2, label: 'crm_management', path: '/crm-management', roles: ['superadmin'] },
  { icon: LayoutDashboard, label: 'dashboard', path: '/dashboard', roles: ['director', 'admin', 'teacher'] },
  { icon: Building2, label: 'branches', path: '/branches', roles: ['director', 'admin'] },
  { icon: Users, label: 'groups', path: '/groups', roles: ['director', 'admin', 'teacher'] },
  { icon: GraduationCap, label: 'students', path: '/students', roles: ['director', 'admin', 'teacher', 'parent'] },
  { icon: UserCheck, label: 'teachers', path: '/teachers', roles: ['director', 'admin'] },

  { icon: Utensils, label: 'meals', path: '/meals', roles: ['director', 'admin', 'teacher'] },
  { icon: Syringe, label: 'vaccination', path: '/vaccination', roles: ['director', 'admin', 'parent'] },
  { icon: PlayCircle, label: 'activities', path: '/activities', roles: ['director', 'admin', 'teacher'] },
  { icon: Bed, label: 'sleep', path: '/sleep', roles: ['director', 'admin', 'teacher'] },
  { icon: ClipboardList, label: 'homework', path: '/homework', roles: ['director', 'admin', 'teacher', 'parent'] },
  { icon: Warehouse, label: 'warehouse', path: '/warehouse', roles: ['director', 'admin'] },
  { icon: Wallet, label: 'finance', path: '/finance', roles: ['director', 'admin'] },
  { icon: MessageSquare, label: 'complaints', path: '/complaints', roles: ['director', 'admin', 'parent'] },
  { icon: QrCode, label: 'qr_code', path: '/qr-code', roles: ['director', 'admin', 'teacher', 'parent'] },
  { icon: Users, label: 'users', path: '/users', roles: ['director', 'admin'] },
  { icon: Settings, label: 'settings', path: '/settings', roles: ['director', 'admin', 'teacher', 'parent'] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { t, user, logout } = useApp();

  const filteredItems = sidebarItems.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  const NavContent = ({ collapsed }: { collapsed: boolean }) => (
    <TooltipProvider delayDuration={0}>
      <div className={cn("p-4 border-b border-border/50", collapsed && "flex justify-center p-2")}>
        <Link to="/dashboard" className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg flex-shrink-0">
            <Baby className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Yulduzcha</h1>
              <p className="text-xs text-muted-foreground truncate">Bog'cha CRM</p>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          let label = item.label;
          if (item.label === 'students' && user?.role === 'parent') {
            label = 'my_children';
          }

          return (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', !isActive && 'group-hover:text-primary')} />
                  {!collapsed && <span className="text-sm font-medium truncate">{t(label)}</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>{t(label)}</p>
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className={cn('flex items-center gap-3 mb-3', collapsed && 'justify-center')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-secondary-foreground font-medium shadow-lg flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={logout}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200',
                'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
                collapsed && 'justify-center px-2'
              )}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{t('logout')}</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              <p>{t('logout')}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card/80 backdrop-blur-2xl border-r border-border/10 flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50"
        >
          <X className="w-5 h-5" />
        </button>
        <NavContent collapsed={false} />
      </aside>

      <aside
        className={cn(
          'hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col bg-card/80 backdrop-blur-2xl border-r border-border/10 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <NavContent collapsed={isCollapsed} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border/20 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      <div className={cn('hidden lg:block flex-shrink-0 transition-all duration-300', isCollapsed ? 'w-20' : 'w-64')} />
    </>
  );
};
