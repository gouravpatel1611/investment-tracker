
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
        p-3
        text-left
        shadow-sm
        transition-all
        duration-200

        hover:border-slate-600
        hover:bg-slate-750
        hover:shadow-md

        active:scale-[0.99]

        focus:outline-none
        focus:ring-2
        focus:ring-slate-500/40
      "
    >
      {/* =============================
          TOP
      ============================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          {/* ICON */}

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
              border-white/5
              ${asset?.iconClass || ""}
            `}
          >
            {Icon && (
              <Icon
                size={18}
                strokeWidth={2}
              />
            )}
          </div>

          {/* NAME + TYPE */}

          <div
            className="
              min-w-0
            "
          >
            <h3
              className="
                truncate
                text-sm
                font-extrabold
                tracking-tight
                text-slate-50
              "
            >
              {asset?.name || "-"}
            </h3>

            <p
              className="
                mt-1
                truncate
                text-[11px]
                font-medium
                text-slate-400
              "
            >
              {asset?.type || "-"}

              {" · "}

              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  {asset?.holdings || 0}{" "}
                  {asset?.holdings === 1
                    ? "holding"
                    : "holdings"}
                </>
              )}
            </p>
          </div>
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

            group-hover:translate-x-0.5
            group-hover:text-slate-300
          "
        >
          →
        </div>
      </div>

      {/* =============================
          VALUE
      ============================== */}

      <div
        className="
          mt-2.5
        "
      >
        <p
          className="
            text-sm
            font-extrabold
            tracking-tight
            text-slate-50
          "
        >
          {isLoading
            ? "Loading..."
            : asset?.formattedValue || "—"}
        </p>
      </div>
    </button>
  );
}

export default AssetBreakdownCard;

