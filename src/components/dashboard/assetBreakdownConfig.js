import {
  PieChart,
  BriefcaseBusiness,
  WalletCards,
  CircleGauge,
  Bitcoin,
  FileText,
  Gem,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";


export const assetBreakdownConfig = [

  // ========================================
  // MUTUAL FUNDS
  // ========================================

  {
    id:
      "mutualFunds",

    name:
      "MUTUAL FUNDS",

    type:
      "Equity & Hybrid",

    icon:
      PieChart,

    iconClass:
      "bg-purple-500/15 text-purple-300",

  },



  


  // ========================================
  // BONDS
  // ========================================

  {
    id:
      "bonds",

    name:
      "BONDS",

    type:
      "Fixed Income",

    icon:
      FileText,

    iconClass:
      "bg-blue-500/15 text-blue-300",

    value:
      0,

    holdings:
      0,

  },



  
  // ========================================
  // SGB
  // ========================================

  {
    id:
      "sgb",

    name:
      "SGB",

    type:
      "Sovereign Gold Bond",

    icon:
      Gem,

    iconClass:
      "bg-yellow-500/15 text-yellow-300",

  },




  // ========================================
  // CPF
  // ========================================

  {
    id:
      "cpf",

    name:
      "CPF",

    type:
      "Provident Fund",

    icon:
      BriefcaseBusiness,

    iconClass:
      "bg-cyan-500/15 text-cyan-300",

    value:
      0,

    holdings:
      0,

  },


  
  // ========================================
  // ETF STOCK
  // ========================================

  {
    id:
      "etfStock",

    name:
      "ETF-STOCK",

    type:
      "ETF & Stock",

    icon:
      TrendingUp,

    iconClass:
      "bg-sky-500/15 text-sky-300",

    value:
      0,

    holdings:
      0,

  },

  
  // ========================================
  // LIC
  // ========================================

  {
    id:
      "lic",

    name:
      "LIC-PLI-OTHER",

    type:
      "Life & Postal Insurance",

    icon:
      ShieldCheck,

    iconClass:
      "bg-emerald-500/15 text-emerald-300",

    value:
      0,

    holdings:
      0,

  },

  

  // ========================================
  // FD
  // ========================================

  {
    id:
      "fd",

    name:
      "INT-FD",

    type:
      "Fixed Deposit",

    icon:
      WalletCards,

    iconClass:
      "bg-amber-500/15 text-amber-300",

    value:
      0,

    holdings:
      0,

  },






];