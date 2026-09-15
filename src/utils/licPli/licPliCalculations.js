export function calculateTotalPaid(
  premiumAmount,
  installmentPaid,
  gstAmountPaid
) {
  const premiumTotal =
    Number(premiumAmount || 0) *
    Number(installmentPaid || 0);

  const gstTotal =
    Number(gstAmountPaid || 0);

  return premiumTotal + gstTotal;
}

export function calculateSummary(policies = []) {
  const summary = {
    lic: {
      premiumAmount: 0,
      paid: 0,
    },
    pli: {
      premiumAmount: 0,
      paid: 0,
    },
    other: {
      premiumAmount: 0,
      paid: 0,
    },
  };

  policies.forEach((policy) => {
    const type = policy?.type;

    if (!summary[type]) return;

    summary[type].premiumAmount +=
      Number(policy.premiumAmount) || 0;

    summary[type].paid +=
      Number(policy.totalPaid) || 0;
  });

  return summary;
}