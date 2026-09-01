import {
  Menu,
  TrendingUp,
} from "lucide-react";

import { useState } from "react";

import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
              <TrendingUp size={20} />
            </div>

            <div>
              <p className="text-sm font-bold leading-none">
                Investment Tracker
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Personal portfolio
              </p>
            </div>

          </div>

          <div className="flex items-center">
            <UserMenu />
          </div>

        </div>

      </header>

      {menuOpen && (
        <MobileMenu
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Header;