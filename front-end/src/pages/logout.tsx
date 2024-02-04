import { useEffect } from "react";
import { useAuth } from "@/hooks";

export default function Logout() {
  const { handleLogout } = useAuth();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return null;
}
