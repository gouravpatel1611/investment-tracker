// ==========================================
// DASHBOARD CALCULATIONS
// ==========================================

import {
  calculateTotalBondFinancialSummary,
} from "../bondCalculations";

import {
  calculateCPF as calculateCPFData,
  calculateNVSCPF,
} from "../cpf/cpfCalculations";

import {
  calculateFdSummary,
} from "../intFd/intFdCalculations";


// ==========================================
// COMMON HELPERS
// ==========================================

export function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}


export function round(value) {
  return Number(
    toNumber(value).toFixed(2)
  );
}


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

export function calculateMutualFunds(
  holdings = []
) {
  const invested =
    holdings.reduce(
      (total, holding) =>
        total +
        toNumber(
          holding?.investedAmount
        ),
      0
    );

  const profit =
    holdings.reduce(
      (total, holding) =>
        total +
        toNumber(
          holding?.profitLoss
        ),
      0
    );

  const currentValue =
    invested +
    profit;

  return {
    invested:
      round(invested),

    profit:
      round(profit),

    holdings:
      holdings.length,

    currentValue:
      round(currentValue),
  };
}


// ==========================================
// SGB
// ==========================================

export function calculateSGB(
  summary = {}
) {
  const invested =
    toNumber(
      summary?.purchaseValue
    );

  const profit =
    toNumber(
      summary?.gain
    );

  const holdings =
    toNumber(
      summary?.seriesCount
    );

  const currentValue =
    invested +
    profit;

  return {
    invested:
      round(invested),

    profit:
      round(profit),

    holdings,

    currentValue:
      round(currentValue),
  };
}


// ==========================================
// BONDS
// ==========================================

export function calculateBonds(
  bonds = []
) {
  const summary =
    calculateTotalBondFinancialSummary(
      bonds
    );

  const principalAmount =
    toNumber(
      summary?.totalPrincipal
    );

  const principalReturn =
    toNumber(
      summary?.principalReceived
    );

  const interestReceived =
    toNumber(
      summary?.interestReceived
    );


  // ----------------------------------------
  // FINAL BOND DASHBOARD LOGIC
  // ----------------------------------------

  const invested =
    principalAmount -
    principalReturn;

  const profit =
    interestReceived;

  const currentValue =
    principalAmount +
    interestReceived -
    principalReturn;


  return {
    invested:
      round(invested),

    profit:
      round(profit),

    holdings:
      bonds.length,

    currentValue:
      round(currentValue),
  };
}


// ==========================================
// CPF
// ==========================================

export function calculateCPF(
  cpfRecord = null
) {

  // ----------------------------------------
  // NO CPF DATA
  // ----------------------------------------

  if (!cpfRecord) {
    return {
      invested: 0,
      profit: 0,
      holdings: 0,
      currentValue: 0,
    };
  }


  // ----------------------------------------
  // OWN CPF CALCULATION
  // ----------------------------------------

  const ownCalculation =
    calculateCPFData({
      openingBalance:
        cpfRecord?.own?.openingBalance,

      monthlyDeposit:
        cpfRecord?.own?.monthlyContribution,

      interestRates:
        cpfRecord?.own?.interestRates,

      financialYear:
        cpfRecord?.financialYear,
    });


  // ----------------------------------------
  // NVS CPF CALCULATION
  // ----------------------------------------

  const nvsCalculation =
    calculateNVSCPF({
      openingBalance:
        cpfRecord?.nvs?.openingBalance,

      basicPay:
        cpfRecord?.nvs?.basicPay,

      interestRates:
        cpfRecord?.nvs?.interestRates,

      financialYear:
        cpfRecord?.financialYear,
    });


  // ----------------------------------------
  // CLOSING BALANCES
  // ----------------------------------------

  const ownClosingBalance =
    toNumber(
      ownCalculation?.closingBalance
    );

  const nvsClosingBalance =
    toNumber(
      nvsCalculation?.closingBalance
    );


  // ----------------------------------------
  // TOTAL INTEREST
  // ----------------------------------------

  const ownInterest =
    toNumber(
      ownCalculation?.totalInterest
    );

  const nvsInterest =
    toNumber(
      nvsCalculation?.totalInterest
    );


  // ----------------------------------------
  // CURRENT VALUE
  // ----------------------------------------

  const currentValue =
    ownClosingBalance +
    nvsClosingBalance;


  // ----------------------------------------
  // PROFIT
  // ----------------------------------------

  const profit =
    ownInterest +
    nvsInterest;


  // ----------------------------------------
  // INVESTED
  // ----------------------------------------

  const invested =
    currentValue -
    profit;


  // ----------------------------------------
  // FINAL RESULT
  // ----------------------------------------

  return {
    invested:
      round(invested),

    profit:
      round(profit),

    holdings:
      2,

    currentValue:
      round(currentValue),
  };
}


// ==========================================
// LIC / PLI
// ==========================================

export function calculateLicPli(
  policies = []
) {

  // ----------------------------------------
  // TOTAL PAID
  // ----------------------------------------

  const totalPaid =
    policies.reduce(
      (total, policy) =>
        total +
        toNumber(
          policy?.totalPaid
        ),
      0
    );


  // ----------------------------------------
  // LIC / PLI HAS NO PROFIT
  // ----------------------------------------

  const invested =
    totalPaid;

  const profit =
    0;

  const currentValue =
    totalPaid;


  // ----------------------------------------
  // FINAL RESULT
  // ----------------------------------------

  return {
    invested:
      round(invested),

    profit:
      round(profit),

    holdings:
      policies.length,

    currentValue:
      round(currentValue),
  };
}


// ==========================================
// ETF / STOCK
// ==========================================

export function calculateETFStock(
  summary = {}
) {

  // ----------------------------------------
  // TOTAL INVESTED
  // ----------------------------------------

  const invested =
    toNumber(
      summary?.totalInvested
    );


  // ----------------------------------------
  // TOTAL PROFIT / LOSS
  // ----------------------------------------

  const profit =
    toNumber(
      summary?.totalProfitLoss
    );


  // ----------------------------------------
  // CURRENT VALUE
  // ----------------------------------------

  const currentValue =
    toNumber(
      summary?.totalCurrentValue
    );


  // ----------------------------------------
  // TOTAL HOLDINGS
  // ----------------------------------------

  const holdings =
    Number(
      summary?.totalHoldings
    ) || 0;


  // ----------------------------------------
  // FINAL RESULT
  // ----------------------------------------

  return {
    invested:
      round(invested),

    profit:
      round(profit),

    holdings,

    currentValue:
      round(currentValue),
  };
}


// ==========================================
// INT-FD
// ==========================================

export function calculateFD(
  fds = []
) {

  // ----------------------------------------
  // FD SUMMARY
  // ----------------------------------------

  const summary =
    calculateFdSummary(
      fds
    );


  // ----------------------------------------
  // TOTAL PRINCIPAL
  // ----------------------------------------

  const invested =
    toNumber(
      summary?.totalPrincipal
    );


  // ----------------------------------------
  // TILL-DATE INTEREST
  // ----------------------------------------

  const profit =
    toNumber(
      summary?.totalTillMonthInterest
    );


  // ----------------------------------------
  // CURRENT VALUE
  // ----------------------------------------

  const currentValue =
    invested +
    profit;


  // ----------------------------------------
  // FINAL RESULT
  // ----------------------------------------

  return {
    invested:
      round(
        invested
      ),

    profit:
      round(
        profit
      ),

    holdings:
      fds.length,

    currentValue:
      round(
        currentValue
      ),
  };
}


// ==========================================
// CENTRAL DASHBOARD CALCULATION
// ==========================================

export function calculateDashboardTotals(
  mutualFundHoldings = [],
  sgbSummary = {},
  bondData = [],
  cpfRecord = null,
  fdData = [],
  licPliPolicies = [],
  etfStockSummary = {}
) {

  // ========================================
  // INDIVIDUAL ASSET CALCULATIONS
  // ========================================

  const mutualFunds =
    calculateMutualFunds(
      mutualFundHoldings
    );


  const sgb =
    calculateSGB(
      sgbSummary
    );


  const bonds =
    calculateBonds(
      bondData
    );


  const cpf =
    calculateCPF(
      cpfRecord
    );


  const licPli =
    calculateLicPli(
      licPliPolicies
    );


  const etfStock =
    calculateETFStock(
      etfStockSummary
    );


  const fd =
    calculateFD(
      fdData
    );


  // ========================================
  // ASSETS
  // ========================================

  const assets = [
    {
      id: "mutualFunds",
      ...mutualFunds,
    },

    {
      id: "sgb",
      ...sgb,
    },

    {
      id: "bonds",
      ...bonds,
    },

    {
      id: "cpf",
      ...cpf,
    },

    {
      id: "lic",
      ...licPli,
    },

    {
      id: "etfStock",
      ...etfStock,
    },

    {
      id: "fd",
      ...fd,
    },
  ];


  // ========================================
  // CURRENT VALUE
  // ========================================

  const assetsWithValue =
    assets.map(
      (asset) => {

        const currentValue =
          asset.id === "bonds"
            ? asset.currentValue
            : toNumber(
                asset.currentValue
              );

        return {
          ...asset,

          currentValue:
            round(
              currentValue
            ),
        };
      }
    );


  // ========================================
  // SORT
  // Highest Current Value First
  // ========================================

  const sortedAssets =
    [...assetsWithValue].sort(
      (a, b) =>
        b.currentValue -
        a.currentValue
    );


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
  // TOTAL CURRENT VALUE
  // ========================================

  const totalCurrentValue =
    assetsWithValue.reduce(
      (total, asset) =>
        total +
        toNumber(
          asset.currentValue
        ),
      0
    );


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
  // DEBUG CONSOLE
  // ========================================

  console.group(
    "========== DASHBOARD CALCULATION =========="
  );


  // ========================================
  // MUTUAL FUNDS
  // ========================================

  console.group(
    "MUTUAL FUNDS"
  );

  console.log(
    "Invested:",
    formatCurrency(
      mutualFunds.invested
    )
  );

  console.log(
    "Profit:",
    formatCurrency(
      mutualFunds.profit
    )
  );

  console.log(
    "Current Value:",
    formatCurrency(
      mutualFunds.currentValue
    )
  );

  console.log(
    "Holdings:",
    mutualFunds.holdings
  );

  console.groupEnd();


  // ========================================
  // SGB
  // ========================================

  console.group(
    "SGB"
  );

  console.log(
    "Invested:",
    formatCurrency(
      sgb.invested
    )
  );

  console.log(
    "Profit:",
    formatCurrency(
      sgb.profit
    )
  );

  console.log(
    "Current Value:",
    formatCurrency(
      sgb.currentValue
    )
  );

  console.log(
    "Holdings:",
    sgb.holdings
  );

  console.groupEnd();


  // ========================================
  // BONDS
  // ========================================

  console.group(
    "BONDS"
  );

  console.log(
    "Total Principal:",
    formatCurrency(
      bondData.length
        ? calculateTotalBondFinancialSummary(
            bondData
          ).totalPrincipal
        : 0
    )
  );

  console.log(
    "Principal Returned:",
    formatCurrency(
      bondData.length
        ? calculateTotalBondFinancialSummary(
            bondData
          ).principalReceived
        : 0
    )
  );

  console.log(
    "Invested:",
    formatCurrency(
      bonds.invested
    )
  );

  console.log(
    "Interest Received:",
    formatCurrency(
      bonds.profit
    )
  );

  console.log(
    "Current Value:",
    formatCurrency(
      bonds.currentValue
    )
  );

  console.log(
    "Holdings:",
    bonds.holdings
  );

  console.groupEnd();


  // ========================================
  // CPF
  // ========================================

  console.group(
    "CPF"
  );

  console.log(
    "Invested:",
    formatCurrency(
      cpf.invested
    )
  );

  console.log(
    "Profit:",
    formatCurrency(
      cpf.profit
    )
  );

  console.log(
    "Current Value:",
    formatCurrency(
      cpf.currentValue
    )
  );

  console.log(
    "Holdings:",
    cpf.holdings
  );

  console.groupEnd();


  // ========================================
  // LIC / PLI
  // ========================================

  console.group(
    "LIC / PLI"
  );

  console.log(
    "Total Policies:",
    licPli.holdings
  );

  console.log(
    "Total Paid:",
    formatCurrency(
      licPli.invested
    )
  );

  console.log(
    "Invested:",
    formatCurrency(
      licPli.invested
    )
  );

  console.log(
    "Profit:",
    formatCurrency(
      licPli.profit
    )
  );

  console.log(
    "Current Value:",
    formatCurrency(
      licPli.currentValue
    )
  );

  console.log(
    "Holdings:",
    licPli.holdings
  );

  console.groupEnd();


  // ========================================
  // ETF / STOCK
  // ========================================

  console.group(
    "ETF / STOCK"
  );

  console.log(
    "Invested:",
    formatCurrency(
      etfStock.invested
    )
  );

  console.log(
    "Profit / Loss:",
    formatCurrency(
      etfStock.profit
    )
  );

  console.log(
    "Current Value:",
    formatCurrency(
      etfStock.currentValue
    )
  );

  console.log(
    "Holdings:",
    etfStock.holdings
  );

  console.groupEnd();


  // ========================================
  // INT-FD
  // ========================================

  console.group(
    "INT-FD"
  );

  console.log(
    "Total Principal:",
    formatCurrency(
      fd.invested
    )
  );

  console.log(
    "Till-Date Interest:",
    formatCurrency(
      fd.profit
    )
  );

  console.log(
    "Current Value:",
    formatCurrency(
      fd.currentValue
    )
  );

  console.log(
    "Holdings:",
    fd.holdings
  );

  console.groupEnd();


  // ========================================
  // BREAKDOWN
  // ========================================

  console.group(
    "----- BREAKDOWN -----"
  );


  console.log(
    "Invested:",
    formatCurrency(
      mutualFunds.invested
    ),
    "+",
    formatCurrency(
      sgb.invested
    ),
    "+",
    formatCurrency(
      bonds.invested
    ),
    "+",
    formatCurrency(
      cpf.invested
    ),
    "+",
    formatCurrency(
      licPli.invested
    ),
    "+",
    formatCurrency(
      etfStock.invested
    ),
    "+",
    formatCurrency(
      fd.invested
    ),
    "=",
    formatCurrency(
      totalInvested
    )
  );


  console.log(
    "Profit:",
    formatCurrency(
      mutualFunds.profit
    ),
    "+",
    formatCurrency(
      sgb.profit
    ),
    "+",
    formatCurrency(
      bonds.profit
    ),
    "+",
    formatCurrency(
      cpf.profit
    ),
    "+",
    formatCurrency(
      licPli.profit
    ),
    "+",
    formatCurrency(
      etfStock.profit
    ),
    "+",
    formatCurrency(
      fd.profit
    ),
    "=",
    formatCurrency(
      totalProfit
    )
  );


  console.log(
    "Current Value:",
    formatCurrency(
      mutualFunds.currentValue
    ),
    "+",
    formatCurrency(
      sgb.currentValue
    ),
    "+",
    formatCurrency(
      bonds.currentValue
    ),
    "+",
    formatCurrency(
      cpf.currentValue
    ),
    "+",
    formatCurrency(
      licPli.currentValue
    ),
    "+",
    formatCurrency(
      etfStock.currentValue
    ),
    "+",
    formatCurrency(
      fd.currentValue
    ),
    "=",
    formatCurrency(
      totalCurrentValue
    )
  );


  console.groupEnd();


  // ========================================
  // FINAL TOTALS
  // ========================================

  console.group(
    "----- FINAL TOTALS -----"
  );

  console.log(
    "Total Invested:",
    formatCurrency(
      totalInvested
    )
  );

  console.log(
    "Total Profit:",
    formatCurrency(
      totalProfit
    )
  );

  console.log(
    "Total Current Value:",
    formatCurrency(
      totalCurrentValue
    )
  );

  console.log(
    "Total Return:",
    `${round(
      totalReturn
    )}%`
  );

  console.groupEnd();


  // ========================================
  // SORTED ASSETS
  // ========================================

  console.log(
    "Sorted Assets:",
    sortedAssets.map(
      (asset) => ({
        asset:
          asset.id,

        invested:
          asset.invested,

        profit:
          asset.profit,

        currentValue:
          asset.currentValue,

        holdings:
          asset.holdings,
      })
    )
  );


  console.groupEnd();


  // ========================================
  // FINAL RESULT
  // ========================================

  return {

    assets:
      sortedAssets,

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