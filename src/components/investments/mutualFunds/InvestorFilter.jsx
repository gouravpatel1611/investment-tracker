import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Users,
  UserRound,
} from "lucide-react";

function InvestorFilter({
  investors,
  selectedInvestor,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected =
    selectedInvestor === "all"
      ? {
          id: "all",
          name: "All Investors",
        }
      : investors.find(
          (investor) => investor.id === selectedInvestor
        );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSelect = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full sm:w-auto"
    >
      {/* SELECTOR */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          group
          flex
          w-full
          items-center
          gap-3
          rounded-2xl
          border
          border-slate-700/80
          bg-slate-800
          px-3
          py-2.5
          text-left
          shadow-sm
          transition-all
          duration-200

          hover:border-slate-600
          hover:bg-slate-750

          focus:outline-none
          focus:ring-2
          focus:ring-purple-500/20

          sm:min-w-[220px]
        "
      >
        {/* ICON */}
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-purple-500/15
            text-purple-300
          "
        >
          {selectedInvestor === "all" ? (
            <Users size={18} />
          ) : (
            <UserRound size={18} />
          )}
        </div>

        {/* TEXT */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Viewing
          </p>

          <p className="truncate text-sm font-bold text-slate-100">
            {selected?.name || "Select Investor"}
          </p>
        </div>

        {/* ARROW */}
        <ChevronDown
          size={17}
          className={`
            shrink-0
            text-slate-500
            transition-transform
            duration-200
            ${open ? "rotate-180 text-slate-300" : ""}
          `}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-2
            w-full
            overflow-hidden
            rounded-2xl
            border
            border-slate-700/80
            bg-slate-900
            p-1.5
            shadow-2xl
            shadow-black/30

            sm:w-[260px]
          "
        >
          {/* HEADER */}
          <div className="px-3 pb-2 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Select Investor
            </p>
          </div>

          {/* ALL */}
          <button
            type="button"
            onClick={() => handleSelect("all")}
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              transition-colors

              ${
                selectedInvestor === "all"
                  ? "bg-purple-500/10"
                  : "hover:bg-slate-800"
              }
            `}
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-purple-500/15
                text-purple-300
              "
            >
              <Users size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-100">
                All Investors
              </p>

              <p className="text-[11px] text-slate-500">
                Combined portfolio
              </p>
            </div>

            {selectedInvestor === "all" && (
              <Check
                size={17}
                className="text-purple-400"
              />
            )}
          </button>

          {/* DIVIDER */}
          <div className="my-1.5 h-px bg-slate-800" />

          {/* INVESTORS */}
          {investors.map((investor) => {
            const isSelected =
              selectedInvestor === investor.id;

            const initial =
              investor.name?.charAt(0)?.toUpperCase() ||
              "?";

            return (
              <button
                key={investor.id}
                type="button"
                onClick={() =>
                  handleSelect(investor.id)
                }
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-left
                  transition-colors

                  ${
                    isSelected
                      ? "bg-purple-500/10"
                      : "hover:bg-slate-800"
                  }
                `}
              >
                {/* AVATAR */}
                <div
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-xs
                    font-extrabold

                    ${
                      isSelected
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-slate-800 text-slate-400"
                    }
                  `}
                >
                  {initial}
                </div>

                {/* NAME */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      truncate
                      text-sm
                      font-bold
                      ${
                        isSelected
                          ? "text-purple-300"
                          : "text-slate-200"
                      }
                    `}
                  >
                    {investor.name}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Mutual Fund Portfolio
                  </p>
                </div>

                {/* CHECK */}
                {isSelected && (
                  <Check
                    size={17}
                    className="text-purple-400"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InvestorFilter;