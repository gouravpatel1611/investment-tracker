import {
  CircleDollarSign,
  Plus,
} from "lucide-react";


function VortaxaEmptyState({
  onAdd,
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-dashed
        border-slate-700
        bg-slate-900/50
        px-4
        py-10
        text-center
      "
    >

      <CircleDollarSign
        className="
          mx-auto
          h-8
          w-8
          text-slate-600
        "
      />


      <p
        className="
          mt-3
          text-sm
          font-bold
          text-slate-300
        "
      >
        No Vortaxa investment
      </p>


      <p
        className="
          mt-1
          text-xs
          text-slate-500
        "
      >
        Add your first Vortaxa investment.
      </p>


      <button
        type="button"
        onClick={onAdd}
        className="
          mt-4
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-purple-600
          px-4
          py-2.5
          text-sm
          font-bold
          text-white
          transition
          hover:bg-purple-500
        "
      >

        <Plus
          className="h-4 w-4"
        />

        Add Vortaxa

      </button>

    </div>

  );

}


export default VortaxaEmptyState;