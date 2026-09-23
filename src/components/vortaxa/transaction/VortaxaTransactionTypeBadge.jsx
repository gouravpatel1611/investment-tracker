import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";


/* =========================================================
   TRANSACTION TYPE INFO
========================================================= */

function getTransactionTypeInfo(type) {
  switch (type) {
    case "INITIAL":
      return {
        label: "Initial",
        icon: CircleDollarSign,
        className:
          "bg-blue-500/10 text-blue-400 border-blue-500/20",
      };

    case "FULE_ADD":
      return {
        label: "FULE Added",
        icon: ArrowDownLeft,
        className:
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      };

    case "PI_FULE_ADD":
      return {
        label: "PI FULE Added",
        icon: ArrowDownLeft,
        className:
          "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      };

    case "EARN_WITHDRAW":
      return {
        label: "EARN Withdrawal",
        icon: ArrowUpRight,
        className:
          "bg-red-500/10 text-red-400 border-red-500/20",
      };

    default:
      return {
        label: "Transaction",
        icon: CircleDollarSign,
        className:
          "bg-slate-500/10 text-slate-400 border-slate-500/20",
      };
  }
}


/* =========================================================
   COMPONENT
========================================================= */

function VortaxaTransactionTypeBadge({
  type,
}) {
  const info = getTransactionTypeInfo(type);

  const Icon = info.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${info.className}`}
    >
      <Icon size={13} />
      {info.label}
    </span>
  );
}

export default VortaxaTransactionTypeBadge;