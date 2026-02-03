import { cn } from "@/lib/utils";
import { Bot, History, Inbox, Settings, Users, ChevronDown, LogOut, User, Bell } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

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

        {/* User Profile Section with Dropdown - matching v1 implementation */}
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                    SC
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">Sarah Chen</p>
                  <p className="text-xs text-muted-foreground">Finance Ops</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => toast.info("Profile settings coming soon")}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Notification preferences coming soon")}>
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => toast.info("Sign out coming soon")}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden bg-background">
        {children}
      </main>
    </div>
  );
}
