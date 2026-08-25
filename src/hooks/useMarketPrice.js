import { useState } from "react";

export function useMarketPrice() {
  const [price] = useState(null);

  return {
    price,
    loading: false,
    error: null,
  };
}