import { cn } from "@/lib/utils";
import { Bot, History, Inbox, Plus, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

/*
 * AppLayout - Main application shell
 * 
 * Design: Dark sidebar with minimal navigation
 * Inspired by existing Milo prototype's clean structure
 */

const navItems = [
  { href: "/", icon: Bot, label: "Agents" },
  { href: "/inbox", icon: Inbox, label: "Inbox", badge: 3 },
  { href: "/activity", icon: History, label: "Activity" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4">
        {/* Logo */}
        <Link href="/">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
            <span className="text-lg font-bold text-primary">M</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={cn(
                    "relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-warning text-[10px] font-medium text-background flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/settings">
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
