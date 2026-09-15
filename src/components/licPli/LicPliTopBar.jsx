
import {
  ArrowLeft,
  Plus,
  ShieldCheck,
} from "lucide-react";

export default function LicPliTopBar({
  onBack,
  onAdd,
}) {
  return (
    <div
      className="
        relative
        mb-4
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-gradient-to-br
        from-slate-900
        via-slate-900
        to-slate-950
        p-3
        shadow-xl
      "
    >
      {/* Subtle Background Glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-24
          w-24
          rounded-full
          bg-indigo-500/10
          blur-2xl
        "
      />

      <div
        className="
          relative
          flex
          items-center
          gap-2.5
        "
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-slate-700
            bg-slate-800/80
            text-slate-300
            transition
            hover:bg-slate-700
            active:scale-95
          "
        >
          <ArrowLeft size={17} />
        </button>

        {/* Icon */}
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-indigo-500/20
            bg-indigo-500/10
            text-indigo-400
          "
        >
          <ShieldCheck size={18} />
        </div>

        {/* Title */}
        <div className="min-w-0 flex-1">
          <h1
            className="
              truncate
              text-[15px]
              font-bold
              tracking-tight
              text-white
            "
          >
            LIC / PLI
          </h1>

          <p
            className="
              mt-0.5
              text-[10px]
              text-slate-500
            "
          >
            Insurance Policies
          </p>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={onAdd}
          className="
            flex
            h-9
            shrink-0
            items-center
            gap-1.5
            rounded-xl
            border
            border-indigo-400/20
            bg-indigo-500/15
            px-2.5
            text-xs
            font-bold
            text-indigo-300
            transition
            hover:bg-indigo-500/25
            active:scale-95
          "
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
