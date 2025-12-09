import { LayoutGrid, Receipt, History, Settings, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

interface POSSidebarProps {
  activeTab: 'tables' | 'history';
  onTabChange: (tab: 'tables' | 'history') => void;
}

export function POSSidebar({ activeTab, onTabChange }: POSSidebarProps) {
  const navItems = [
    { id: 'tables' as const, label: 'Open Tables', icon: LayoutGrid },
    { id: 'history' as const, label: 'Order History', icon: History },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">TablePOS</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
