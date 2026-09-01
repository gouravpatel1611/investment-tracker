import {
  LogOut,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/firebase/authService";

function UserMenu() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [open]);

  const handleLogout = async () => {
    const confirmed = window.confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmed) {
        return;
    }

    try {
        setLoggingOut(true);
        await logoutUser();
        navigate("/login", { replace: true });
    } catch (error) {
        console.error("Logout failed:", error);
        setLoggingOut(false);
    }
};

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const email = user?.email || "";

  const initial = displayName
    .charAt(0)
    .toUpperCase();

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* User Button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 transition hover:bg-slate-50 active:scale-[0.98]"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
          {initial}
        </span>

        <span className="hidden max-w-[120px] truncate text-sm font-semibold sm:block">
          {displayName}
        </span>

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`hidden text-slate-400 transition-transform sm:block ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">

          {/* User Info */}
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {displayName}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close menu"
              >
                <X size={15} />
              </button>

            </div>
          </div>

          {/* Menu */}
          <div className="p-2">

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/settings");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100">
                <UserRound size={16} />
              </span>

              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/settings");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100">
                <Settings size={16} />
              </span>

              <span>Settings</span>
            </button>

            <div className="my-2 h-px bg-slate-100" />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50">
                <LogOut size={16} />
              </span>

              <span>
                {loggingOut
                  ? "Signing out..."
                  : "Logout"}
              </span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;