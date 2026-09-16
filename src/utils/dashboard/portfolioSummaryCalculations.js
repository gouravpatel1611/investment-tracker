// ==========================================
// DASHBOARD CALCULATIONS
// ==========================================
//
// Every asset calculation returns:
//
// {
//   invested: Number,
//   profit: Number,
// }
//
// Dashboard totals are calculated from
// these individual asset results.
//
// ==========================================


// ==========================================
// NUMBER HELPER
// ==========================================

export function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}


// ==========================================
// ROUNDING
// ==========================================

export function round(value) {
  return Number(
    toNumber(value).toFixed(2)
  );
}


// ==========================================
// CURRENCY FORMAT
// ==========================================

export function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(
    toNumber(value)
  );
}


// ==========================================
// MUTUAL FUNDS
// ==========================================

export function calculateMutualFunds() {
  return {
    invested: 100000,
    profit: 12000,
  };
}


// ==========================================
// SGB
// ==========================================

export function calculateSGB() {
  return {
    invested: 50000,
    profit: 7500,
  };
}


// ==========================================
// BONDS
// ==========================================

export function calculateBonds() {
  return {
    invested: 75000,
    profit: 5000,
  };
}


// ==========================================
// CPF
// ==========================================

export function calculateCPF() {
  return {
    invested: 200000,
    profit: 16000,
  };
}


// ==========================================
// LIC / PLI
// ==========================================

export function calculateLicPli() {
  return {
    invested: 40000,
    profit: 3000,
  };
}


// ==========================================
// ETF / STOCK
// ==========================================

export function calculateETFStock() {
  return {
    invested: 125000,
    profit: 18000,
  };
}


// ==========================================
// INT-FD
// ==========================================

export function calculateFD() {
  return {
    invested: 100000,
    profit: 7000,
  };
}


// ==========================================
// TOTAL DASHBOARD CALCULATION
// ==========================================

export function calculateDashboardTotals() {
  const mutualFunds =
    calculateMutualFunds();

  const sgb =
    calculateSGB();

  const bonds =
    calculateBonds();

  const cpf =
    calculateCPF();

  const licPli =
    calculateLicPli();

  const etfStock =
    calculateETFStock();

  const fd =
    calculateFD();

  const assets = [
    mutualFunds,
    sgb,
    bonds,
    cpf,
    licPli,
    etfStock,
    fd,
  ];


  // ========================================
  // TOTAL INVESTED
  // ========================================

  const totalInvested =
    assets.reduce(
      (total, asset) =>
        total +
        toNumber(
          asset.invested
        ),
      0
    );


  // ========================================
  // TOTAL PROFIT
  // ========================================

  const totalProfit =
    assets.reduce(
      (total, asset) =>
        total +
        toNumber(
          asset.profit
        ),
      0
    );


  // ========================================
  // CURRENT VALUE
  // ========================================

  const totalCurrentValue =
    totalInvested +
    totalProfit;


  // ========================================
  // TOTAL RETURN
  // ========================================

  const totalReturn =
    totalInvested > 0
      ? (
          totalProfit /
          totalInvested
        ) * 100
      : 0;


  // ========================================
  // RETURN
  // ========================================

  return {
    mutualFunds,
    sgb,
    bonds,
    cpf,
    licPli,
    etfStock,
    fd,

    totalInvested:
      round(
        totalInvested
      ),

    totalProfit:
      round(
        totalProfit
      ),

    totalCurrentValue:
      round(
        totalCurrentValue
      ),

    totalReturn:
      round(
        totalReturn
      ),
  };
}