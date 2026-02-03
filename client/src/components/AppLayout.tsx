import { cn } from "@/lib/utils";
import { Bot, History, Inbox, Settings, Users } from "lucide-react";
import { Link, useLocation } from "wouter";

/*
 * AppLayout - Main application shell
 * 
 * Design: v1-style sidebar with text labels (clearer navigation)
 * Combined with v4 white theme and agent-centric flow
 */

const mainNavItems = [
  { href: "/", icon: Bot, label: "Workers" },
  { href: "/inbox", icon: Inbox, label: "Inbox", badge: 12 },
  { href: "/activity", icon: History, label: "Activity" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const teamNavItems = [
  { href: "/members", icon: Users, label: "Members" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">M</span>
          </div>
          <span className="font-semibold text-foreground">Milo</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = location === item.href || 
                (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Team Section */}
          <div className="mt-8">
            <div className="px-3 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Team
              </span>
            </div>
            <div className="space-y-1">
              {teamNavItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden bg-background">
        {children}
      </main>
    </div>
  );
}
