export function calculateProfitLoss(
  investedAmount,
  currentValue
) {
  return currentValue - investedAmount;
}

export function calculateReturnPercent(
  investedAmount,
  currentValue
) {
  if (!investedAmount) {
    return 0;
  }

  return (
    ((currentValue - investedAmount) /
      investedAmount) *
    100
  );
}