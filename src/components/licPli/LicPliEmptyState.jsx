import {
  ShieldCheck,
} from "lucide-react";

export default function LicPliEmptyState() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-dashed
        border-slate-700
        bg-slate-900/60
        px-5
        py-10
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-indigo-500/10
          text-indigo-400
        "
      >
        <ShieldCheck size={24} />
      </div>

      <h3
        className="
          mt-3
          text-sm
          font-bold
          text-white
        "
      >
        No Policies Added
      </h3>

      <p
        className="
          mx-auto
          mt-1
          max-w-[260px]
          text-xs
          leading-5
          text-slate-500
        "
      >
        Add your LIC, PLI or other insurance
        policy to start tracking premiums.
      </p>
    </div>
  );
}