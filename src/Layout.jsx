import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Calculator,
  Users,
  FolderKanban,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Shield,
  Share2,
  Search,
  LogOut,
  Bot,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import logo from "@/assets/apex-dev-gru-logo.png";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isHomePage = location.pathname === createPageUrl("Home") || location.pathname === "/";
  const isReferralPage = location.pathname.includes("partner-profit") || location.pathname.includes("/referrals/");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const navigationItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: LayoutDashboard,
      roles: ["owner", "manager"]
    },
    {
      title: "Quote Generator",
      url: createPageUrl("QuoteGenerator"),
      icon: Calculator,
      roles: ["owner", "manager"]
    },
    {
      title: "CRM Pipeline",
      url: createPageUrl("CRM"),
      icon: Users,
      roles: ["owner", "manager"]
    },
    {
      title: "Analytics",
      url: createPageUrl("Analytics"),
      icon: TrendingUp,
      roles: ["owner", "manager"]
    },
    {
      title: "Reports",
      url: createPageUrl("Reports"),
      icon: FolderKanban,
      roles: ["owner", "manager"]
    },
    {
      title: "Social Media",
      url: createPageUrl("Social"),
      icon: Share2,
      roles: ["owner", "manager"]
    },
    {
      title: "SEO",
      url: createPageUrl("SEO"),
      icon: Search,
      roles: ["owner", "manager"]
    },
    {
      title: "Referrals",
      url: createPageUrl("AdminReferralDashboard"),
      icon: Gift,
      roles: ["owner", "manager"]
    },
    {
      title: "AI Agents",
      url: createPageUrl("AIAgents"),
      icon: Bot,
      roles: ["owner"],
      ownerOnly: true
    },
    {
      title: "Client Portal",
      url: createPageUrl("ClientPortal"),
      icon: Shield,
      roles: ["owner", "manager", "client"]
    },
  ];

  const filteredNavItems = navigationItems.filter(item => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  const isActive = (url) => location.pathname === url;

  const handleLogout = () => {
    base44.auth.logout();
  };

  // Show simple layout for home page, referral pages, and lead gen page
  const isLeadGenPage = location.pathname.includes("LeadGenPage");
  if (isHomePage || isReferralPage || isLeadGenPage || !user) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex">
      <style>{`
        :root {
          --navy: #0b1d3a;
          --charcoal: #2d3748;
          --emerald: #10b981;
          --gold: #c8a559;
        }
        * {
          font-family: 'Inter', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
      `}</style>

      {/* Left Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b1d3a] shadow-2xl transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#1a3355]">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Apex Development Group Logo" className="w-10 h-10 rounded-lg shadow-lg object-contain" />
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight">
                  Apex Development Group
                </h1>
                <p className="text-[#c8a559] text-xs">Command Center</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.url)
                      ? 'bg-[#1a3355] text-white shadow-lg'
                      : 'text-slate-300 hover:bg-[#1a3355]/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.url) ? 'text-[#c8a559]' : 'group-hover:text-[#c8a559]'}`} />
                  <span className="font-medium text-sm">{item.title}</span>
                  {item.ownerOnly && (
                    <span className="ml-auto text-xs bg-[#c8a559] text-[#0b1d3a] px-2 py-0.5 rounded font-bold">
                      OWNER
                    </span>
                  )}
                  {isActive(item.url) && (
                    <ChevronRight className="w-4 h-4 ml-auto text-[#c8a559]" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-[#1a3355]">
            <div className="bg-[#1a3355] rounded-lg p-3 mb-3">
              <p className="text-white font-medium text-sm truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-[#c8a559] text-xs capitalize">
                {user?.role || 'Member'}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-slate-300 hover:text-white hover:bg-[#1a3355] justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#0b1d3a] text-white hover:bg-[#1a3355]"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}