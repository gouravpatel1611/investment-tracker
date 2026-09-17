import {
  Pencil,
  Plus,
  Trash2,
  UserRound,
  ArrowLeft,
} from "lucide-react";



import {
  useState,
} from "react";

import {
  useInvestors,
} from "../../context/InvestorContext";

function Investors() {
  const {
    investors,
    loading,
    error,
    createInvestor,
    editInvestor,
    removeInvestor,
  } = useInvestors();

  const [
    name,
    setName,
  ] = useState("");

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  function resetForm() {
    setName("");
    setEditingId(null);
    setFormError("");
  }

  function startEdit(investor) {
    setEditingId(investor.id);
    setName(investor.name);
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const investorName =
      name.trim();

    if (!investorName) {
      setFormError(
        "Investor name is required."
      );
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      if (editingId) {
        await editInvestor(
          editingId,
          investorName
        );
      } else {
        await createInvestor(
          investorName
        );
      }

      resetForm();
    } catch (error) {
      console.error(error);

      setFormError(
        error?.message ||
          "Unable to save investor."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(investor) {
    const confirmed =
      window.confirm(
        `Delete investor "${investor.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await removeInvestor(
        investor.id
      );

      if (
        editingId === investor.id
      ) {
        resetForm();
      }
    } catch (error) {
      console.error(error);

      setFormError(
        error?.message ||
          "Unable to delete investor."
      );
    }
  }

  return (
    <div className="min-h-screen bg-white  py-5 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div
        className="
            mb-5
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            px-4
            shadow-lg
            sm:p-5
        "
        >
        <div className="flex items-center gap-3">

            <button
            type="button"
            onClick={() => window.history.back()}
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
                bg-slate-800
                text-slate-300
                transition
                hover:bg-slate-700
                hover:text-white
            "
            aria-label="Go back"
            >
            <ArrowLeft size={19} />
            </button>

            <div className="min-w-0">
            <h1
                className="
                text-xl
                font-bold
                tracking-tight
                text-white
                sm:text-2xl
                "
            >
                Investors
            </h1>

            <p className="mt-1 text-sm text-slate-400">
                Add and manage your investment investors
            </p>
            </div>

        </div>
        </div>

        {/* Add / Edit Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-5">

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              {editingId ? (
                <Pencil size={19} />
              ) : (
                <Plus size={20} />
              )}
            </div>

            <div>
              <h2 className="text-base font-bold">
                {editingId
                  ? "Edit Investor"
                  : "Add Investor"}
              </h2>

              <p className="text-xs text-slate-500">
                {editingId
                  ? "Update investor name"
                  : "Create a new investor"}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <div>
              <label
                htmlFor="investor-name"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Investor Name
              </label>

              <input
                id="investor-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Enter investor name"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-800
                  px-4
                  text-sm
                  font-medium
                  text-white
                  outline-none
                  placeholder:text-slate-500
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/20
                "
              />
            </div>

            {(formError || error) && (
              <p className="text-sm text-red-400">
                {formError || error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="
                  flex
                  h-11
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-purple-600
                  px-4
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-purple-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {editingId ? (
                  <Pencil size={16} />
                ) : (
                  <Plus size={17} />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Investor"
                    : "Add Investor"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="
                    h-11
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-800
                    px-5
                    text-sm
                    font-semibold
                    text-slate-300
                    hover:bg-slate-700
                  "
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Investor List */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
            <div>
              <h2 className="text-base font-bold">
                Investor List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {investors.length} investor
                {investors.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              Loading investors...
            </div>
          ) : investors.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <UserRound
                size={30}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="text-sm font-semibold text-slate-400">
                No investors added
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Add your first investor above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {investors.map(
                (investor) => (
                  <div
                    key={investor.id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      px-4
                      py-3.5
                    "
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                        <UserRound size={17} />
                      </div>

                      <p className="truncate text-sm font-semibold text-white">
                        {investor.name}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(
                            investor
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          transition
                          hover:bg-slate-800
                          hover:text-purple-400
                        "
                        aria-label={`Edit ${investor.name}`}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            investor
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          transition
                          hover:bg-red-500/10
                          hover:text-red-400
                        "
                        aria-label={`Delete ${investor.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Investors;