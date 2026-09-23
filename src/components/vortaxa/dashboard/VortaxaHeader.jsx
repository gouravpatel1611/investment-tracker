import {
  ArrowLeft,
  Plus,
} from "lucide-react";


function VortaxaHeader({
  onBack,
  onAdd,
}) {

  return (

    <div
      className="
        mb-5
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-slate-800
        bg-slate-900/80
        px-4
        py-3
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

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
            rounded-lg
            border
            border-slate-700
            bg-slate-800
            text-slate-300
            transition
            hover:bg-slate-700
            hover:text-white
          "
        >

          <ArrowLeft
            className="h-4 w-4"
          />

        </button>


        <div>

          <h1
            className="
              text-lg
              font-bold
              tracking-tight
              text-white
            "
          >
            Vortaxa
          </h1>


          <p
            className="
              text-xs
              text-slate-400
            "
          >
            Manage Vortaxa investments
          </p>

        </div>

      </div>


      <button
        type="button"
        onClick={onAdd}
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-slate-800
          text-slate-300
          transition
          hover:bg-slate-700
          hover:text-white
        "
      >

        <Plus
          className="h-5 w-5"
        />

      </button>

    </div>

  );

}


export default VortaxaHeader;