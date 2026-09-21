function AssetBreakdownCard({
  asset,
  isLoading = false,
  onClick,
}) {
  const Icon = asset?.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        rounded-2xl
        border
        border-slate-700/80
        bg-slate-800
        px-3
        py-2.5
        text-left
        transition-all
        duration-200

        hover:border-slate-600
        hover:bg-slate-750

        active:scale-[0.99]

        focus:outline-none
        focus:ring-2
        focus:ring-slate-500/40
      "
    >
      {/* =============================
          TOP BAR
      ============================== */}

      <div
        className="
          flex
          items-center
          gap-2.5
        "
      >
        {/* LOGO */}

        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            ${asset?.iconClass || ""}
          `}
        >
          {Icon && (
            <Icon
              size={18}
              strokeWidth={2.2}
            />
          )}
        </div>

        {/* TITLE */}

        <h3
          className="
            min-w-0
            flex-1
            truncate
            text-sm
            font-bold
            tracking-tight
            text-slate-100
          "
        >
          {asset?.name || "-"}
        </h3>

        {/* HOLDINGS */}

        <span
          className="
            shrink-0
            rounded-full
            border
            border-slate-600/60
            bg-slate-900/50
            px-2
            py-1
            text-[10px]
            font-semibold
            text-slate-300
          "
        >
          {isLoading
            ? "Loading..."
            : `${asset?.holdings || 0} ${
                asset?.holdings === 1
                  ? "holding"
                  : "holdings"
              }`}
        </span>
      </div>

      {/* =============================
          BOTTOM BAR
      ============================== */}

      <div
        className="
          mt-1.5
          flex
          items-center
        "
      >
        {/* AMOUNT */}

        <div
          className="
            flex-1
            text-center
          "
        >
          <p
            className="
              text-xl
              font-bold
              tracking-tight
              tabular-nums
              text-yellow-400
            "
            style={{
              fontFamily: "Calibri, Arial, sans-serif",
            }}
          >
            {isLoading
              ? "Loading..."
              : asset?.formattedValue || "—"}
          </p>
        </div>

        {/* ARROW */}

        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            text-slate-500
            transition-all
            duration-200

            group-hover:bg-slate-700
            group-hover:text-slate-200
            group-hover:translate-x-0.5
          "
        >
          →
        </div>
      </div>
    </button>
  );
}

export default AssetBreakdownCard;