export function calculateTotalPaid(
  premiumAmount = 0,
  installmentPaid = 0
) {
  const premium = Number(premiumAmount) || 0;
  const installments = Number(installmentPaid) || 0;

  return premium * installments;
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