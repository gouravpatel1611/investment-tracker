import {
  Bell,
  ChevronRight,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react";

const settings = [
  {
    title: "Profile",
    subtitle: "Manage your personal details",
    icon: UserRound,
  },
  {
    title: "Notifications",
    subtitle: "Price and portfolio alerts",
    icon: Bell,
  },
  {
    title: "Preferences",
    subtitle: "Currency, theme and display",
    icon: SettingsIcon,
  },
];

function Settings() {
  return (
    <div className="space-y-5">

      <div>

        <p className="text-sm text-slate-500">
          Account
        </p>

        <h1 className="page-title mt-1">
          Settings
        </h1>

      </div>

      <div className="surface overflow-hidden">

        {settings.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="flex w-full items-center gap-4 border-b border-slate-100 p-5 text-left last:border-0 hover:bg-slate-50"
            >

              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">
                <Icon size={18} />
              </span>

              <span className="min-w-0 flex-1">

                <span className="block text-sm font-bold">
                  {item.title}
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  {item.subtitle}
                </span>

              </span>

              <ChevronRight
                size={18}
                className="text-slate-400"
              />

            </button>
          );
        })}

      </div>

    </div>
  );
}

export default Settings;