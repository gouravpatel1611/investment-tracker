import {
  LayoutDashboard,
  PieChart,
  Settings,
  UserRound,
  WalletCards,
  X,
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

function MobileMenu({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">

      <button
        className="absolute inset-0 bg-slate-950/40"
        onClick={onClose}
      />

      <aside className="relative h-full w-80 max-w-[88%] bg-white p-5 shadow-2xl">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
              <UserRound size={17} />
            </span>

            <p className="font-bold">
              Investment Tracker
            </p>

          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        <nav className="mt-8 space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={19} />

                {item.label}

              </NavLink>
            );
          })}

        </nav>

      </aside>

    </div>
  );
}

export default MobileMenu;