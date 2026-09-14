
import {
  ArrowLeft,
  Plus,
} from "lucide-react";

import {
  useIntFd,
} from "../../context/IntFdContext";

import IntFdSummaryCard from "../../components/intFd/IntFdSummaryCard";

import IntFdCard from "../../components/intFd/IntFdCard";

import IntFdEmptyState from "../../components/intFd/IntFdEmptyState";

export default function IntFd() {
  const {
    fds,
    deleteFd,
    startEditing,
  } = useIntFd();

  function handleAdd() {
    window.location.href =
      "/int-fd/add";
  }

  function handleEdit(fd) {
    startEditing(fd);

    window.location.href =
      `/int-fd/edit/${fd.id}`;
  }

  return (
    <main
      className="
        min-h-screen
        pb-10
        pt-5
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
        "
      >
        {/* Page Header */}

        <div
          className="
            mb-5
            overflow-hidden
            rounded-3xl
            border
            border-slate-700
            bg-slate-950
            shadow-xl
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              px-4
              py-2
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >
              {/* Back Button */}
              <button
                type="button"
                onClick={() =>
                  (window.location.href =
                    "/")
                }
                aria-label="Back"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-900
                  text-slate-300
                  transition
                  hover:bg-slate-800
                  hover:text-white
                  active:scale-95
                "
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-slate-500
                  "
                >
                  Investments
                </p>

                <h1
                  className="
                    mt-1
                    truncate
                    text-xl
                    font-bold
                    tracking-tight
                    text-white
                  "
                >
                  INT-FD
                </h1>
              </div>
            </div>

            {/* Add FD */}
            <button
              type="button"
              onClick={handleAdd}
              className="
                flex
                h-11
                shrink-0
                items-center
                gap-2
                rounded-2xl
                bg-white
                px-3
                text-sm
                font-bold
                text-slate-950
                shadow-lg
                shadow-black/20
                transition
                hover:bg-slate-200
                active:scale-95
              "
            >
              <Plus size={18} />

              <span className="hidden sm:inline">
                Add FD
              </span>
            </button>
          </div>
        </div>


        {/* Summary */}
        <IntFdSummaryCard
          fds={fds}
        />

        {/* FD List */}
        <section className="mt-6">
          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >
            <h2
              className="
                text-base
                font-bold
                text-dark
              "
            >
              Your Fixed Deposits
            </h2>

            <span
              className="
                rounded-full
                bg-slate-800
                px-2.5
                py-1
                text-xs
                font-semibold
                text-white
              "
            >
              {fds.length}
            </span>
          </div>

          {fds.length === 0 ? (
            <IntFdEmptyState
              onAdd={handleAdd}
            />
          ) : (
            <div
              className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
              "
            >
              {fds.map((fd) => (
                <IntFdCard
                  key={fd.id}
                  fd={fd}
                  onEdit={handleEdit}
                  onDelete={deleteFd}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}