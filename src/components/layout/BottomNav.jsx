import {
  LayoutDashboard,
  PieChart,
  Plus,
  UserRound,
  WalletCards,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function BottomNav({ onAdd }) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 backdrop-blur lg:hidden">

      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">

        <NavItem
          to="/"
          label="Home"
          icon={LayoutDashboard}
          end
        />

        <NavItem
          to="/portfolio"
          label="Portfolio"
          icon={PieChart}
        />

        {/* ADD */}
        <button
          type="button"
          onClick={onAdd}
          className="flex min-h-14 flex-col items-center justify-center text-[11px] font-semibold text-white"
        >
          <span className="grid h-11 w-11 -translate-y-3 place-items-center rounded-2xl bg-slate-900 shadow-lg transition active:scale-90">
            <Plus size={23} />
          </span>

          <span className="-mt-2 text-slate-500">
            Add
          </span>
        </button>

        <NavItem
          to="/transactions"
          label="History"
          icon={WalletCards}
        />

        <NavItem
          to="/settings"
          label="Me"
          icon={UserRound}
        />

      </div>

    </nav>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  end = false,
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex min-h-14 flex-col items-center justify-center rounded-xl text-[11px] font-semibold ${
          isActive
            ? "text-slate-900"
            : "text-slate-400"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            strokeWidth={
              isActive ? 2.5 : 2
            }
          />

          <span className="mt-1">
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

export default BottomNav;