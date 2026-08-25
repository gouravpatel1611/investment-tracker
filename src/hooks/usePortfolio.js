import { useState } from "react";

export function usePortfolio() {
  const [portfolio] = useState([]);

  return {
    portfolio,
    loading: false,
    error: null,
  };
}