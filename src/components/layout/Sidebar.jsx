import {
  LayoutDashboard,
  PieChart,
  Settings,
  WalletCards,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/portfolio",
    label: "Portfolio",
    icon: PieChart,
  },
  {
    to: "/transactions",
    label: "Transactions",
    icon: WalletCards,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:block">

      <nav className="space-y-1">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />

              <span>
                {item.label}
              </span>

            </NavLink>
          );
        })}

      </nav>

    </aside>
  );
}

export default Sidebar;