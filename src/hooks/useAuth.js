import { useState } from "react";

export function useAuth() {
  const [user] = useState(null);

  return {
    user,
    isAuthenticated: Boolean(user),
    loading: false,
  };
}