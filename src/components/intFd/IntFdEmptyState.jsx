import {
  Landmark,
  Plus,
} from "lucide-react";

export default function IntFdEmptyState({
  onAdd,
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-dashed
        border-slate-700
        bg-slate-950
        px-6
        py-12
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-slate-800
          text-slate-300
        "
      >
        <Landmark size={25} />
      </div>

      <h3
        className="
          mt-4
          text-lg
          font-bold
          text-white
        "
      >
        No Fixed Deposits
      </h3>

      <p
        className="
          mx-auto
          mt-1.5
          max-w-xs
          text-sm
          leading-6
          text-slate-500
        "
      >
        Add your first FD to start
        tracking principal and
        interest.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-2xl
          bg-white
          px-5
          py-3
          text-sm
          font-bold
          text-slate-950
          transition
          hover:bg-slate-200
          active:scale-95
        "
      >
        <Plus size={17} />
        Add FD
      </button>
    </div>
  );
}