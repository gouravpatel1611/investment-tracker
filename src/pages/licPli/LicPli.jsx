import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import LicPliTopBar from "../../components/licPli/LicPliTopBar";
import LicPliSummaryCard from "../../components/licPli/LicPliSummaryCard";
import LicPliCard from "../../components/licPli/LicPliCard";
import LicPliEmptyState from "../../components/licPli/LicPliEmptyState";

import LicPliForm from "./LicPliForm";

import {
  useLicPli,
} from "../../context/LicPliContext";

import {
  calculateSummary,
} from "../../utils/licPli/licPliCalculations";

export default function LicPli() {
  const navigate = useNavigate();

  const {
    policies,
    deletePolicy,
  } = useLicPli();

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingPolicy,
    setEditingPolicy,
  ] = useState(null);

  const summary = useMemo(
    () => calculateSummary(policies),
    [policies]
  );

  function handleAdd() {
    setEditingPolicy(null);
    setShowForm(true);
  }

  function handleEdit(policy) {
    setEditingPolicy(policy);
    setShowForm(true);
  }

  function handleDelete(policy) {
    const confirmed =
      window.confirm(
        `Delete policy "${policy?.schemeName || ""}"?`
      );

    if (confirmed) {
      deletePolicy(policy.id);
    }
  }

  function closeForm() {
    setShowForm(false);
    setEditingPolicy(null);
  }

  return (
    <main
      className="
        min-h-screen
        py-4
        text-white
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-3xl
        "
      >
        <LicPliTopBar
          onBack={() => navigate(-1)}
          onAdd={handleAdd}
        />

        {showForm ? (
          <LicPliForm
            editingPolicy={editingPolicy}
            onClose={closeForm}
          />
        ) : (
          <>
            <LicPliSummaryCard
              summary={summary}
            />

            {policies.length === 0 ? (
              <LicPliEmptyState />
            ) : (
              <div
                className="
                  space-y-3
                "
              >
                {policies.map((policy) => (
                  <LicPliCard
                    key={policy.id}
                    policy={policy}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}