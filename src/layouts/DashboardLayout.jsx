import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  ClipboardCheck,
  BookOpen,
  UserCircle2,
  Sparkles,
  History,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyzer", label: "JD Analyzer", icon: Sparkles },
  { to: "/history", label: "History", icon: History },
  { to: "/practice", label: "Practice", icon: Code2 },
  { to: "/assessments", label: "Assessments", icon: ClipboardCheck },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
        ].join(" ")
      }
      end
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  );
}

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto flex w-full flex-col md:flex-row">
        <aside className="border-b border-slate-200 bg-white/70 p-4 backdrop-blur md:min-h-screen md:w-64 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between md:block">
            <div className="text-sm font-semibold tracking-tight text-slate-950">
              Placement Prep
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-200" aria-hidden="true" />
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto md:mt-8 md:flex-col md:overflow-visible">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Placement Prep
                </p>
                <p className="mt-1 text-base font-semibold tracking-tight text-slate-950">
                  Dashboard
                </p>
              </div>
              <div
                className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                aria-label="User avatar"
                title="User"
              >
                U
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

